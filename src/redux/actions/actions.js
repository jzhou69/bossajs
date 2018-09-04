import axios from 'axios'

const url = "http://localhost:5000/api/"

export function loadTasks(){
  return (dispatch) => {
    axios.get(`${url}tasks`).then((res) => {
      let tasks = res.data;
      dispatch({type:'LOAD_TASKS', tasks: tasks});
    }).catch((err) => {
      console.log(err);
    })
  }
}

export function createTask(name){
  return (dispatch) => {
    axios.post(`${url}task?taskName=${name}`).then((res) => {
      let task = res.data;
      dispatch({type:'CREATE_TASK', task: task})
    })
  }
}

export function updateTask(id, presenter){
  return (dispatch) => {
    axios.post(`${url}task/update?taskId=${id}&presenter=${presenter}`).then((res) => {
      let task = res.data;
      dispatch({type:'LOAD_TASK', task: task})
    })
  }
}

export function loadTask(_id){
  return (dispatch) => {
    axios.get(`${url}task?taskId=${_id}`).then((res) => {
      let task = res.data;
      dispatch({type:'LOAD_TASK', task: task});
    }).catch((err) => {
      console.log(err);
    })
  }
}

export function loadQuestion(_taskId){
  return (dispatch) => {
    axios.get(`${url}task/question?taskId=${_taskId}`).then((res) => {
      let question = res.data;
      dispatch({type:'LOAD_QUESTION', question: question});
    }).catch((err) => {
      console.log(err);
    })
  }
}
