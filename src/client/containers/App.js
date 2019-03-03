import React, { Component } from 'react';
import {Route} from 'react-router-dom'
import './app.css';
import { Header } from 'components';
import { Home, SignIn, Register } from 'containers';

class App extends Component {
  render(){
    let isAuthPage = /(signin|register)/.test(this.props.location.pathname);
    return (
      <div>
        {isAuthPage ? null : <Header/>}
        <Route exact path="/" component={Home}/>
        <Route exact path="/signin" component={SignIn}/>
        <Route exact path="/register" component={Register}/>
      </div>
    );
  }
}
export default App;