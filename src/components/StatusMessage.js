import React from 'react'
import { connect } from 'react-redux';

var mapStateToProps = (state) => {
  return {
    error: state.common.error,
  }
}

class StatusMessage extends React.Component {
  render(){
    return (
      <div>
        {
          this.props.error ? <div>{this.props.error}</div> : null
        }
      </div>
    )
  }
}

export default connect(mapStateToProps)(StatusMessage);
