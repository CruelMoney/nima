var async = require('async'),
keystone = require('keystone');
var Coupon = keystone.list('Coupon');


const get = async (req, res) => {
  const coupon_code = req.params.coupon_code;
  try {
    const query = { 'code': coupon_code };
    const coupon = await Coupon.model.findOne(query);
    if (!coupon) throw new Error("Coupon not valid.");
    const invalid = coupon.isInvalid();
    if(invalid){
      throw new Error(invalid);
    } 
    return res.apiResponse(JSON.stringify(coupon));
  } catch (error) {
    console.log(error)
    error = error.message || error;
    return res.apiError(error);
  }
}



export {
  get
}