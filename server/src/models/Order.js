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
    trackingCode: { type: String },
    estimatedDelivery: { type: String }
  }},
  {usedCouponCode: { type: String, noedit:true }},
  {isSent: { type: Boolean, default: false, note:"Checking this will charge the money on the customers card." }},
  'Information',
  {email: { type: Types.Email, required: true, initial: true }},
  {phone: { type: String, initial: true }},
  {totalPrice: { type: Types.Money, format: '0.0,00 DKK', required: true, initial: true }},
  {items: { type: String, noedit:true, required: true, initial: true }}, // need to be string to contain information about amount
  {stripeID: { type: String, noedit:true, required: true, initial: true }},
);

Order.schema.plugin(AutoIncrement, {inc_field: 'orderID'});



Order.register();
