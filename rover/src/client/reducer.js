const initialState = {
  sitters: [],
  pending: false
}

export default (state = initialState, action) => {
  switch (action.type) {
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
        sitters: action.payload.results
      }

    case 'SEARCHRESULTS_REJECTED':
      return {
        ...state,
        pending: false,
        sitters: []
      }

    default:
      return state
  }
}
