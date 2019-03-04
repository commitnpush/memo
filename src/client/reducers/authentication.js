import * as types from 'actions/ActionTypes';
import update from 'react-addons-update';

const initialState = {
  signIn : {
    status: 'INIT'
  },
  register : {
    status: "INIT",
    error: -1
  },
  status: {
    valid: false,
    isSignedIn: false,
    currentUser: ''
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
    case types.AUTH_GET_STATUS:
      return update(state, {
        status : {
          isSignedIn : { $set: true }
        }
      });
    case types.AUTH_GET_STATUS_SUCCESS:
      return update(state, {
        status : {
          valid : { $set: true },
          currentUser: { $set: action.username}
        }
      });
    case types.AUTH_GET_STATUS_FAILURE:
      return update(state, {
        status : {
          valid : { $set: false },
          isSignedIn : { $set: false }
          
        }
      });
    case types.AUTH_SIGN_OUT:
      return update(state, {
        status: {
          isSignedIn : {$set: false},
          currentUser : {$set: ''}
        }
      });
    default:
      return state
  }
}