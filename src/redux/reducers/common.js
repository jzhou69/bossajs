const defaultState = {
  error: '',
  user: {}
};
// TODO: add user field to state

export default (state = defaultState, action) => {
  switch (action.type) {
    case 'ERROR' :
    return {
      ...state,
      error: action.error
    }
    case 'USER' :
    return {
      ...state,
      user: action.user
    }
    default:
      return state;
  }
};
