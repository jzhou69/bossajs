import React from 'react'
import { connect } from 'react-redux';
import { login, createAccount } from './../redux/actions/actions'

class Login extends React.Component {

  render(){
    return (
      <div>
        <h3>Log In</h3>
        <input id='userLog' placeholder='Username'></input>
        <input id='passLog' placeholder='Password'></input>
        <button onClick={() => {
          this.props.login(document.getElementById('userLog').value, document.getElementById('passLog').value);
        }}>Login</button>
        <h3>Create Account</h3>
        <input id='userCreate' placeholder='Username'></input>
        <input id='passCreate' placeholder='Password'></input>
        <button onClick={() => {
          this.props.createAccount(document.getElementById('userCreate').value, document.getElementById('passCreate').value);
          window.location.reload();
        }}>Create</button>
      </div>
    )
  }
}

export default connect(()=>{return {}}, { login, createAccount })(Login);
