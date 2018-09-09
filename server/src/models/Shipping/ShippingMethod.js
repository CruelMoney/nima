const keystone = require( 'keystone');
const Types = keystone.Field.Types;

const ShippingMethod = new keystone.List('ShippingMethod');

ShippingMethod.add({
  name: { type: String },
  deliveryDescription: { type: String },
  description: { type: String },
  pacsoftCode: { type: String },
  pickupPoint: { type: Boolean, note:"This will make the shipping option show pickup points to choose as delivery address." },
});

ShippingMethod.register();
