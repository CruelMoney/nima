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
  }

  // Create the store with two middlewares
  const middlewares = [
    thunkMiddleware,
    logger
  ]

  const enhancers = [
    applyMiddleware(...middlewares)
  ]

  const store = createStore(
    combineReducers({
      ...reducers,
      ...theme,
      cart: persistReducer(persistConfig, theme.cart),
    }),
    initialState,
    compose(...enhancers)
  );

  let persistor = persistStore(store)

  return { persistor, store }
}


export function configureStoreServer(initialState = {}) {

  // Create the store with two middlewares
  const middlewares = [
    thunkMiddleware,
    logger
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