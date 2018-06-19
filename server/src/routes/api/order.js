var async = require('async'),
keystone = require('keystone');
var Order = keystone.list('Order');
var Product = keystone.list('Product');
const {stripe} = require('../../logic/payments');


/**
 * getPaymentStatus
 */
const getPaymentStatus = async (req, res) => {
  try {
    const charge = await stripe.charges.retrieve(req.params.chargeID);
    let status = !charge.captured ? 'Uncaptured' : charge.status;
    status = !charge.amount_refunded ? status : ('Refunded: ' + charge.amount_refunded/100);
    return res.apiResponse(status);
  } catch (error) {
    console.log(error)
    error = error.message || error;
    return res.apiError(error);
  }
}

/**
 * cancel
 */
const cancel = async (req, res) => {
  try {
    return res.apiResponse();
  } catch (error) {
    console.log(error)
    error = error.message || error;
    return res.apiError(error);
  }
}


/**
 * refund
 */
const refund = async (req, res) => {
  try {
    const {
      amount,
      extendedReason,
      reason,
      updateStock,
      order
    } = req.body;
    
    // refund stripe
    const refund = await stripe.refunds.create({
      charge: order.stripeID,
      amount: amount*100,
      reason,
      metadata: { extendedReason }
    });

    // update stock if set
    if(updateStock){
      const orderedItems = JSON.parse(order.items);
      for (let item of orderedItems){
        console.log({item})
        const product = await Product.model.findOne({_id:item._id});
        if(!product){
          throw new Error('Error getting product.');
        }
        const stock = JSON.parse(product.stock);
        const newStock = stock.map(v =>{
          if(v.label === item.variation){
            return {...v, stock : v.stock + item.quantity}
          }else{
            return v;
          }
        });
        product.set({ stock: JSON.stringify(newStock) });
        await product.save();
      }
    }

    return res.apiResponse(order);
  } catch (error) {
    console.log(error)
    error = error.message || error;
    return res.apiError(error);
  }
}

export {
  getPaymentStatus,
  refund
}