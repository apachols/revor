import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import {
  getSittersSearchResults
} from './actions'

class Search extends Component {
  componentWillMount() {
    this.props.getSittersSearchResults()
  }
  render() {
    return (
      <div>
        <h1>Search</h1>
        <button onClick={() => this.props.getSittersSearchResults()}>SEARCH</button>
        <p>searchresults:</p>
        <div>
          {this.props.pending ? "Loading..." :
            JSON.stringify(this.props.sitters)
          }
        </div>
      </div>
    )
  }
}

const mapStateToProps = state => ({
  sitters: state.search.sitters,
  pending: state.search.pending
})

const mapDispatchToProps = dispatch => bindActionCreators({
  getSittersSearchResults
}, dispatch)

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Search)
