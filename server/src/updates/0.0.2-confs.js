'use strict';
const keystone = require('keystone');
const Social = keystone.list('SocialConfiguration');
const General = keystone.list('GeneralConfiguration');
const APIs = keystone.list('APIsConfiguration');

module.exports = function(done) {
  new Social.model({
  }).save();
  new General.model({
  }).save();
  new APIs.model({
  }).save(done);
};