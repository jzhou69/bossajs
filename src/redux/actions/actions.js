import axios from 'axios'
axios.defaults.withCredentials = true; // enable sending cookies

const url = "http://localhost:5000/api/"

function dispatchError(dispatch, err){
  if(typeof err.response.data == 'string'){
    return dispatch({type: 'ERROR', error: err.response.data});
  }
  if(err.response.status == 401){
    return dispatch({type: 'ERROR', error: 'You do not have permission to perform that operation.'});
  }
  return dispatch({type: 'ERROR', error: err.message});
}

export function loadTasks(){
  return (dispatch) => {
    axios.get(`${url}tasks`).then((res) => {
      let tasks = res.data;
      dispatch({type:'LOAD_TASKS', tasks: tasks});
    }).catch(dispatchError.bind(undefined, dispatch))
  }
}

export function createTask(name){
  return (dispatch) => {
    return axios.post(`${url}task?taskName=${name}`).then((res) => {
      window.location.reload();
    }).catch(dispatchError.bind(undefined, dispatch))
  }
}

export function updateTask(id, presenter){
  return (dispatch) => {
    return axios.post(`${url}task/update?taskId=${id}&presenter=${presenter}`).then(() => {
      window.location.reload();
    }).catch(dispatchError.bind(undefined, dispatch))
  }
}

export function addQuestions(id, questions){
  return (dispatch) => {
    return axios.post(`${url}task/question/string?taskId=${id}&questions=${JSON.stringify(questions)}`).then(() => {
      window.location.reload();
    }).catch(dispatchError.bind(undefined, dispatch))
  }
}

export function loadTask(_id){
  return (dispatch) => {
    axios.get(`${url}task?taskId=${_id}`).then((res) => {
      let task = res.data;
      dispatch({type:'LOAD_TASK', task: task});
    }).catch(dispatchError.bind(undefined, dispatch))
  }
}

export function loadQuestion(_taskId){
  return (dispatch) => {
    return axios.get(`${url}task/question?taskId=${_taskId}`).then((res) => {
      let question = res.data;
      dispatch({type:'LOAD_QUESTION', question: question});
    }).catch(dispatchError.bind(undefined, dispatch))
  }
}

export function recordAnswer(id, answer){
  return (dispatch) => {
    return axios.post(`${url}task/question/answer?questionId=${id}&answer=${JSON.stringify(answer)}`).then(() => {
      window.location.reload();
    }).catch(dispatchError.bind(undefined, dispatch))
  }
}

export function exportAnswers(id){
  return (dispatch) => {
    axios.get(`${url}task/export?taskId=${id}`).then((res) => {
      var content = res.data;
      dispatch({type:'EXPORT_ANSWERS', answer: content});
    }).catch(dispatchError.bind(undefined, dispatch))
  }
}

export function login(username, password){
  return (dispatch) => {
    axios.post(`${url}user/authenticate?username=${username}&password=${password}`).then(() => {
      window.location = 'tasks';
    }).catch(dispatchError.bind(undefined, dispatch))
  }
}

export function verifyLogin(){
  return (dispatch) => {
    axios.post(`${url}user/session`).then((res) => {
      let user = res.data;
      dispatch({type:'USER', user: user});
    }).catch(dispatchError.bind(undefined, dispatch))
  }
}

export function createAccount(username, password){
  return (dispatch) => {
    axios.post(`${url}user/create?username=${username}&password=${password}`).then(() => {
      window.location.reload();
    }).catch(dispatchError.bind(undefined, dispatch))
  }
}
