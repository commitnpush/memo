import * as types from 'actions/ActionTypes';
import update from 'react-addons-update';

const initialState = {
  status: 'INIT',
  usernames: [],
  error: -1
}


export default function search(state, action){
  if(typeof state === 'undefined'){
    state = initialState;
  }

  switch(action.type){
    case types.SEARCH:
      return update(state, {
        status: { $set: 'WAITING' },
        error: {$set: -1}
      });

    case types.SEARCH_SUCCESS:
      return update(state, {
        status: { $set: 'SUCCESS' },
        usernames : { $set: action.usernames }
      });
    case types.SEARCH_FAILURE:
      return update(state, {
        status: { $set: 'FAILURE' }
      });
    default: return state;
  }
} 