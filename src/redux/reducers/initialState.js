// ! this represents the initial shape of the Redux Store its state !
// remember : state can be split up into many slices, and each specific slice can be handled by a dedicated Reducer

export default {
  courses: [],
  authors: [],
  apiCallsInProgress: 0, // theoretically we can have multiple API calls, in progress, at the same time. Number of API calls in progress
};
