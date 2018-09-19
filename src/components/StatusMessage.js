import React from 'react'
import { connect } from 'react-redux';
import './../stylesheets/StatusMessage.css'

var mapStateToProps = (state) => {
  return {
    error: state.common.error,
  }
}

class StatusMessage extends React.Component {
  render(){
    if(this.props.error){
      return (<div id='message'>{this.props.error}</div>)
    } else {
      return (null);
    }
  }
}

export default connect(mapStateToProps)(StatusMessage);
