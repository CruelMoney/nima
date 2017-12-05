const keystone = require('keystone');
import * as middleware from './middleware';

// Bind Routes
const controllers = (app) => {
  app.use('/', middleware.initLocals);

  app.get('/hey', (req, res, next)=>{
    res.send('hey');
  });

};

exports = module.exports = controllers;
