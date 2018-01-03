const keystone = require( 'keystone');
const Types = keystone.Field.Types;

const Order = new keystone.List('Order');

Order.add({
  items: { type: String },
  total_price: { type: Types.Money, format: '0.0,00 DKK' },
  stripeID: { type: String },
  is_sent: { type: Boolean, default: false },
  email: { type: String },
  phone: { type: String },
  delivery: {
    type: { type: String }, 
    first_name: {type: String },
    last_name: {type: String },
    address: { type: String },
    city: { type: String },
    zip:  {type: String },
    country: { type: String }
  }
});

Order.register();
