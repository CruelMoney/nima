const keystone = require( 'keystone');
const mongoose = require('mongoose')
const Types = keystone.Field.Types;

const Coupon = new keystone.List('Coupon');

Coupon.add({
  name      : { type: String        , required  : true, initial: true               },
  code      : { type: String        , required  : true, initial: true, note: "The code to be entered by the customer"                               },
  type      : { type: Types.Select  , options   : 'Percentage, Value', required: true, initial: true, note: "Is the discount a percentage of the order or a fixed amount?" },
  discount  : { type: Number        , required  : true, initial: true, note: "The actual discount, if the type is percentage enter a number between 0 and 100, otherwise any number."                                },
  uses      : { type: Number        , required  : true, default: -1, initial: true, note: "How many times can the coupon code be used? Set -1 for unlimited uses."                                },
  used      : { type: Number        ,     noedit: true,  default: 0,   note: "How many times the coupon has been used."    },
  validFrom    : { type: Types.Datetime, initial: true, deafult: Date.now, note: "From when can the coupon be used?"  },
  expiry    : { type: Types.Datetime, initial: true, note: "Should the coupon code expire some date? Leave empty for no expiry."   },
  valid     : { type: Types.Boolean , default   : true, note: "Uncheck this to invalidate the coupon code. "       },
});


function isInvalid({
  expiry, 
  validFrom,
  valid,
  uses,
  used
}){
  if(!valid){
    return "Coupon invalid."
  }
  if(uses >= 0 && used >= uses){
    return "Coupon already used."
  }
  const now = new Date();
  if(!!expiry && expiry < now){
    return "Coupon expired."
  }
  if(!!validFrom && validFrom > now){
    return `Coupon not valid yet.`
  }

  return false;
}

Coupon.schema.methods.isInvalid = function(){ return isInvalid(this) }; 


Coupon.register();

