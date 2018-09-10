const defaultState = {
  error: ''
};
// TODO: add user field to state

export default (state = defaultState, action) => {
  switch (action.type) {
    case 'ERROR' :
    return {
      ...state,
      error: action.error
    }
    default:
      return state;
  }
};
