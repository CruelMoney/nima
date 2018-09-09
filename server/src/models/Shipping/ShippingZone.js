const keystone = require( 'keystone');
const Types = keystone.Field.Types;

const ShippingZone = new keystone.List('ShippingZone');

ShippingZone.add({
  name: { type: String },
  shippingRates: { type: Types.Relationship, ref: 'ShippingRate', many: true },
  countries: { type: String },
});

ShippingZone.register();
