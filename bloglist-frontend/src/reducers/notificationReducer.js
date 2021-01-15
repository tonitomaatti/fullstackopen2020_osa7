const initialState = { type: null, content: null, timeOutID: null }

const notificationReducer = (state = initialState, action) => {
  switch (action.type) {
  case 'NOTIFY':
    if (state.timeOutID) {
      clearTimeout(state.timeOutID)
    }
    return action.data
  default:
    return state
  }
}

export const setNotification = (type, content, displayTime) => {
  return async dispatch => {
    const timeOutID = setTimeout(() => {
      dispatch({ type: 'NOTIFY', data: { type: null, content: null, timeOutID: null } })
    }, displayTime*1000)

    dispatch({ type: 'NOTIFY', data: { type, content, timeOutID } })
  }
}


export default notificationReducer