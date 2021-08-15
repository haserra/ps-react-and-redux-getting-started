import * as types from "./actionTypes";

// this will be actions that are related to the current status of an API call
// create an action creator for BEGIN API CALL
export function beginApiCall() {
  return {
    type: types.BEGIN_API_CALL,
  };
}

export function apiCallError() {
  return {
    type: types.API_CALL_ERROR,
  };
}
