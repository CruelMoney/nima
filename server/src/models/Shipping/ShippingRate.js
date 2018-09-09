const keystone = require( 'keystone');
const Types = keystone.Field.Types;

const ShippingRate = new keystone.List('ShippingRate');

ShippingRate.add({
  name: { type: String },
  shippingMethod: { type: Types.Relationship, ref: 'ShippingMethod' },
  deliveryDescription: { type: String },
  description: { type: String },
  minimumSpend: { type: Number },
  rateAmount: { type: Number },
});

ShippingRate.register();
