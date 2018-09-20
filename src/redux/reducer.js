import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';
import tasks from './reducers/tasks'
import user from './reducers/user'
import common from './reducers/common'

export default combineReducers({
  tasks,
  user,
  common,
  router: routerReducer
});
