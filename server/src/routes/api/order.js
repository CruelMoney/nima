var async = require('async'),
keystone = require('keystone');
var Order = keystone.list('Order');
const {stripe} = require('../../logic/payments');


/**
 * getPaymentStatus
 */
const getPaymentStatus = async (req, res) => {
  try {
    const charge = await stripe.charges.retrieve(req.params.chargeID);
    const status = !charge.captured ? 'Uncaptured' : charge.status;
    return res.apiResponse(status);
  } catch (error) {
    console.log(error)
    error = error.message || error;
    return res.apiError(error);
  }
}


export {
  getPaymentStatus
}