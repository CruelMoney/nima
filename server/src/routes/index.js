const keystone = require('keystone');
import * as middleware from './middleware';
import * as api from './api';

// Bind Routes
const controllers = (app) => {
  app.use('/', middleware.initLocals);
  api.setup(app);
};

exports = module.exports = controllers;
