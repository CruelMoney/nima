import { 
  createStore, 
  applyMiddleware, 
  compose,
  combineReducers } from 'redux'
import { reducers } from 'cude-cms';
import theme from './theme/reducers';
//import createLogger from 'redux-logger'
//import createSagaMiddleware from 'redux-saga'

//const logger = createLogger()
//const sagaMiddleware = createSagaMiddleware()

export default function configureStore(initialState = {}) {
  // Create the store with two middlewares
  const middlewares = [
  //  sagaMiddleware
  //, logger
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