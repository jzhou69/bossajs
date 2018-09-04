const initialState = {
  tasks: [],
  task: {},
  question: {}
}
export default (state=initialState, action) => {
  switch (action.type) {
    case 'LOAD_TASKS' :
    return {
      ...state,
      tasks: action.tasks
    }
    case 'CREATE_TASK':
    let tasks = state.tasks.slice();
    tasks.push(action.task);
    return {
      ...state,
      tasks: tasks
    }
    case 'LOAD_TASK':
    return {
      ...state,
      task: action.task
    }
    case 'MODOIFY_TASK':
    let task = Object.assign({}, state.task)
    return {
      ...state,
      task: task
    }
    case 'LOAD_QUESTION':
    return {
      ...state,
      question: action.question
    }
    default:
    return state
  }
}
