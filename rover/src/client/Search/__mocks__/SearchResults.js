import React from 'react'

const SearchResults = props => {
  return <div className="mock-search-results" onClick={() => { props.changePageNumber() } }>MockSearchResults</div>
}

export default SearchResults
