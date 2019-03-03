import {AUTH_SIGN_IN, 
        AUTH_SIGN_IN_SUCCESS, 
        AUTH_SIGN_IN_FAILURE,
        AUTH_REGISTER, 
        AUTH_REGISTER_SUCCESS, 
        AUTH_REGISTER_FAILURE,
        AUTH_GET_STATUS,
        AUTH_GET_STATUS_SUCCESS,
        AUTH_GET_STATUS_FAILURE,
        AUTH_SIGN_OUT} from 'actions/ActionTypes.js';
import axios from 'axios';

/* SIGN OUT */
export function signOutRequest(){
  return dispatch => {
    return axios.post('/api/account/signout').then(response => {
      dispatch(signOut());
    });
  }
}

export function signOut(){
  return {
    type: AUTH_SIGN_OUT
  }
}

/* GET STATUS */
export function getStatusRequest(){
  return dispatch => {
    dispatch(getStatus());

    return axios.get('/api/account/info').then(response => {
      dispatch(getStatusSuccess(response.data.info.username));
    }).catch(error => {
      dispatch(getStatusFailure());
    });
  }
}
export function getStatus(){
  return {
    type: AUTH_GET_STATUS
  }
}
export function getStatusSuccess(username){
  return {
    type: AUTH_GET_STATUS_SUCCESS,
    username
  }
}
export function getStatusFailure(){
  return {
    type: AUTH_GET_STATUS_FAILURE
  }
}


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