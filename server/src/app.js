const path = require('path');
const { Provider } = require("react-redux");
const React = require('react');
const { renderToNodeStream } = require("react-dom/server");
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

function handleUniversalRender(req, res) {
  const context = {};
  const stream = renderToNodeStream(
    <Provider store={getStoreFromRequest(req, res)}>
      <StaticRouter
          location={req.url}
          context={context}
        >
        <App />
      </StaticRouter>
    </Provider>
  );
  return stream;
}

const renderer = (req, res, stream, htmlData, options) => {
  // adding state to initial render
  const preloadedState = getStoreFromRequest(req, res).getState();
  
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