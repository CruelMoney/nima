var async = require('async'),
keystone = require('keystone');
var Order = keystone.list('Order');
var Product = keystone.list('Product');
var Coupon = keystone.list('Coupon');
var Campaign = keystone.list('Campaign');
var ShippingOption = keystone.list('ShippingOption');
const {stripe} = require('../../logic/payments');
const emailService = require('../../logic/email');

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
    ...rest
  } = req.body;

  let dbPrice = 0;

  try {


    await emailService.addCustomer({
      email, 
      name:{
        first: first_name,
        last: last_name
      },
      receivesNewsletter: newsletter_subscribe
    });


    // Tasks for updating db items and validate price
    const tasks = items.map(item=>{
      return new Promise((resolve, reject)=>{
        Product.model.findById(item._id).exec((err, dbItem)=>{
          if(err || dbItem === null){
            return reject('Error getting product.');
          }

          const stock = JSON.parse(dbItem.stock);

          // check if stock is available
          const stockQuantity = stock.find(v => v.label === item.variation).stock;
          if(stockQuantity < item.quantity){
            if(stockQuantity === 0){
              return reject(`Sorry, no ${dbItem.title}s in ${item.variation} left.`);
            }
            return reject(`Sorry, only ${stockQuantity} ${dbItem.title}s in ${item.variation} left.`);
          }

          const newStock = stock.map(v =>{
            if(v.label === item.variation){
              return {...v, stock : v.stock - item.quantity}
            }else{
              return v;
            }
          });

          dbItem.set({ stock: JSON.stringify(newStock) });

          // add price to totalPrice
          dbPrice += dbItem.price * item.quantity;
    
          resolve(dbItem.save);
        });
      });
    })


    const updateTasks = await Promise.all(tasks);

    if(!!coupon_code){
        const couponQuery = { 'code': coupon_code };
        const coupon = await Coupon.model.findOne(couponQuery);
        if (!coupon) throw new Error("Coupon not valid.");
        const invalid = coupon.isInvalid();
        if(invalid){
          throw new Error(invalid);
        } 

        // calculate new price
        dbPrice = getPriceWithCoupon({
          price: dbPrice,
          coupon: coupon
        });
        
        // const updateCouponUses = coupon.set({ used: coupon.used+1 }).save;
        // updateTasks.push(updateCouponUses);
    }

    const DBShipping = await ShippingOption.model.findOne({ _id: shipping._id });
    if( DBShipping === null){
      throw new Error('Error getting shipping.');
    }
    // add shippingPrice to totalPrice
    dbPrice += DBShipping.price;
  

    // compare dbprice to requested price
    if(dbPrice !== total_price){
      return res.apiError(`Price does not match: ${dbPrice} and ${total_price}`);
    };


    // make stripe buy using dbprice
    const stripeResult = await stripe.charges.create({
      amount: total_price*100,
      capture: false,
      currency: "dkk",
      receipt_email: email,
      source: card_token,
      description: "Charge for " + email
    });

    console.log("saving everything");

    // Update stock
    await Promise.all(updateTasks.map(t => t && t()));

    // Create order
    const orderItems = items.map(i => {
      return{
        _id: i._id,
        description: i.title, 
        variation: i.variation,
        quantity: i.quantity,
        price: i.price,
        link: process.env.PUBLIC_URL + '/' + i.slug
      }
    });
    const order = new Order.model({
      items: JSON.stringify(orderItems),
      totalPrice: total_price, 
      stripeID: stripeResult.id,
      email: email,
      phone: phone,
      delivery: {
        type: shipping._id, 
        firstName: first_name,
        lastName: last_name,
        address: rest.address,
        city: rest.city,
        zip: rest.zip,
        country: rest.country
      }, 
      usedCouponCode: coupon_code
    });
    console.log("saving order");

    await order.save();


    emailService.sendEmail({
      receiverEmail: email,
      type: "ORDER_CONFIRMATION",
      items: orderItems,
      order,
      shipping: DBShipping
    });

    console.log("applying campaign");

    applyCampaigns({
      order,
      email
    });


    // return new product stock
    return res.apiResponse(order);

  } catch (error) {
    console.log(error)
    error = error.message || error;
    return res.apiError(error);
  }
}

// Capture stripe payment when order isSent
Order.schema.pre('save', function(next) {
  if (this.isModified('isSent') && this.isSent && !!this.stripeID) {
    stripe.charges.capture(this.stripeID, function(err, charge) {
      if(err){
        var err = new Error(err.message);
        return next(err);
      }else{
        return next();
      }
    });
  }
  return next();
});


const applyCampaigns = async ({order, email}) => {
  const campaigns = await Campaign.model.find().exec();
  return await Promise.all(campaigns.map(async campaign => {
      const { campaignType } = campaign;
      switch (campaignType) {
        // Create coupon on order
        case 1:
          const {discount, type, uses} = campaign;
          const coupon = await generateCoupon({
            name:     `Free coupon for order: ${order._id}`,
            type:     type,
            discount: discount,
            uses: uses
          });
          await emailService.sendEmail({
            receiverEmail: email,
            type: "COUPON",
            coupon,
            order,
          });
          return {campaign, coupon};
      
        default:
          break;
      }
    })
  );
}

const generateCoupon = async ({name, type, discount, uses}) => {
  const coupon = new Coupon.model({
    name          : name,
    type          : type,
    discount      : discount,
    uses          : !!uses ? uses : 1,
    valid         : true,
    isAutoCreated: true
  });

  await coupon.save();
  return coupon;
}


const getPriceWithCoupon = ({price, coupon}) => {
  if(!coupon) return price;
  const value = coupon.discount;

  switch (coupon.type) {
    case "Percentage":
      price -= (price/100*value);
      break;
    case "Value":
      price -= value;
      break;
    default:
      break;
  }
  if(price < 0){price = 0;}
  return price;
}


export {
  post
}