import React, { Component } from 'react'
import { push } from 'react-router-redux'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import SearchBox from './SearchBox'

import './Home.css'

import {
  getSittersSearchResults,
  changeMinimumRating
} from './actions'

export class Home extends Component {

  onRatingChange(nextValue, prevValue, name) {
    this.props.changeMinimumRating(nextValue).then(() => {
      return this.props.changePage();
    })
  }

  render() {
    return (
      <div>
        <img className="hero-image" src="doggy.jpg" alt="Hi doggy!" />
        <SearchBox
          rating={this.props.rating}
          onRatingChange={this.onRatingChange.bind(this)}
        />
      </div>
    )
  }
}

const mapStateToProps = state => ({
  rating: state.search.rating
})

const mapDispatchToProps = dispatch => bindActionCreators({
  changeMinimumRating,
  getSittersSearchResults,
  changePage: () => push('/search')
}, dispatch)

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Home)
