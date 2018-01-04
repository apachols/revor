import React from 'react'

import StarRatingComponent from 'react-star-rating-component';

import './SearchResult.css'

const SearchResult = props => (
  <div className='sitter-card'>
    <div className='sitter-photo'>
      <img src={props.sitter.image} alt={props.sitter.name} height="150" width="150" />
    </div>
    <h3>{props.number}</h3>
    <div>Name: {props.sitter.name}</div>
    <div>REVIEWS: {props.sitter.reviewCount}</div>
    <div>REPEATS: {props.sitter.repeatCount}</div>
    <StarRatingComponent
        name="sitterStars"
        starCount={5}
        editing={false}
        value={props.sitter.rating}
    />
  </div>
)

export default SearchResult
