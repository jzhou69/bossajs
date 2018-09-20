const defaultState = {
  user: {},
  publishedTasks: [],
  unpublishedTasks: []
};

export default (state = defaultState, action) => {
  switch (action.type) {
    case 'USER_DETAILS' :
    return {
      ...state,
      user: action.user,
      publishedTasks: action.publishedTasks,
      unpublishedTasks: action.unpublishedTasks
    }
    default:
      return state;
  }
};
