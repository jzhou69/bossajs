const initialState = {
  tasks: [],
  task: {},
  question: {},
  answer: ''
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
    case 'LOAD_QUESTION':
    return {
      ...state,
      question: action.question
    }
    case 'EXPORT_ANSWERS':
    return {
      ...state,
      answer: action.answer
    }
    default:
    return state
  }
}
