import { createStore, applyMiddleware, compose } from 'redux'
import { routerMiddleware } from 'react-router-redux'
import thunk from 'redux-thunk'
import createHistory from 'history/createBrowserHistory'

import promiseMiddleware from 'redux-promise-middleware';

import logger from 'redux-logger'
// const logger = createLogger({
//   // ...options
// });

import rootReducer from './root'

export const history = createHistory()

const initialState = {}
const enhancers = []
const middleware = [
  thunk,
  promiseMiddleware(),
  routerMiddleware(history),
  logger
]

if (process.env.NODE_ENV === 'development') {
  const devToolsExtension = window.devToolsExtension

  if (typeof devToolsExtension === 'function') {
    enhancers.push(devToolsExtension())
  }
}

const composedEnhancers = compose(
  applyMiddleware(...middleware),
  ...enhancers
)

const store = createStore(
  rootReducer,
  initialState,
  composedEnhancers
)

export default store
