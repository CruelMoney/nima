const path = require("path");
const clientBuildPath = path.resolve(__dirname, "client");
const { default: staticLoader } = require("@cra-express/static-loader");
const { default: universalLoader } = require("@cra-express/universal-loader");
const { renderToNodeStream, renderToString } = require("react-dom/server");

const { Provider } = require("react-redux");
const React = require("react");
const { default: App } = require("../../src/App");
const { configureStoreServer } = require("../../src/store");
const { StaticRouter } = require("react-router-dom");
const { Helmet } = require("react-helmet");

const getStoreFromRequest = (req, res) => {
  var initialState = {
    adminOverlay: {
      user: res.locals.user,
      publicURL: process.env.PUBLIC_URL || "http://0.0.0.0:3001"
    }
  };
  console.log({ initialState });
  const store = configureStoreServer(initialState);
  return store;
};

const getApp = (req, store, context) => {
  return (
    <Provider store={store}>
      <StaticRouter location={req.url} context={context}>
        <App />
      </StaticRouter>
    </Provider>
  );
};

const handleUniversalRender = async (req, res) => {
  const store = getStoreFromRequest(req, res);
  let context = {
    store,
    resolved: false,
    promises: []
  };

  // Render one time to populate promises
  renderToString(getApp(req, store, context));

  // Await the fetching of the data
  let result = await Promise.all(context.promises);

  context.resolved = true;
  res.locals.context = context;
  res.locals.store = store;

  const stream = renderToNodeStream(getApp(req, store, context));

  return stream;
};

const renderer = async (req, res, stream, htmlData, options) => {
  const preloadedState = res.locals.store.getState();

  // This refreshes the helmet data
  renderToString(getApp(req, res.locals.store, res.locals.context));
  htmlData = addHelmetData(htmlData);

  htmlData = htmlData.replace(
    `"%PRELOADED_STATE%"`,
    JSON.stringify(preloadedState).replace(/</g, "\\u003c")
  );

  var segments = htmlData.split('<div id="root">');
  res.write(segments[0] + '<div id="root">');
  stream.pipe(
    res,
    { end: false }
  );
  stream.on("end", function() {
    if (options.onEndReplace) {
      segments[1] = options.onEndReplace(segments[1]);
    }
    res.write(segments[1]);
    res.end();
  });
};

// Adds the helmet markup to the end of head tag
const addHelmetData = htmlString => {
  const segments = htmlString.split("</head>");
  const helmet = Helmet.renderStatic();

  return `
    ${segments[0]}
      ${helmet.title.toString()}
      ${helmet.meta.toString()}
      ${helmet.link.toString()}
    </head>
    ${segments[1]}
  `;
};

const setupUniversal = app => {
  staticLoader(app, { clientBuildPath });
  universalLoader(app, {
    universalRender: handleUniversalRender,
    handleRender: renderer,
    clientBuildPath
  });
};

module.exports = {
  setupUniversal
};
