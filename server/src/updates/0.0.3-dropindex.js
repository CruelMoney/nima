'use strict';
const keystone = require('keystone');
const User = keystone.list('User');
const Social = keystone.list('SocialConfiguration');
const General = keystone.list('GeneralConfiguration');
const APIs = keystone.list('APIsConfiguration');

module.exports = function(done) {
  User.model.collection.dropAllIndexes(done);
}



