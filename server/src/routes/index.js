const keystone = require('keystone');
import * as middleware from './middleware';
import * as api from './api';

// Bind Routes
const controllers = (app) => {
  app.use('/', middleware.initLocals);
  app.get('/api/pages', api.pages);
};

exports = module.exports = controllers;
