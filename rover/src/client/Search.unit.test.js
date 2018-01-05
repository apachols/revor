import React from 'react';
import ReactDOM from 'react-dom';

import { Search } from './Search';

// Integration test (non-shallow) without connect for Search component
it('renders empty search results', () => {
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
