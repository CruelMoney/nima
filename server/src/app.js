const path = require('path');
const { Provider } = require("react-redux");
const React = require('react');
const { renderToNodeStream, renderToString } = require("react-dom/server");
const {default: staticLoader} = require('@cra-express/static-loader');
const {default: universalLoader} = require('@cra-express/universal-loader');
const express = require('express');
const {default: App} = require('../../src/App');
const clientBuildPath = path.resolve(__dirname, 'client');
const {default: configureStore} = require('../../src/store');
const {StaticRouter} = require('react-router-dom')
const serve = require('serve-static');
const favicon = require('serve-favicon');
const body = require('body-parser');
const cookieParser = require('cookie-parser');
const multer = require('multer');
const createRoutes = require('./routes');
const cookieSecret = process.env.cookieSecret || 'secretCookie';
const session = require('express-session');


const getStoreFromRequest = (req, res) =>{
  var initialState = {
    adminOverlay: {
      user: res.locals.user,
      publicURL: process.env.PUBLIC_URL,
    }
  }

  return configureStore(initialState);
}

const getApp = (req, store, context) => {
  return( 
  <Provider store={store}>
    <StaticRouter
        location={req.url}
        context={context}
      >
      <App />
    </StaticRouter>
  </Provider>)
  }

const handleUniversalRender = async (req, res) => {
  const store = getStoreFromRequest(req, res);
  let context = {
    store, 
    resolved: false,
    promises:[]
  }

  // Render one time to populate promises
  renderToString(getApp(req, store, context));
  
  // Await the fetching of the data
  const result = await Promise.all(context.promises);
  
  context.resolved = true 
  res.locals.context = context;
  res.locals.store = store;

  const stream = renderToNodeStream(getApp(req, store, context));
  
  return stream;

}

const renderer = (req, res, stream, htmlData, options) => {
  const preloadedState = res.locals.store.getState();

  htmlData = htmlData.replace(
    `"%PRELOADED_STATE%"`, 
    JSON.stringify(preloadedState).replace(/</g, '\\u003c')
  );  

  var segments = htmlData.split('<div id="root">');
  res.write(segments[0] + '<div id="root">');
  stream.pipe(res, { end: false });
  stream.on('end', function () {
    if (options.onEndReplace) {
      segments[1] = options.onEndReplace(segments[1]);
    }
    res.write(segments[1]);
    res.end();
  });

   
}

const setupUniversal = (app) => {
  createRoutes(app);
  staticLoader(app, { clientBuildPath });
  universalLoader(app, {
    universalRender: handleUniversalRender,
    handleRender: renderer,
    clientBuildPath
  });
}

module.exports = {
  setupUniversal
}