import React from 'react'
import { connect } from 'react-redux';
import { verifyLogin } from './../redux/actions/actions'

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
      <div>{user.username}: You are { privilegeMap[user.privilege] }</div>
    )
  }

  render(){
    return (
      <div>
        {this.props.user.id ? this.renderLoggedIn() : this.renderNotLoggedIn()}
      </div>
    )
  }
}

export default connect(mapStateToProps, { verifyLogin })(LoginBar);
