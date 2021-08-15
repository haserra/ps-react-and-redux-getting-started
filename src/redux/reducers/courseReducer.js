import * as types from "../actions/actionTypes";
import initialState from "./initialState";

/**
 *
 * @param {*} state will end up storing an array of courses, so it should be initialized to an empty array.
 * @param {*} action
 * @returns
 */
export default function courseReducer(state = initialState.courses, action) {
  switch (action.type) {
    // case "CREATE_COURSE":
    /*     
   case types.CREATE_COURSE:
      // debugger;
      //state.push(action.course) // never do this ! this is mutating state directly. Instead return an updated copy of state using the spread operator (As for ES6 +)
      return [...state, { ...action.course }]; // spread the original (state) array into a list of parameters, then put the result into  new array, then push a copy of action.course into the new array
  */
    case types.CREATE_COURSE_SUCCESS:
      return [...state, { ...action.course }];

    case types.UPDATE_COURSE_SUCCESS:
      return state.map((course) =>
        course.id === action.course.id ? action.course : course
      );

    case types.LOAD_COURSES_SUCCESS:
      return action.courses;

    case types.DELETE_COURSE_OPTIMISTIC:
      return state.filter((course) => course.id !== action.course.id);

    default:
      return state;
  }
}
