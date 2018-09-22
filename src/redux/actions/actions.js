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
      window.location = `task/${res.data.id}`;
    }).catch(dispatchError.bind(undefined, dispatch))
  }
}

export function updateTask(id, presenter, redundancy){
  return (dispatch) => {
    var queryString = `${url}task/update?taskId=${id}&`;
    if(presenter){
      queryString += `presenter=${presenter}`;
    } else {
      queryString += `redundancy=${redundancy}`;
    }
    return axios.post(queryString).then(() => {
      window.location.reload();
    }).catch(dispatchError.bind(undefined, dispatch))
  }
}

export function publishTask(id){
  return (dispatch) => {
    return axios.post(`${url}task/publish?taskId=${id}`).then(() => {
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
      if(question.done){
        window.location = `/task/${_taskId}`
      } else {
        dispatch({type:'LOAD_QUESTION', question: question});
      }
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

export function createRedundancyTask(id){
  return (dispatch) => {
    axios.post(`${url}task/redundancyqa?id=${id}`).then((res) => {
      let task = res.data;
      window.location = `/task/${task.id}`
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

export function loadUserDetails(userId){
  return (dispatch) => {
    return axios.get(`${url}user?id=${userId}`).then((res) => {
      let data = res.data;
      dispatch({type:'USER_DETAILS', user: data.user, publishedTasks: data.published, unpublishedTasks: data.unpublished});
    }).catch(dispatchError.bind(undefined, dispatch))
  }
}
