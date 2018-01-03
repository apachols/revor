const initialState = {
  count: 0,
}

export default (state = initialState, action) => {
  switch (action.type) {
    case 'INCREMENT':
      return {
        ...state,
        count: state.count + 1
      }

    case 'DECREMENT':
      return {
        ...state,
        count: state.count - 1,
      }

    default:
      return state
  }
}

export const increment = () => {
  return dispatch => {
    // dispatch({
    //   type: INCREMENT_REQUESTED
    // })

    dispatch({
      type: 'INCREMENT'
    })
  }
}

// export const incrementAsync = () => {
//   return dispatch => {
//     dispatch({
//       type: INCREMENT_REQUESTED
//     })
//
//     return setTimeout(() => {
//       dispatch({
//         type: INCREMENT
//       })
//     }, 3000)
//   }
// }

export const decrement = () => {
  return dispatch => {
    // dispatch({
    //   type: DECREMENT_REQUESTED
    // })

    dispatch({
      type: 'DECREMENT'
    })
  }
}
//
// export const decrementAsync = () => {
//   return dispatch => {
//     dispatch({
//       type: DECREMENT_REQUESTED
//     })
//
//     return setTimeout(() => {
//       dispatch({
//         type: DECREMENT
//       })
//     }, 3000)
//   }
// }
