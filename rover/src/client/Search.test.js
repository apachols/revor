import React from 'react';
import ReactDOM from 'react-dom';

// import { Provider } from 'react-redux'
// import { ConnectedRouter } from 'react-router-redux';
// import createHistory from 'history/createBrowserHistory';
// import { createStore, applyMiddleware, compose } from 'redux'
// import rootReducer from './root'

import { Search } from './Search';

// const history = createHistory();
//
// const store = createStore(
//   rootReducer
// );

it('renders without crashing', () => {
  const div = document.createElement('div');

  const testfn = () => { return []; }

  ReactDOM.render(
      <Search
        getSittersSearchResults={testfn}
        sitters={[]}
        totalPages={0}
        pageNumber={1}
        rating={1}
        pending={false}
      />
    , div);
});
