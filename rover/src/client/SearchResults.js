import React from 'react'

import SearchResult from './SearchResult'

const noResultsMessage = "We couldn't find any sitters that matched your criteria"

const SearchResults = props => (
  <div>
    <div>
      {props.pending ? "Loading..." :
        props.sitters.length === 0 ? <div className='no-results'>{noResultsMessage}</div> :
        props.sitters.map((sitter, index) =>
          <SearchResult key={index} number={index+1} sitter={sitter} />
        )
      }
    </div>
    <div className="pager">
      TODO PAGER
    </div>
  </div>
)

export default SearchResults
