import * as types from "../actions/actionTypes";
import initialState from "./initialState";

function actionTypeEndsInSuccess(type) {
  return type.substring(type.length - 8) === "_SUCCESS";
}

export default function apiCallStatusReducer(
  state = initialState.apiCallsInProgress,
  action
) {
  // so this is called when API call begins. But what about when they end?
  // Remember how thunks dispatch action types that end in the word _SUCCESS, when they complete successfully
  // the suffix can be used as a signal the API has completed

  // we're handling the same action type in multiple reducers
  // it's important to keep our reducers and actions, each on separate folders (not group them in feature folders)

  if (action.type == types.BEGIN_API_CALL) {
    console.log(`Another API call has just started ...`);
    return state + 1;
  } else if (
    action.type === types.API_CALL_ERROR ||
    actionTypeEndsInSuccess(action.type)
  ) {
    console.log(`The API call ..has completed successfully!`);
    return state - 1;
  }
  return state;
}

// finally add a reference to the root reducer
