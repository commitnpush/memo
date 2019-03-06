import { SEARCH,
         SEARCH_SUCCESS,
         SEARCH_FAILURE } from "./ActionTypes"
import axios from 'axios';         

/* SEARCH */
export function searchRequest(username){
  return (dispatch) => {
    dispatch(search());

    return axios.get('/api/account/search/'+username)
    .then((response) => {
      console.log(response.data);
      dispatch(searchSuccess(response.data));
    }).catch(error => {
      dispatch(searchFailure());
    });
  }
}

export function search(){
  return {
    type: SEARCH
  }
}

export function searchSuccess(usernames){
  return {
    type: SEARCH_SUCCESS,
    usernames
  }
}

export function searchFailure(){
  return {
    type: SEARCH_FAILURE
  }
}