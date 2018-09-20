import React, { Component } from 'react';
import { Switch, Route } from 'react-router-dom'
import Tasks from './components/Tasks'
import Task from './components/Task'
import UserPage from './components/UserPage'
import Question from './components/Question'
import Login from './components/Login'
import LoginBar from './components/LoginBar'
import StatusMessage from './components/StatusMessage'

class App extends Component {
  render() {
    return (
      <div>
        <StatusMessage />
        <LoginBar />
        <Switch>
          <Route exact path="/" component={Tasks} />
          <Route path="/task/:id/question" component={Question} />
          <Route path="/task/:id" component={Task} />
          <Route path="/user/:id" component={UserPage} />
          <Route path="/login" component={Login} />
          <Route path="**" component={Tasks} />
        </Switch>
      </div>
    );
  }
}

export default App;
