'use strict';
const keystone = require('keystone');
const User = keystone.list('User');
const Social = keystone.list('SocialConfiguration');
const General = keystone.list('GeneralConfiguration');
const APIs = keystone.list('APIsConfiguration');
const Homepage = keystone.list('Homepage');

module.exports = function(done) {
  new User.model({
    name: { first: 'admin', last: 'user' },
    email: 'chrdengso@gmail.com',
    password: 'password',
    canAccessKeystone: true
  }).save();
  new Social.model({
  }).save();
  new General.model({
  }).save();
  new APIs.model({
  }).save();
  new Homepage.model({
      title: "Homepage"
  }).save(done);
}



