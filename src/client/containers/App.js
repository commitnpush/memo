import React, { Component } from 'react';
import {Route} from 'react-router-dom'
import './app.css';
import { Header } from 'components';
import { Home, SignIn, Register } from 'containers';
import { connect } from 'react-redux';
import { getStatusRequest, signOutRequest } from 'actions/authentication';

class App extends Component {
  constructor(props){
    super(props);
    this.handleSignOut = this.handleSignOut.bind(this);
  }

  handleSignOut(){
    this.props.signOutRequest().then(
      () => {
        Materialize.toast('Good Bye~!', 2000);
        let signInData = {
          isSignedIn: false,
          username: ''
        }
        document.cookie = 'key='+btoa(JSON.stringify(signInData));
      }

    );
  }

  componentDidMount(){
    
    //get cookie by name
    function getCookie(name){
      var value = "; " + document.cookie;
      var parts = value.split("; " + name + "=");
      if(parts.length === 2){
        return parts.pop().split(";").shift();
      }
    }
    
    //get signin data from cookie
    let signInData = getCookie('key');
    
    //visit site first time or cookie was expired
    if(typeof signInData === 'undefined') return;
    signInData = JSON.parse(atob(signInData));

    //console.warn(signInData);
    //if not signed in, do nothing
    if(!signInData.isSignedIn) return;


    this.props.getStatusRequest().then(
      () => {
        //if signed in but session is not valid
        console.warn(this.props.status);
        if(!this.props.status.valid){
          signInData = {
            isSignedIn: false,
            username: ''
          }
          document.cookie = `key=${btoa(JSON.stringify(signInData))}`
          let $toastContent = $('<span style="color: #FFB4BA">Your session is expired, please sign in again</span>');
          Materialize.toast($toastContent, 4000);
        }
      }
    )
  }
  render(){

    let isAuthPage = /(signin|register)/.test(this.props.location.pathname);
    return (
      <div>
        {isAuthPage ? null : <Header isSignedIn={this.props.status.isSignedIn} onSignOut={this.handleSignOut}/>}
        <Route exact path="/" component={Home}/>
        <Route exact path="/signin" component={SignIn}/>
        <Route exact path="/register" component={Register}/>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    status: state.authentication.status
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    getStatusRequest: () => {
      return dispatch(getStatusRequest());
    },
    signOutRequest: () => {
      return dispatch(signOutRequest());
    }
  }
}
export default connect(mapStateToProps, mapDispatchToProps)(App);