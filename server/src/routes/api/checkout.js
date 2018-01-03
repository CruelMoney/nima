var async = require('async'),
keystone = require('keystone');

var Order = keystone.list('Order');
var Product = keystone.list('Product');

/**
 * checkout
 */
const post = (req, res) => {
  const {
    card_token,
    items,
    shipping,
    total_price
  } = req.body;

  let dbPrice = 0;
  

  // Iterate through dbItems 
  for (let item in items) {
    Product.model.findById(item._id).exec(function(err, dbItem) {
      if(err){
        return res.apiError('Error getting item from database.');
      }

      // check if stock is available
      const stock = dbItem.stock.find(v => v.label === item.variation).stock;
      if(stock < item.amount){
        if(stock === 0){
          return res.apiError(`Sorry, no ${item.name} in ${item.variation} left.`);
        }
        return res.apiError(`Sorry, only ${stock} ${item.name} in ${item.variation} left.`);
      }

      dbPrice += dbItem.price * item.amount;

    });

   
    // add price to totalPrice
  }

  // compare dbprice to requested price
  if(dbPrice !== total_price){
    return res.apiError('Price does not match');
  }

  // make stripe buy using dbprice



  // count down stock

  // save order 
  var order = new Order.model({

  });


  // return new product stock
  return res.apiResponse(items);
}

export {
  post
}