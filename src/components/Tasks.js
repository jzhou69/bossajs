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
    var buttonStyle = {
      font: 'bold 11px Arial',
      textDecoration: 'none',
      backgroundColor: '#33e0ff',
      color: 'white',
      padding: '2px 6px 2px 6px',
      borderTop: '1px solid #CCCCCC',
      borderRight: '1px solid #333333',
      borderBottom: '1px solid #333333',
      borderLeft: '1px solid #CCCCCC'
    }
    return tasks.map((task) => {
      return (
        <div style={{margin: '10px', borderStyle: 'groove', paddingBottom: '20px'}}>
          <a href={'/task/' + task.id} style={buttonStyle}>{task.name}</a>
        </div>
      )
    })
  }

  render(){
    return (
      <div>
        <h3>Tasks</h3>
        <div style={{display: 'flex'}}>
          {this.renderTasks(this.props.tasks)}
        </div>
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
