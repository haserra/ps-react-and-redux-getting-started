import * as types from "../actions/actionTypes";
import initialState from "./initialState";
/**
 *
 * @param {*} state will end up storing an array of authors, so it should be initialized to an empty array.
 * @param {*} action
 * @returns
 */
export default function authorReducer(state = initialState.authors, action) {
  switch (action.type) {
    // case "LOAD_AUTHORS_SUCCESS":
    case types.LOAD_AUTHORS_SUCCESS:
      return action.authors;

    default:
      return state;
  }
}
