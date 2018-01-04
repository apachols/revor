import axios from 'axios';

export const changePageNumber = (pageNumber) => {
  return (dispatch, getState) => {
    dispatch({
      type: 'CHANGEPAGENUMBER',
      pageNumber
    });
    return Promise.resolve();
  };
}

const getSitters = async (pageNumber, minRating) => {
  const p = await axios({
    method: 'get',
    url: `api/sitter/search?rating=${minRating}&page=${pageNumber}`
  });
  return p.data;
};

export const getSittersSearchResults = () => {
  return (dispatch, getState) => {
    const { pageNumber, rating } = getState().search;
    dispatch({
      type: 'SEARCHRESULTS',
      payload: getSitters(pageNumber, rating)
    });
  };
};

export const changeMinimumRating = (minRating) => {
  return dispatch => {
    dispatch({
      type: 'CHANGERATING',
      rating: minRating
    });
    return Promise.resolve();
  };
}
