import React from 'react'

import StarRatingComponent from 'react-star-rating-component';

import './SearchResult.css'

const SearchResult = props => (
  <div className="sitter-card">
    <div className="sitter-photo">
      <img src={props.sitter.image} alt={props.sitter.name} height="120" width="120" />
    </div>
    <div className="sitter-info">
      <div className="sitter-headline">
        <span className="result-number">{props.number}.</span>
        <span className="sitter-name">{props.sitter.name}</span>
      </div>
      <div className="review-info">
        {
          props.sitter.repeatCount === 0 ? <div style={{height: "1em"}} /> :
          <div className="review-info-item">
            {props.sitter.repeatCount}
            {props.sitter.repeatCount > 1 ? " REPEAT CLIENTS" : " REPEAT CLIENT"}
          </div>
        }
        <div className="review-count review-info-item">{props.sitter.reviewCount} REVIEWS</div>
        <div className="rating-container">
          <StarRatingComponent
              name="sitterStars"
              starCount={5}
              editing={false}
              value={props.sitter.rating}
          />
        </div>
      </div>
    </div>
  </div>
)

export default SearchResult
