import { 
  createStore, 
  applyMiddleware, 
  compose,
  combineReducers } from 'redux'
import { reducers } from 'cude-cms';
import theme from './theme/reducers';
import thunkMiddleware from 'redux-thunk'
import logger from 'redux-logger'

export default function configureStore(initialState = {}) {
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
  )

  // Extensions
  //store.runSaga = sagaMiddleware.run
  store.asyncReducers = {} // Async reducer registry

  return store
}