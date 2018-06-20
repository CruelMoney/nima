const keystone = require('keystone');
const express = require('express');
const cors = require('cors');
import * as middleware from './middleware';
import * as api from './api';
import adminRoutes from './admin';
const path = require('path');
const adminBuildPath = path.resolve(__dirname, 'admin');

const corsOptions = {
  origin: true,
  credentials: true
}

// Bind Routes
const controllers = (app) => {
  if(process.env.NODE_ENV === 'development'){
    app.use(cors(corsOptions));
  }

  app.use('/', middleware.initLocals);
  app.use('/admin', middleware.adminOnly);
  app.use('/admin', express.static(adminBuildPath));
  api.setup(app);
};

exports = module.exports = controllers;
