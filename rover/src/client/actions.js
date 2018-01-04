import axios from 'axios';

const getSitters = async (minRating) => {
  const p = await axios({
    method: 'get',
    url: 'api/sitter/search?rating='+minRating
  });
  return {
    results: p.data
  };
};

export const getSittersSearchResults = (minRating) => {
  return dispatch => {
    dispatch({
      type: 'SEARCHRESULTS',
      payload: getSitters(minRating)
    });
  };
};

export const changeMinimumRating = (minRating) => {
  return dispatch => {
    dispatch({
      type: 'CHANGERATING',
      rating: minRating
    });
  };
}
