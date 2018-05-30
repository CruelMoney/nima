'use strict';
const keystone = require('keystone');
const Text = keystone.list('Text');
const Social = keystone.list('SocialConfiguration');
const General = keystone.list('GeneralConfiguration');
const APIs = keystone.list('APIsConfiguration');

module.exports = function(done) {
  Text.model.collection.dropAllIndexes(done);
}



