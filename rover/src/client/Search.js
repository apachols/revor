import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import SearchResults from './SearchResults'

import StarRatingComponent from 'react-star-rating-component';

import './Search.css'

import {
  getSittersSearchResults,
  changeMinimumRating
} from './actions'

export class Search extends Component {
  componentWillMount() {
    this.props.getSittersSearchResults(this.props.rating)
  }

  onStarClick(nextValue, prevValue, name) {
    this.props.changeMinimumRating(nextValue);
    this.props.getSittersSearchResults(nextValue);
  }

  render() {
    return (
      <div>
        <div className="search-box">
          <div>Show me sitters with mininum rating:</div>
          <StarRatingComponent
              name="searchStars"
              starCount={5}
              value={this.props.rating}
              onStarClick={this.onStarClick.bind(this)}
          />
        </div>
        <SearchResults sitters={this.props.sitters} pending={this.props.pending} />
      </div>
    )
  }
}

const mapStateToProps = state => ({
  sitters: state.search.sitters,
  pending: state.search.pending,
  rating: state.search.rating
})

const mapDispatchToProps = dispatch => bindActionCreators({
  changeMinimumRating,
  getSittersSearchResults
}, dispatch)

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Search)
