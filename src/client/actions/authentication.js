import {AUTH_SIGN_IN, AUTH_SIGN_IN_SUCCESS, AUTH_SIGN_IN_FAILURE, AUTH_REGISTER, AUTH_REGISTER_SUCCESS, AUTH_REGISTER_FAILURE} from 'actions/ActionTypes.js';
import axios from 'axios';

/* SIGN UP */
export function registerRequest(username, password){
  return (dispatch) => {
    //Inform API is starting
    dispatch(register());

    return axios.post("/api/account/signup", {username, password}).then(response => {
      dispatch(registerSuccess());
    }).catch(error => {
      dispatch(registerFailure(error.response.data.code));
    });
  }
}

export function register(){
  return {
    type: AUTH_REGISTER
  }
}

export function registerSuccess(){
  return {
    type: AUTH_REGISTER_SUCCESS
  }
}

export function registerFailure(error){
  return {
    type: AUTH_REGISTER_FAILURE, 
    error
  }
}

/* SIGN IN */
export function signInRequest(username, password){
  return (dispatch) => {
    //Inform Login API is starting
    dispatch(signIn());

    //API REQUEST
    return axios.post('/api/account/signin', {username, password}).then( response => {
      //SUCCESS
      dispatch(signInSuccess(username));
    }).catch( error => {
      //FAILED
      dispatch(signInFailure());
    });
  }
}

export function signIn(){
  return {
    type: AUTH_SIGN_IN
  }
}

export function signInSuccess(username){
  return {
    type: AUTH_SIGN_IN_SUCCESS,
    username
  }
}

export function signInFailure(){
  return {
    type: AUTH_SIGN_IN_FAILURE
  }
}