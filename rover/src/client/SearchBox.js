import React from 'react';

import StarRatingComponent from 'react-star-rating-component';

import './SearchBox.css';

const SearchBox = props => (
  <div className="search-box">
    <div className="search-rating-text">Show me sitters with mininum rating:</div>
    <div className="rating-container">
      <StarRatingComponent
        name="searchStars"
        starCount={5}
        value={props.rating}
        onStarClick={props.onRatingChange}
      />
    </div>
  </div>
);

export default SearchBox;
