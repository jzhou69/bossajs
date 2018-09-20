import React from 'react'
import { connect } from 'react-redux';
import { loadTasks, createTask } from './../redux/actions/actions'
import './../stylesheets/Buttons.css'

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
      return (
        <div style={{display: 'flex'}}>
          <div style={{margin: '10px', borderStyle: 'groove', paddingBottom: '20px'}}>
            <a href={`/task/${task.id}`} className='buttonLink'>{task.name}</a>
            </div>
        </div>
      )
    })
  }

  render(){
    return (
      <div>
        <h3>Tasks</h3>
        {this.renderTasks(this.props.tasks)}
        <div>Create Task</div>
        <input id='newTaskName' placeholder='Task Name'></input>
        <button onClick={() => {
          this.props.createTask(document.getElementById('newTaskName').value);
        }}>Create</button>
      </div>
    )
  }
}

export default connect(mapStateToProps, { loadTasks, createTask })(Tasks);
