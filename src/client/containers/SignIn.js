import React, {Component} from 'react';
import {Authentication} from 'components';
import {connect} from 'react-redux';
import {signInRequest} from 'actions/authentication';
import { withRouter } from 'react-router-dom';

class SignIn extends Component{

  constructor(props){
    super(props);
    this.handleSignIn = this.handleSignIn.bind(this);
  }

  handleSignIn(id, pw){
    return this.props.signInRequest(id, pw).then(()=>{
      if(this.props.status === 'SUCCESS'){
        //create session data
        let signInData = {
          isSignedIn: true,
          username: id
        }
        document.cookie = 'key=' + btoa(JSON.stringify(signInData));
        Materialize.toast('Welcom, ' + id + '!', 2000);
        //browserHistory.push('/'); v3
        //v4
        this.props.history.push('/');
        
        return true;
      } else {
        let $toastContent = $('<span style="color:#FFB4BA">Incorrect username or password</span>');
        Materialize.toast($toastContent, 2000);
        return false;
      }
    })
  }

  render(){
    return (
      <div>
        <Authentication mode={true} onSignIn={this.handleSignIn}/>
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    status: state.authentication.signIn.status
  }
}
const mapDispatchToProps = (dispatch) => {
  return {
    signInRequest: (id, pw) => {
      return dispatch(signInRequest(id,pw));
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(SignIn));