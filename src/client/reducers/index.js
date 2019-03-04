import authentication from 'reducers/authentication';
import memo from 'reducers/memo';

import {combineReducers} from 'redux';

export default combineReducers({
  authentication,
  memo
});
