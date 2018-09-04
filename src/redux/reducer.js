import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';
import tasks from './reducers/tasks'
import common from './reducers/common'

export default combineReducers({
  tasks,
  common,
  router: routerReducer
});
