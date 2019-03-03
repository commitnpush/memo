import * as types from 'actions/ActionTypes';
import update from 'react-addons-update';

const initialState = {
  signIn : {
    status: 'INIT'
  },
  status: {
    isSignedIn: false,
    currentUser: ''
  },
  register : {
    status: "INIT",
    error: -1
  }
}

export default function authentication(state, action){
  if(typeof state === 'undefined'){
    state = initialState;
  }

  switch(action.type){
    //SIGN IN
    case types.AUTH_SIGN_IN:
      return update(state, {
        signIn: { 
          status: {$set: 'WAITING'}
        }
      });
    case types.AUTH_SIGN_IN_SUCCESS:
      return update(state, {
        signIn: {
          status: {$set: 'SUCCESS'}
        },
        status:{
          isSignedIn: {$set: true},
          currentUser: {$set: action.username}
        }
      });
    case types.AUTH_SIGN_IN_FAILURE:
      return update(state, {
        signIn:{
          status: {$set: 'FAILURE'}
        }
      });
    case types.AUTH_REGISTER:
      return update(state, {
        register: {
          status: {$set: 'WAITING'}
        }
      });
    case types.AUTH_REGISTER_SUCCESS:
      return update(state, {
        register:{
          status: {$set: "SUCCESS"}
        }
      });
    case types.AUTH_REGISTER_FAILURE:
      return update(state, {
        register : {
          status: {$set: "FAILURE"},
          error: {$set: action.error}
        }
      });
    default:
      return state
  }
}