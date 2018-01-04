import React from 'react'

import SearchResult from './SearchResult'

const SearchResults = props => (
  <div>
    <div>
      {props.pending ? "Loading..." :
        props.sitters.map((sitter, index) =>
          <SearchResult key={index} number={index+1} sitter={sitter} />
        )
      }
    </div>
  </div>
)

export default SearchResults
