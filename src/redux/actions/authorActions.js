// this file will define the author action creators
import * as types from "./actionTypes";
import * as authorApi from "../../api/authorApi";
import { beginApiCall, apiCallError } from "./apiStatusActions";

// this function only creates an action - it is an Action Creator
// it returns an object, with a property named type and a payload: authors
// to avoid typos it is recommended to use constants instead!
// so, let's create ou Action Creator relative to Load authors success
// it's going to accept a list of authors

export function loadAuthorsSuccess(authors) {
  return {
    type: types.LOAD_AUTHORS_SUCCESS,
    authors: authors,
  };
}

// we created an Action, so now we need a function that will handle the action - that's when Reducers come to handy

// we add thunks in the authorsActions
// for a first thunk, let's load authors when the app initially loads, using the coursesApi library
// thunks are placed at the bottom

/**
 *
 * Thunks for authors
 */

export function loadAuthors() {
  // Redux thunk injects dispatch so we don't have to.
  return function (dispatch) {
    // now , our own code
    dispatch(beginApiCall()); // dispatch to the store!!!
    return authorApi
      .getAuthors()
      .then((authors) => {
        dispatch(loadAuthorsSuccess(authors)); // dispatch to the store
      })
      .catch((error) => {
        dispatch(apiCallError(error)); // but it would be nice to avoid getting such errors at all, so let's add client side validation
        throw error;
      });
  };
}
