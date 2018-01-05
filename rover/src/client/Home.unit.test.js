import React from 'react';
import ReactDOM from 'react-dom';

import { Provider } from 'react-redux'
import { createStore, applyMiddleware, compose } from 'redux'
import rootReducer from './root'

import Home from './Home';

const store = createStore(
  rootReducer
);

it('renders Home without crashing', () => {
  const div = document.createElement('div');

  ReactDOM.render(
    <Provider store={store}>
        <Home />
    </Provider>
    , div);
});
