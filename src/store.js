import { 
  createStore, 
  applyMiddleware, 
  compose,
  combineReducers } from 'redux'
import { reducers } from 'cude-cms';
import theme from './theme/reducers';
import thunkMiddleware from 'redux-thunk'
import { persistStore, persistReducer } from 'redux-persist'
import storage from 'redux-persist/es/storage' // default: localStorage if web, AsyncStorage if react-native
import logger from 'redux-logger'


export default function configureStore(initialState = {}) {

  const persistConfig = {
    key: 'root',
    storage,
  };

  // Create the store with two middlewares
  const middlewares = [
    thunkMiddleware
  ];

  console.log(process.env);

  if(process.env.NODE_ENV !== 'production'){
    middlewares.push(logger);
  }

  const enhancers = [
    applyMiddleware(...middlewares)
  ];

  const { cart, ...themeReducers } = theme;
  
  const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

  const store = createStore(
    combineReducers({
      ...reducers,
      ...themeReducers,
      cart: persistReducer(persistConfig, cart),
    }),
    initialState,
    composeEnhancers(...enhancers)
  );

  let persistor = persistStore(store).purge();

  return { persistor, store }
}


export function configureStoreServer(initialState = {}) {

  // Create the store with two middlewares
  const middlewares = [
    thunkMiddleware
  ]

  const enhancers = [
    applyMiddleware(...middlewares)
  ]

  const store = createStore(
    combineReducers({
      ...reducers,
      ...theme
    }),
    initialState,
    compose(...enhancers)
  );

  return store 
}