import React from 'react'
import { connect } from 'react-redux';
import { loadUserDetails } from './../redux/actions/actions'

var mapStateToProps = (state) => {
  return {
    user: state.user.user,
    publishedTasks: state.user.publishedTasks,
    unpublishedTasks: state.user.unpublishedTasks
  }
}

class UserPage extends React.Component {
  componentWillMount() {
    this.props.loadUserDetails(this.props.match.params.id)
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
        <h3>{this.props.user.username}</h3>
        <h3>Your unpublished tasks</h3>
        {this.renderTasks(this.props.unpublishedTasks)}
        <h3>Your published tasks</h3>
        {this.renderTasks(this.props.publishedTasks)}
      </div>
    )
  }
}

export default connect(mapStateToProps, { loadUserDetails })(UserPage);
