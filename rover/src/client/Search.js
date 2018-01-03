import React from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import {
  getSittersSearchResults
} from './actions'

const Search = props => (
  <div>
    <h1>Search</h1>
    <p>searchresults: {JSON.stringify(props.sitters)}</p>
    <button onClick={() => props.getSittersSearchResults()}>SEARCH</button>
  </div>
)

const mapStateToProps = state => ({
  sitters: state.search.sitters,
})

const mapDispatchToProps = dispatch => bindActionCreators({
  getSittersSearchResults
}, dispatch)

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Search)
