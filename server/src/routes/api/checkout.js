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
    first_name,
    last_name,
    shipping,
    total_price,
    newsletter_subscribe,
    ...rest
  } = req.body;

  let dbPrice = 0;

  try {

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

    const ValidateShippingTask = new Promise((resolve, reject) => {
        ShippingOption.model.findById(shipping._id).exec((err, DBShipping)=>{
          if(err || DBShipping === null){
            return reject('Error getting shipping.');
          }
          
          // add price to totalPrice
          dbPrice += DBShipping.price;

          resolve();
        })
    });

    tasks.push(ValidateShippingTask);

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

    if(newsletter_subscribe){
      updateTasks.push(
          () => console.log("added to email list")
      );
    }

    // Update stock
    await Promise.all(updateTasks.map(t => t && t()));

    // Create order
    const orderItems = items.map(i => {
      return{
        _id: i._id,
        description: i.title, 
        variation: i.variation,
        quantity: i.quantity
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