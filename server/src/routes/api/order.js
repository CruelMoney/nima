var async = require("async"),
  keystone = require("keystone");
var Order = keystone.list("Order");
var Product = keystone.list("Product");
const { stripe } = require("../../logic/payments");

/**
 * getPaymentStatus
 */
const getPaymentStatus = async (req, res) => {
  try {
    const { chargeID } = req.params;
    // some payments made with old stripe charge api
    const isCharge = chargeID.includes("ch_");
    let status = "Uncaptured";
    if (isCharge) {
      const charge = await stripe.charges.retrieve(chargeID);
      status = !charge.captured ? "Uncaptured" : charge.status;
      status = !charge.amount_refunded
        ? status
        : "Refunded: " + charge.amount_refunded / 100;
    } else {
      const intent = await stripe.paymentIntents.retrieve(chargeID);

      status = intent.status;
      status = status === "requires_capture" ? "Uncaptured" : intent.status;
    }

    return res.apiResponse(status.toLowerCase());
  } catch (error) {
    console.log(error);
    error = error.message || error;
    return res.apiError(error);
  }
};

/**
 * cancel
 */
const cancel = async (req, res) => {
  try {
    return res.apiResponse();
  } catch (error) {
    console.log(error);
    error = error.message || error;
    return res.apiError(error);
  }
};

/**
 * refund
 */
const refund = async (req, res) => {
  try {
    const { amount, extendedReason, reason, updateStock, order } = req.body;

    // refund stripe
    const refund = await stripe.refunds.create({
      charge: order.stripeID,
      amount: amount * 100,
      reason,
      metadata: { extendedReason }
    });

    // update stock if set
    if (updateStock) {
      const orderedItems = JSON.parse(order.items);
      for (let item of orderedItems) {
        const product = await Product.model.findOne({ _id: item._id });
        if (!product) {
          throw new Error("Error getting product.");
        }
        const variants = JSON.parse(product.variants);
        const newStock = variants.map(v => {
          if (v.sku === item.variation.sku) {
            return { ...v, inventory: v.inventory + item.quantity };
          } else {
            return v;
          }
        });
        product.set({ variants: JSON.stringify(newStock) });
        await product.save();
      }
    }

    return res.apiResponse(order);
  } catch (error) {
    console.log(error);
    error = error.message || error;
    return res.apiError(error);
  }
};

export { getPaymentStatus, refund };
