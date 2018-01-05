import React from 'react';
import ReactDOM from 'react-dom';

// TODO move this boilerplate to a wrapper class
import { Provider } from 'react-redux'
import { ConnectedRouter } from 'react-router-redux';
import createHistory from 'history/createBrowserHistory';
import { createStore, applyMiddleware, compose } from 'redux'
import rootReducer from './root'
import App from './App';

const history = createHistory();

const store = createStore(
  rootReducer
);

// Integration test with connected App
it('renders Home without crashing', () => {
  const div = document.createElement('div');

  ReactDOM.render(
  <Provider store={store}>
    <ConnectedRouter history={history}>
      <App />
    </ConnectedRouter>
  </Provider>
    , div);
});
