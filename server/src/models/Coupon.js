const keystone = require( 'keystone');
const mongoose = require('mongoose')
const Types = keystone.Field.Types;

const Coupon = new keystone.List('Coupon');

Coupon.add({
  name      : { type: String        , required  : true                                },
  code      : { type: String        , required  : true                                },
  type      : { type: Types.Select  , options   : 'Percentage, Value', required: true },
  discount  : { type: Number        , required  : true                                },
  valid     : { type: Types.Boolean , default   : false                               },
  uses      : { type: Number        , required  : true    }
});
Coupon.register();

