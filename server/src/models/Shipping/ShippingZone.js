const keystone = require( 'keystone');
const Types = keystone.Field.Types;

const ShippingZone = new keystone.List('ShippingZone');

ShippingZone.add({
  name: { type: String,  required: true, initial: true },
  shippingRates: { type: Types.Relationship, ref: 'ShippingRate', many: true },
  countries: { type: String,  required: true, initial: true },
});

ShippingZone.register();
