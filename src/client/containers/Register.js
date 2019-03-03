import React, {Component} from 'react';
import {Authentication} from 'components';
import {connect} from 'react-redux';
import {registerRequest} from 'actions/authentication';
import { withRouter } from 'react-router-dom';

class Register extends Component{
  constructor(props){
    super(props);
    this.handleRegister = this.handleRegister.bind(this);
  }

  handleRegister(id, pw){
    return this.props.registerRequest(id, pw).then(
      () => {
        if(this.props.status === 'SUCCESS'){
          Materialize.toast('Success! Please Sign in.', 2000);
          this.props.history.push('/signin');
          return true;
        }else{
          /*
            ERROR CODES:
                1: BAD USERNAME
                2: BAD PASSWORD
                3: USERNAME EXISTS
          */
          const errorMsgs = [
            'Invalid Username',
            'Password is too short',
            'Username is already exists'
          ]
          const $toastContent = $(`<span style="color: #FFB4BA">${errorMsgs[this.props.errorCode - 1]}</span>`);
          Materialize.toast($toastContent, 2000);
          return false;
        }
      }
    );
  }

  render(){
    return (
      <div>
        <Authentication mode={false} onRegister={this.handleRegister}/>
      </div>
    )
  }
}
const mapStateToProps = state => {
  return {
    status: state.authentication.register.status,
    errorCode: state.authentication.register.error
  };
}

const mapDispatchToProps = dispatch => {
  return {
    registerRequest: (id, pw) => {
      return dispatch(registerRequest(id, pw));
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Register);