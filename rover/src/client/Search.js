import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import SearchResults from './SearchResults'

import StarRatingComponent from 'react-star-rating-component';

import './Search.css'

import {
  getSittersSearchResults,
  changeMinimumRating,
  changePageNumber
} from './actions'

export class Search extends Component {
  componentWillMount() {
    this.props.getSittersSearchResults()
  }

  onPageChange(nextValue, prevValue, name) {
    this.props.changePageNumber(nextValue).then(
        this.props.getSittersSearchResults()
    );
  }

  onRatingChange(nextValue, prevValue, name) {
    this.props.changeMinimumRating(nextValue).then(
        this.props.getSittersSearchResults()
    );
  }

  render() {
    return (
      <div className="search-container">
        <div className="search-box">
          <div className="search-rating-text">Show me sitters with mininum rating:</div>
          <div className="rating-container">
            <StarRatingComponent
              name="searchStars"
              starCount={5}
              value={this.props.rating}
              onStarClick={this.onRatingChange.bind(this)}
            />
          </div>
        </div>
        <div className="search-results-container">
          <SearchResults
            changePageNumber={this.onPageChange.bind(this)}
            pageNumber={this.props.pageNumber}
            totalPages={this.props.totalPages}
            sitters={this.props.sitters}
            pending={this.props.pending}
          />
        </div>
      </div>
    )
  }
}

const mapStateToProps = state => ({
  totalPages: state.search.totalPages,
  pageNumber: state.search.pageNumber,
  sitters: state.search.sitters,
  pending: state.search.pending,
  rating: state.search.rating
})

const mapDispatchToProps = dispatch => bindActionCreators({
  changePageNumber,
  changeMinimumRating,
  getSittersSearchResults
}, dispatch)

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Search)
