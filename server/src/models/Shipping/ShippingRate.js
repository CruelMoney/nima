const keystone = require( 'keystone');
const Types = keystone.Field.Types;

const ShippingRate = new keystone.List('ShippingRate');

ShippingRate.add({
  name: { type: String, required: true, initial: true },
  shippingMethod: { type: Types.Relationship, ref: 'ShippingMethod', required: true, initial: true},
  deliveryDescription: { type: String },
  description: { type: String, required: true, initial: true },
  minimumSpend: { type: Number },
  rateAmount: { type: Number },
});

ShippingRate.register();
