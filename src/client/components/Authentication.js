import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {Link} from 'react-router-dom';
class Authentication extends Component{

  constructor(props){
    super(props);
    this.state = {
      username: "",
      password: ""
    }
    this.handleChange = this.handleChange.bind(this);
    this.handleSignIn = this.handleSignIn.bind(this);
    this.handleRegister = this.handleRegister.bind(this);
    this.handleKeyPress = this.handleKeyPress.bind(this);
  }

  handleChange(e) {
    let nextState = {}
    nextState[e.target.name] = e.target.value;
    this.setState(nextState);
  }

  handleKeyPress(e){
    if(e.charCode === 13 && e.target.name === "password"){
      if(this.props.mode){
        this.handleSignIn();
      }else{
        this.handleRegister();
      }
    }else if(e.charCode === 13){
      document.querySelector("[name=password]").focus();
    }
  }

  handleSignIn(){
    let username = this.state.username;
    let password = this.state.password;

    this.props.onSignIn(username, password).then(
      success => {
        if(!success){
          this.setState({password:''});
        }
      }
    );
  }

  handleRegister(){
    let username = this.state.username;
    let password = this.state.password;
    this.props.onRegister(username, password).then(
      success => {
        if(!success){
          this.setState({
            username : '',
            password : ''
          });
        }
      })
  }

  render(){
    const inputBox = (
      <div>
          <div className="input-field col s12 username">
              <label>Username</label>
              <input
              name="username"
              type="text"
              className="validate"
              onChange={this.handleChange}
              onKeyPress={this.handleKeyPress}
              value={this.state.username}
              autoComplete="off"/>
          </div>
          <div className="input-field col s12">
              <label>Password</label>
              <input
              name="password"
              type="password"
              className="validate"
              onChange={this.handleChange}
              onKeyPress={this.handleKeyPress}
              value={this.state.password}
              autoComplete="off"/>
          </div>
      </div>
    );

    const signInView = (
      <div>
        <div className="card-content">
            <div className="row">
                {inputBox}
                <a className="waves-effect waves-light btn" onClick={this.handleSignIn}>SUBMIT</a>
            </div>
        </div>


        <div className="footer">
            <div className="card-content">
                <div className="right" >
                New Here? <Link style={{color:"#e74c3c"}} to="/register">Create an account</Link>
                </div>
            </div>
        </div>

    </div>
    );

    const registerView = (
      <div className="card-content">
        <div className="row">
            {inputBox}
            <a className="waves-effect waves-light btn" onClick={this.handleRegister}>CREATE</a>
        </div>
    </div>
    );
    return (
      <div className="container auth">
        <Link className="logo" to="/">MEMOPAD</Link>
        <div className="card">
          <div className="header blue white-text center">
            <div className="card-content">{this.props.mode ? "SIGN IN" : "REGISTER"}</div>
            {this.props.mode ? signInView : registerView}
          </div>
        </div>
      </div>
    );
  }
}

Authentication.propTypes = {
  mode: PropTypes.bool,
  onSignIn: PropTypes.func,
  onRegister: PropTypes.func
}

//mode true : signin, false : register
Authentication.defaultProps = {
  mode: true,
  onSignIn : (id, pw) => console.error('signin function not defined'),
  onRegister: (id, pw) => console.error('register funciton not defined')
}
export default Authentication;
