var async = require('async'),
keystone = require('keystone');
var stripe = require('stripe')(process.env.STRIPE_KEY);
var Order = keystone.list('Order');
var Product = keystone.list('Product');
var ShippingOption = keystone.list('ShippingOption');

/**
 * checkout
 */
const post = async (req, res) => {
  const {
    card_token,
    items,
    email,
    phone,
    address,
    first_name,
    last_name,
    shipping,
    total_price
  } = req.body;

  let dbPrice = 0;

  // Tasks for updating db items and validate price
  const tasks = items.map(item=>{
    return new Promise((resolve, reject)=>{
      Product.model.findById(item._id).exec((err, dbItem)=>{
        if(err || dbItem === null){
          return reject('Error getting item from database.');
        }

        const stock = JSON.parse(dbItem.stock);

        // check if stock is available
        const stockAmount = stock.find(v => v.label === item.variation).stock;
        if(stockAmount < item.amount){
          if(stockAmount === 0){
            return reject(`Sorry, no ${dbItem.title}s in ${item.variation} left.`);
          }
          return reject(`Sorry, only ${stockAmount} ${dbItem.title}s in ${item.variation} left.`);
        }

        const newStock = stock.map(v =>{
          if(v.label === item.variation){
            return {...v, stock : v.stock - item.amount}
          }else{
            return v;
          }
        });

        dbItem.set({ stock: JSON.stringify(newStock) });

        // add price to totalPrice
        dbPrice += dbItem.price * item.amount;

        resolve(dbItem.save);
      });
    });
  })

  const ValidateShippingTask = new Promise((resolve, reject) => {
      ShippingOption.model.findById(shipping.type).exec((err, DBShipping)=>{
        if(err || DBShipping === null){
          return reject('Error getting shipping from database.');
        }
        
        // add price to totalPrice
        dbPrice += DBShipping.price;

        resolve();
      })
  });

  tasks.push(ValidateShippingTask);

  try {
    const updateTasks = await Promise.all(tasks);

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

    console.log(stripeResult);

    // Update stock
    await Promise.all(updateTasks.map(t => t && t()));

    // Create order
    const order = new Order.model({
      items: JSON.stringify(items),
      totalPrice: total_price, 
      stripeID: stripeResult.id,
      email: email,
      phone: phone,
      delivery: {
        type: shipping.type, 
        firstName: first_name,
        lastName: last_name,
        ...address
      }
    });

    await order.save();

    // return new product stock
    return res.apiResponse(order);

  } catch (error) {
    error = error.message || error;
    return res.apiError(error);
  }
}

export {
  post
}