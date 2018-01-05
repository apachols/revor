import React from 'react'

const SearchBox = props => {
  return <div className="mock-search-box" onClick={() => { props.onRatingChange() } }>MockSearchBox</div>
}

export default SearchBox
