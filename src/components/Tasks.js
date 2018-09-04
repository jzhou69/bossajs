import React from 'react'
import { connect } from 'react-redux';
import { loadTasks, createTask } from './../redux/actions/actions'

var mapStateToProps = (state) => {
    return {
        tasks: state.tasks.tasks
    }
}

class Tasks extends React.Component {
  componentWillMount() {
    this.props.loadTasks()
  }

  renderTasks(tasks){
    return tasks.map((task) => {
      return <a href={'/task/' + task.id}>{task.name}</a>
    })
  }

  render(){
    return (
      <div>
        <h3>Tasks</h3>
        <div>{this.renderTasks(this.props.tasks)}</div>
        <div>Create Task</div>
        <input id='newTaskName'></input>
        <button onClick={() => {
          this.props.createTask(document.getElementById('newTaskName').value);
          window.location.reload();
        }}>Create</button>
      </div>
    )
  }
}

export default connect(mapStateToProps, { loadTasks, createTask })(Tasks);
