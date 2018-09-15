const keystone = require( 'keystone');
const Types = keystone.Field.Types;

const ShippingMethod = new keystone.List('ShippingMethod');

ShippingMethod.add({
  name: { type: String,  required: true, initial: true },
  deliveryDescription: { type: String },
  description: { type: String,  required: true, initial: true },
  pacsoftCode: { type: String,  required: true, initial: true },
  pickupPoint: { type: Boolean, note:"This will make the shipping option show pickup points to choose as delivery address." },
});

// also delete all shipping rates using this method
ShippingMethod.schema.pre('remove', function (next) {
  this.model('ShippingRate').remove({ shippingMethod: this._id }, next);
});

ShippingMethod.register();

