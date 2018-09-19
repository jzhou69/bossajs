import React from 'react'
import { connect } from 'react-redux';
import { verifyLogin } from './../redux/actions/actions'
import './../stylesheets/LoginBar.css'
import './../stylesheets/Buttons.css'

var mapStateToProps = (state) => {
    return {
        user: state.common.user
    }
}
class LoginBar extends React.Component {
  componentWillMount() {
    this.props.verifyLogin()
  }

  renderNotLoggedIn(){
    return (
      <a href='/login'>Log In</a>
    )
  }

  renderLoggedIn(){
    var user = this.props.user;
    var privilegeMap = {
      '1': 'an admin',
      '2': 'a reviewer',
      '3': 'a contributor'
    }
    return (
      <React.Fragment>
        <a href='/wip' className='left'>{user.username}</a>
        <div className='left'>: You are { privilegeMap[user.privilege] }</div>
        <a href='/login' id='right' className='buttonLink'>Login on a different account</a>
      </React.Fragment>
    )
  }

  render(){
    return (
      <div id='toolbar'>
        {this.props.user.id ? this.renderLoggedIn() : this.renderNotLoggedIn()}
      </div>
    )
  }
}

export default connect(mapStateToProps, { verifyLogin })(LoginBar);
