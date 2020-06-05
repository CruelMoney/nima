var async = require("async"),
  keystone = require("keystone");
var Order = keystone.list("Order");
var Product = keystone.list("Product");
var Coupon = keystone.list("Coupon");
var Campaign = keystone.list("Campaign");
var ShippingRate = keystone.list("ShippingRate");
const { stripe } = require("../../logic/payments");
const emailService = require("../../logic/email");
const shipping = require("../../logic/shipping");

/**
 * checkout
 */
const post = async (req, res) => {
  const {
    card_token,
    items,
    email,
    phone,
    first_name,
    last_name,
    shipping,
    total_price,
    coupon_code,
    newsletter_subscribe,
    payment_method_id,
    paymentIntent,
    ...rest
  } = req.body;

  let dbPrice = 0;

  try {
    await emailService.addCustomer({
      email,
      name: {
        first: first_name,
        last: last_name
      },
      receivesNewsletter: newsletter_subscribe
    });

    const productCache = {};

    // Tasks for updating db items and validate price
    const tasks = items.map(item => {
      return new Promise((resolve, reject) => {
        Product.model.findById(item._id).exec((err, dbItem) => {
          if (err || dbItem === null) {
            return reject("Error getting product.");
          }

          if (!!productCache[item._id]) {
            dbItem = productCache[item._id];
          }

          const variants = JSON.parse(dbItem.variants);

          // check if stock is available
          const variantsQuantity = variants.find(
            v => v.sku === item.variation.sku
          ).inventory;
          if (variantsQuantity < item.quantity) {
            if (variantsQuantity === 0) {
              return reject(`Sorry, no ${dbItem.title}s left.`);
            }
            return reject(
              `Sorry, only ${variantsQuantity} ${dbItem.title}s left.`
            );
          }

          const newStock = variants.map(v => {
            if (v.sku === item.variation.sku) {
              // add price to totalPrice
              const price = dbItem.salePrice || v.price;
              dbPrice += price * item.quantity;
              return { ...v, inventory: v.inventory - item.quantity };
            } else {
              return v;
            }
          });

          dbItem.set({ variants: JSON.stringify(newStock) });

          productCache[item._id] = dbItem;

          resolve(dbItem);
        });
      });
    });

    const toBeSaved = await Promise.all(tasks);

    if (!!coupon_code) {
      const couponQuery = { code: coupon_code };
      const coupon = await Coupon.model.findOne(couponQuery);
      if (!coupon) throw new Error("Coupon not valid.");
      const invalid = coupon.isInvalid();
      if (invalid) {
        throw new Error(invalid);
      }

      // calculate new price
      dbPrice = getPriceWithCoupon({
        price: dbPrice,
        coupon: coupon
      });

      coupon.set({ used: coupon.used + 1 });
      toBeSaved.push(coupon);
    }

    const DBShipping = await ShippingRate.model.findOne({ _id: shipping._id });
    if (DBShipping === null) {
      throw new Error("Error getting shipping.");
    }

    // Check for minimum spend
    if (dbPrice < DBShipping.minimumSpend) {
      return res.apiError(
        `Brug ${DBShipping.minimumSpend -
          dbPrice} DKK mere for at bruge denne forsendelse`
      );
    }

    // add shippingPrice to totalPrice
    dbPrice += DBShipping.rateAmount;

    // compare dbprice to requested price
    if (dbPrice !== total_price) {
      return res.apiError(
        `Price does not match: ${dbPrice} and ${total_price}`
      );
    }

    try {
      if (payment_method_id) {
        console.log("Creating payment intent");
        // Create the PaymentIntent
        const intent = await stripe.paymentIntents.create({
          payment_method: payment_method_id,
          amount: total_price * 100,
          currency: "dkk",
          receipt_email: email,
          confirmation_method: "manual",
          confirm: true,
          capture_method: "manual"
        });
        // Send the response to the client
        return res.send(generate_payment_response(intent));
      } else if (
        paymentIntent &&
        ["requires_action", "requires_confirmation"].includes(
          paymentIntent.status
        )
      ) {
        console.log("Confirming payment intent");
        await stripe.paymentIntents.confirm(paymentIntent.id);
      }
    } catch (e) {
      // Display error on client
      console.log({ error: e });
      return res.send({ error: e.message });
    }

    // Update stock
    await Promise.all(toBeSaved.map(e => !!e.save && e.save()));

    // Create order
    const orderItems = items.map(i => {
      return {
        _id: i._id,
        description: i.title,
        variation: i.variation,
        quantity: i.quantity,
        price: i.salePrice || i.variation.price,
        link: process.env.PUBLIC_URL + "/" + i.slug,
        SKU: i.variation.sku
      };
    });
    const order = new Order.model({
      items: JSON.stringify(orderItems),
      totalPrice: total_price,
      stripeID: paymentIntent.id,
      email: email,
      phone: phone,
      delivery: {
        type: shipping._id,
        firstName: first_name,
        lastName: last_name,
        address: rest.address,
        city: rest.city,
        zip: rest.zip,
        country: rest.country,
        countryCode: rest.countryCode
      },
      usedCouponCode: coupon_code
    });

    console.log("Creating new order: ", order.id);

    await order.save();

    emailService.sendEmail({
      receiverEmail: email,
      type: "ORDER_CONFIRMATION",
      items: orderItems,
      order,
      shipping: DBShipping
    });
    emailService.sendEmail({
      receiverEmail: "nimacph@gmail.com",
      type: "ORDER_CONFIRMATION",
      items: orderItems,
      order,
      shipping: DBShipping
    });

    applyCampaigns({
      order,
      email
    });

    // return new product stock
    res.status(201);
    return res.apiResponse(order);
  } catch (error) {
    console.log(error);
    error = error.message || error;
    return res.apiError(error);
  }
};

const applyCampaigns = async ({ order, email }) => {
  const campaigns = await Campaign.model.find().exec();
  return await Promise.all(
    campaigns.map(async campaign => {
      const { campaignType } = campaign;
      switch (campaignType) {
        // Create coupon on order
        case 1:
          const { discount, type, uses } = campaign;
          const coupon = await generateCoupon({
            name: `Free coupon for order: ${order._id}`,
            type: type,
            discount: discount,
            uses: uses
          });
          await emailService.sendEmail({
            receiverEmail: email,
            type: "COUPON",
            coupon,
            order
          });
          return { campaign, coupon };

        default:
          break;
      }
    })
  );
};

const generateCoupon = async ({ name, type, discount, uses }) => {
  const coupon = new Coupon.model({
    name: name,
    type: type,
    discount: discount,
    uses: !!uses ? uses : 1,
    valid: true,
    isAutoCreated: true
  });

  await coupon.save();
  return coupon;
};

const getPriceWithCoupon = ({ price, coupon }) => {
  if (!coupon) return price;
  const value = coupon.discount;

  switch (coupon.type) {
    case "Percentage":
      price -= (price / 100) * value;
      break;
    case "Value":
      price -= value;
      break;
    default:
      break;
  }
  if (price < 0) {
    price = 0;
  }
  return price;
};

const confirmOrder = async (req, res) => {
  try {
    const { order, charge } = req.body;
    if (order === null) {
      throw new Error("Error getting order.");
    }
    const dbOrder = await Order.model.findOne({ _id: order._id }).populate({
      path: "delivery.type",
      populate: {
        path: "shippingMethod"
      }
    });
    if (dbOrder === null) {
      throw new Error("Error getting order from database.");
    }
    const pacsoftCode =
      dbOrder.delivery.type.pacsoftCode ||
      dbOrder.delivery.type.shippingMethod.pacsoftCode;

    if (!dbOrder.shippingID) {
      const shipment = await shipping.getOrderShipment({
        ...dbOrder.toObject(),
        pacsoftCode
      });
      dbOrder.set({
        shippingID: shipment.id,
        shippingLabel: shipment.label,
        parcelID: shipment.parcelID
      });
      await dbOrder.save();
    }
    const sendCharge = {};
    if (!!charge && !!charge.amount) {
      sendCharge.amount_to_capture = charge.amount * 100;
    }

    await stripe.paymentIntents.capture(dbOrder.stripeID, sendCharge);

    // await emailService.sendEmail({
    //   receiverEmail: order.email,
    //   type: "SHIPPING_CONFIRMATION",
    //   order: order,
    // });
    return res.apiResponse(dbOrder);
  } catch (error) {
    console.log(error);
    error = error.message || error;
    return res.apiError(error);
  }
};

const generate_payment_response = intent => {
  // Note that if your API version is before 2019-02-11, 'requires_action'
  // appears as 'requires_source_action'.
  if (
    intent.status === "requires_action" &&
    intent.next_action.type === "use_stripe_sdk"
  ) {
    // Tell the client to handle the action
    return {
      requires_action: true,
      payment_intent_client_secret: intent.client_secret,
      paymentIntent: intent
    };
  } else if (intent.status === "succeeded") {
    // The payment didn’t need any additional actions and completed!
    // Handle post-payment fulfillment
    return {
      success: true,
      paymentIntent: intent
    };
  } else if (intent.status === "requires_capture") {
    return {
      success: true,
      paymentIntent: intent
    };
  } else {
    // Invalid status
    return {
      error: "Invalid PaymentIntent status"
    };
  }
};

const deliveryPoints = async (req, res) => {
  const { zip, city, street, countryCode } = req.body;
  return shipping
    .getDeliveryPoints({ zip, city, street, countryCode })
    .then(data => {
      return res.apiResponse(data);
    })
    .catch(error => {
      console.log({ error });
      return res.apiError(error);
    });
};

export { post, confirmOrder, deliveryPoints };
