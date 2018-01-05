import React from 'react';

import SearchResult from './SearchResult';

import Pager from './Pager';

const noResultsMessage = "We couldn't find any sitters that matched your criteria";

const SearchResults = props => {
  if (props.pending) {
    return <div className='loading'>"Loading..."</div>;
  }
  if (props.sitters.length === 0) {
    return <div className='no-results'>{noResultsMessage}</div>
  }
  return (
    <div className="search-results-container">
      <div className='search-results'>
        <div className='results-page'>
          {
            props.sitters.map((sitter, index) =>
              <SearchResult
                key={index}
                number={index+1}
                sitter={sitter}
              />
            )
          }
        </div>
      </div>
      <div className="pager-container">
        <div className="pager">
          <Pager
            currentPage={props.pageNumber}
            totalPages={props.totalPages}
            onChange={props.changePageNumber}/>
        </div>
      </div>
    </div>
  );
};

export default SearchResults;
