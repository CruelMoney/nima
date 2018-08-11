const keystone = require( 'keystone');
const mongoose = require('mongoose')
const AutoIncrement = require('mongoose-sequence')(mongoose);
const Types = keystone.Field.Types;


const ShippingOption = new keystone.List('ShippingOption');
const Order = new keystone.List('Order', {
  map: { name: 'orderID' },
  defaultColumns: "name, delivery.firstName, email, phone, totalPrice, createdAt, isSent, orderID",
  defaultSort: '-createdAt',
  track: {
    createdAt: true,
    createdBy: false,
    updatedAt: true,
    updatedBy: false,
  }
});

ShippingOption.add({
  name: { type: String },
  deliveryDescription: { type: String },
  description: { type: String },
  price: { type: Types.Money, format: '0.0,00 DKK' },
  pacsoftCode: { type: String },
  pickupPoint: { type: Boolean, note:"This will make the shipping option show pickup points to choose as delivery address." },
});

ShippingOption.register();


Order.add(
  {orderID: {type: Number,  noedit:true, hidden: true } },
  {heading: 'Shipping' }, 
  {delivery: {
    type: { type: Types.Relationship, ref: 'ShippingOption', many: false, required: true, initial: true  }, 
    firstName: {type: String, required: true, initial: true },
    lastName: {type: String, required: true, initial: true },
    address: { type: String, required: true, initial: true },
    city: { type: String, required: true, initial: true },
    zip:  {type: String, required: true, initial: true },
    country: { type: String, required: true, initial: true },
  }},
  {usedCouponCode: { type: String, noedit:true }},
  {isSent: { type: Boolean, default: false, note:"Checking this will charge the money on the customers card." }},
  'Information',
  {email: { type: Types.Email, required: true, initial: true }},
  {phone: { type: String, initial: true }},
  {totalPrice: { type: Types.Money, format: '0.0,00 DKK', required: true, initial: true }},
  {items: { type: String, noedit:true, required: true, initial: true }}, // need to be string to contain information about amount
  {stripeID: { type: String, noedit:true, required: true, initial: true }},
  {shippingID: { type: String, noedit:true }},
  {parcelID: { type: String }},
  {shippingLabel: { type: String, noedit:true }},
);

Order.schema.plugin(AutoIncrement, {inc_field: 'orderID'});

// Capture stripe payment when order isSent
Order.schema.pre('save', function(next) {
  const order = this;
  if (order.isModified('isSent') && order.isSent && !!order.stripeID) {
    //CALL API
    fetch(process.env.PUBLIC_URL+'/api/confirm', {
      method: 'POST',
      credentials: 'include',
      headers: new Headers({
        'Content-Type': 'application/json'
      }),
      body: JSON.stringify({order:order})
    })
    .then(result => result.json())
    .then(data => {
      const {error} = data;
      if(!!error){
        throw new Error(error);
      }
      return next();
    })
    .catch(err => {
      return next(err);
    });
  }else{
    return next();
  }
});


Order.register();
