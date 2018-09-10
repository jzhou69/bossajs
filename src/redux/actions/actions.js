import axios from 'axios'
axios.defaults.withCredentials = true;

const url = "http://localhost:5000/api/"

function getErrorMessage(err){
  if(err.response.status == 401){
    if(typeof err.response.data == 'string'){
      return err.response.data;
    }
    return 'You do not have permission to perform that operation.';
  }
  return err.message;
}

export function loadTasks(){
  return (dispatch) => {
    axios.get(`${url}tasks`).then((res) => {
      let tasks = res.data;
      dispatch({type:'LOAD_TASKS', tasks: tasks});
    }).catch((err) => {
      dispatch({type: 'ERROR', error: getErrorMessage(err)});
    })
  }
}

export function createTask(name){
  return (dispatch) => {
    return axios.post(`${url}task?taskName=${name}`).then((res) => {
      let task = res.data;
      dispatch({type:'CREATE_TASK', task: task});
    }).catch((err) => {
      dispatch({type: 'ERROR', error: getErrorMessage(err)});
    })
  }
}

export function updateTask(id, presenter){
  return (dispatch) => {
    return axios.post(`${url}task/update?taskId=${id}&presenter=${presenter}`).then(() => {
      window.location.reload();
    }).catch((err) => {
      dispatch({type: 'ERROR', error: getErrorMessage(err)});
    })
  }
}

export function addQuestions(id, questions){
  return (dispatch) => {
    return axios.post(`${url}task/question/string?taskId=${id}&questions=${JSON.stringify(questions)}`).then(() => {
      window.location.reload();
    }).catch((err) => {
      dispatch({type: 'ERROR', error: getErrorMessage(err)});
    })
  }
}

export function loadTask(_id){
  return (dispatch) => {
    axios.get(`${url}task?taskId=${_id}`).then((res) => {
      let task = res.data;
      dispatch({type:'LOAD_TASK', task: task});
    }).catch((err) => {
      dispatch({type: 'ERROR', error: getErrorMessage(err)});
    })
  }
}

export function loadQuestion(_taskId){
  return (dispatch) => {
    return axios.get(`${url}task/question?taskId=${_taskId}`).then((res) => {
      let question = res.data;
      dispatch({type:'LOAD_QUESTION', question: question});
    }).catch((err) => {
      dispatch({type: 'ERROR', error: getErrorMessage(err)});
    })
  }
}

export function recordAnswer(id, answer){
  return (dispatch) => {
    return axios.post(`${url}task/question/answer?questionId=${id}&answer=${JSON.stringify(answer)}`).then(() => {
      window.location.reload();
    }).catch((err) => {
      dispatch({type: 'ERROR', error: getErrorMessage(err)});
    })
  }
}

export function exportAnswers(id){
  return (dispatch) => {
    axios.get(`${url}task/export?taskId=${id}`).then((res) => {
      var content = res.data;
      dispatch({type:'EXPORT_ANSWERS', answer: content});
    }).catch((err) => {
      dispatch({type: 'ERROR', error: getErrorMessage(err)});
    })
  }
}

export function login(username, password){
  return (dispatch) => {
    axios.post(`${url}user/authenticate?username=${username}&password=${password}`).catch((err) => {
      console.log(err);
    }).then(() => {
      window.location = 'tasks';
    }).catch((err) => {
      dispatch({type: 'ERROR', error: getErrorMessage(err)});
    })
  }
}

export function createAccount(username, password){
  return (dispatch) => {
    axios.post(`${url}user/create?username=${username}&password=${password}`).catch((err) => {
      dispatch({type: 'ERROR', error: getErrorMessage(err)});
    })
  }
}
