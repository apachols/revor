import axios from 'axios';

const getUsers = async () => {
  const p = await axios({
    method: 'get',
    url: 'api/users',
  });
  return {
    results: p.data
  };
};

// const getSitters = async () => {
//   const p = await axios({
//     method: 'get',
//     url: 'api/sitter/search',
//   });
//   return {
//     results: p.data
//   };
// };

export const getSittersSearchResults = () => {
  return dispatch => {
    dispatch({
      type: 'SEARCHRESULTS',
      payload: getUsers()
    });
  };
};
