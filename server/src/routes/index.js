const keystone = require('keystone');
const express = require('express');
import * as middleware from './middleware';
import * as api from './api';
import adminRoutes from './admin';
const path = require('path');
const adminBuildPath = path.resolve(__dirname, 'admin');


// Bind Routes
const controllers = (app) => {
  app.use('/', middleware.initLocals);
  app.use('/admin', express.static(adminBuildPath));
  api.setup(app);
};

exports = module.exports = controllers;
