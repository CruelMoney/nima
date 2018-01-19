const keystone = require( 'keystone');
const Types = keystone.Field.Types;

const User = new keystone.List('User');

User.add({
  name: { type: Types.Name, required: true, index: true },
  email: { type: Types.Email, initial: true, required: true, index: true },
  password: { type: Types.Password, initial: true },
  isCustomer: { type: Boolean, initial: true },
  receivesNewsletter: { type: Boolean, initial: true },
  canAccessKeystone: { type: Boolean, initial: true, default: false },
  //orders: { type: Types.Relationship, ref: 'Order', many: true, dependsOn: { isCustomer: true } }
});

User.register();

exports = module.exports = {
  User
}

