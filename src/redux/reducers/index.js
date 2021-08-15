import { combineReducers } from "redux";
//import courseReducer from "./courseReducer";
import courses from "./courseReducer";
import authors from "./authorReducer";
import apiCallsinProgress from "./apiStatusReducer";

/**
 * As a rule of thumb, for each REST End Point, there's a different Reducer.
 *  Reducer for /courses
 */

/* const rootReducer = combineReducers({
  courses: courseReducer,
}); */

/* const rootReducer = combineReducers({
    courses: courses,
  }); */

const rootReducer = combineReducers({
  courses,
  authors,
  apiCallsinProgress,
});

export default rootReducer;
