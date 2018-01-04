import { createStore, applyMiddleware, compose } from 'redux'

// Our application reducer
import rootReducer from './root'

// MIDDLEWARE
import thunk from 'redux-thunk'
import logger from 'redux-logger'
import { routerMiddleware } from 'react-router-redux'
import promiseMiddleware from 'redux-promise-middleware'
import createHistory from 'history/createBrowserHistory'
export const history = createHistory()

const initialState = {}
const enhancers = []
const middleware = [
  thunk,
  promiseMiddleware(),
  routerMiddleware(history),
  logger
]
// END MIDDLEWARE
// ENHANCERS
if (process.env.NODE_ENV === 'development') {
  const devToolsExtension = window.devToolsExtension

  if (typeof devToolsExtension === 'function') {
    enhancers.push(devToolsExtension())
  }
}
// END ENHANCERS
// CREATE STORE
const composedEnhancers = compose(
  applyMiddleware(...middleware),
  ...enhancers
)

const store = createStore(
  rootReducer,
  initialState,
  composedEnhancers
)
// END CREATE STORE
export default store
