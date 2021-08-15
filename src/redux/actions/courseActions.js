// this file will define the course action creators
import * as types from "./actionTypes";
import * as courseApi from "../../api/courseApi";
import { beginApiCall, apiCallError } from "./apiStatusActions";

// this function only creates an action - it is an Action Creator
// it returns an object, with a property named type and a payload: course

// to avoid typos it is recommended to use constants instead!

// WE MAY REMOVE THIS ACTION CREATOR, WE ARE NOT USING IT ANYMORE

export function createCourse(course) {
  debugger;
  return {
    //type: "CREATE_COURSE", // type which is a constant - and this is the only mandatory field
    type: types.CREATE_COURSE,

    //course: course, // the payload. Here I can use the object shorthand syntax
    course,
  };
}

/**
 export function createCourse(course) {
  return {
    type: "CREATE_COURSE", // type which is a constant - and this is the only mandatory field
    //course: course, // the payload. Here I can use the object shorthand syntax
    course: course
  };
} 
*/

//  let's create ou Action Creator relative to Load courses success

export function loadCourseSuccess(courses) {
  return {
    type: types.LOAD_COURSES_SUCCESS,
    courses: courses,
  };
}

export function updateCourseSuccess(course) {
  return {
    type: types.UPDATE_COURSE_SUCCESS,
    course,
  };
}

export function createCourseSuccess(course) {
  return {
    type: types.CREATE_COURSE_SUCCESS,
    course,
  };
}

export function deleteCourseOptimistic(course) {
  return {
    type: types.DELETE_COURSE_OPTIMISTIC,
    course: course,
  };
}

// we created an Action/ Actions, so now we need a function that will handle the action - that's when Reducers come to handy

// we add thunks in the courseActions

// for a first thunk, let's load courses when the app initially loads, using the coursesApi library
// thunks are placed at the bottom

/**
 *
 * Thunks
 */

// loadCourses thunk
export function loadCourses() {
  // Redux thunk injects dispatch so we don't have to.
  return function (dispatch) {
    dispatch(beginApiCall());
    // now, our own code
    return courseApi
      .getCourses()
      .then((courses) => {
        dispatch(loadCourseSuccess(courses)); // dispatch to the store!!!
      })
      .catch((error) => {
        dispatch(apiCallError(error)); // but it would be nice to avoid getting such errors at all, so let's add client side validation
        throw error;
      });
  };
}

// Because our form need a save function, therefore we need to create a new action
// saveCourse thunk
export function saveCourse(course) {
  return function (dispatch, getState) {
    dispatch(beginApiCall());
    // getState contains all the state from the store
    return courseApi
      .saveCourse(course)
      .then((savedCourse) => {
        course.id
          ? dispatch(updateCourseSuccess(savedCourse))
          : dispatch(createCourseSuccess(savedCourse));
      })
      .catch((error) => {
        dispatch(apiCallError(error)); // but it would be nice to avoid getting such errors at all, so let's add client side validation
        throw error; // up to this point (without the line right above), Redux isn't being notified that the API is completed IF the API call fails
        // we need to decrement the number of API calls in progress when an API call fails
      });
  };
}

// This thunk is a bit different from the other thunks:
// 1. Immediately dispatching deleteCourse
// 2. NOT dispatching beginApiCall

export function deleteCourse(course) {
  return function (dispatch) {
    // Doing optimistic delete, so not dispatching begin/ end api call
    // actions, or apiCallError action since we're not showing the loading status for this.
    dispatch(deleteCourseOptimistic(course));
    return courseApi.deleteCourse(course.id);
  };
}
