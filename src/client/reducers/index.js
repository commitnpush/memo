import authentication from 'reducers/authentication';
import memo from 'reducers/memo';
import search from 'reducers/search';

import {combineReducers} from 'redux';

export default combineReducers({
  authentication,
  memo,
  search
});
