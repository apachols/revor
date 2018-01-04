
const pageSize = 20;

const initialState = {
  sitters: [],
  pending: false,
  rating: 1,
  pageNumber: 1,
  totalPages: 0
}

export default (state = initialState, action) => {
  switch (action.type) {
    case 'CHANGEPAGENUMBER':
      return {
        ...state,
        pageNumber: action.pageNumber
      }

    case 'CHANGERATING':
      return {
        ...state,
        rating: action.rating,
        pageNumber: 1
      }

    case 'SEARCHRESULTS_PENDING':
      return {
        ...state,
        pending: true
      }

    case 'SEARCHRESULTS_FULFILLED':
      console.log(action);
      return {
        ...state,
        pending: false,
        sitters: action.payload.pageResults,
        totalPages: Math.ceil(action.payload.totalRows / pageSize)
      }

    case 'SEARCHRESULTS_REJECTED':
      return {
        ...state,
        pending: false,
        sitters: [],
        pageNumber: 1,
        totalPages: 0
      }

    default:
      return state
  }
}
