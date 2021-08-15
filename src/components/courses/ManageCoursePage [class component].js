// Firstly we import the core libraries that we will need in any container components

// SECTION 1: Imports needed in any Container component

// import { checkPropTypes } from "prop-types";
import React, { Component } from "react";
import { connect } from "react-redux";
import * as courseActions from "../../redux/actions/courseActions"; // we need to import our courseActions to be able to dispatch them
// instead I can use a named import:
//import { loadCourses } from "../../redux/actions/courseActions"; // we need to import our courseActions to be able to dispatch them

import * as authorActions from "../../redux/actions/authorActions"; // we also need to import our authorActions to be able to dispatch them

//import { loadAuthors } from "../../redux/actions/authorActions"; // we also need to import our authorActions to be able to dispatch them

import PropTypes from "prop-types";
import { bindActionCreators } from "redux";

/**
 * Once the Redux infrastructure is completed, we need to update our container component (ManageCoursePage) to connect to Redux
 */

// debugger;
// SECTION 2: The Class Component Declaration

class ManageCoursePage extends Component {
  /**
   * Let's handle adds/ edits on a separate page (component), so this component is only concerned with
   */

  /**
   *
   * Options for when to load courses
   * 1. When App loads
   * 2. When course page is loaded
   * 3. Define the right life cycle method where to call the API , knowing before hand that we are connected to Redux
   *
   */

  componentDidMount() {
    const { courses, authors, actions, loadCourses, loadAuthors } = this.props;

    // if we're not using Redux we would just write:
    // getCourses().then((courses) => this.setState({ courses: courses }));
    // but since we're using Redux, we need to invoke an action that has been binded to props via mapDispatchToProps, down below:

    // Warning: In order to avoid making a new http call each time the ManageCoursePage mounts we should see if we really need it, like this:

    // without using object destructuring as declared right above

    if (courses.length === 0) {
      console.log("component did mount");
      loadCourses()
        .then((x) => console.log("Everything went ok " + x))
        .catch((error) => {
          alert("Loading courses failed" + error);
        });
    }

    if (authors.length === 0) {
      loadAuthors()
        .then((y) => console.log("Everything went ok " + y))
        .catch((error) => {
          alert("Loading authors failed" + error);
        });
    }
  }

  /**
   * Define class methods
   */

  // overiding the implementaion of render (?)
  render() {
    /**
     *  define UI
     */
    return (
      <>
        <h2>Manage Course</h2>
        <h3>Manage a Course</h3>

        {/* {this.props.courses.map((course) => (
          <div key={course.title}>{course.title}</div>
        ))} */}
      </>
    );
  }
}

// SECTION 3: PropTypes declaration

// props types!
ManageCoursePage.propTypes = {
  authors: PropTypes.array.isRequired,
  courses: PropTypes.array.isRequired,
  //dispatch: PropTypes.func.isRequired,
  // createCourse: PropTypes.func.isRequired,
  actions: PropTypes.object.isRequired,
  loadCourses: PropTypes.func.isRequired,
  loadAuthors: PropTypes.func.isRequired,
};

// SECTION 4: Redux mapStateToProps and mapDispatchToProps functions which determines what state and what actions we'd like to access in our component

// 1. What part of the state we expose (is passed) to our component, via props?
// mapStateToProps determines that:
// this function connects pieces of state to props

function mapStateToProps(state, ownProps) {
  // because initially we only have an array of courses, as our state, we will return that array of courses, out of the state object
  // we may don't need ownProps argument

  // debugger;

  return {
    // _courses: state.courses,
    courses: state.courses,
    authors: state.authors,
  };
}

// There are four options or ways to handle mapDispatchToProps
// 1. ignore it
// 2. wrap manually - it is the best option when getting started with Redux
// 3. using bindActionCreators
// 4. using an object instead of a function

// 2. mapDispatchToProps determines what actions are available ON PROPS in our component - i.e., what actions we want to expose on our component
// if we omit this function (mapDispatchToProps) a default dispatch prop is injected automatically
// alternative way:

// alternatively we should be more specific :

function _mapDispatchToProps(dispatch) {
  return {
    actions: {
      loadCourses: bindActionCreators(courseActions.loadCourses, dispatch), // now only loadCourses will be dipstached actions wrapped by disptach will be returned in an object instead
      loadAuthors: bindActionCreators(authorActions.loadAuthors, dispatch),
    },
  };
}

// There are four different ways to handle mapDisptachToProps:
// 1. Ignore it
// 2. Manually wrap in dispatch
// 3. Use bindActionCreators
// 4. Return an Object

// in this component (ManageCoursePage), let's use the object form of mapDispatchToProps in order to simplify our code.

// using an object
// inside the object we can declare properties for each action we want to expose
// if we declare mapDispatchToProps as an object instead, each property will automatically be bound to dispatch!

// Here is the declaration:

const mapDispatchToProps = {
  loadCourses: courseActions.loadCourses,
  loadAuthors: authorActions.loadAuthors,
};

/* const mapDispatchToProps = {
  loadCourses,
  loadAuthors
}; */

const __mapDispatchToProps = {
  createCourse: courseActions.createCourse, // when we declare as an object, each property is automatically bound to dispatch
};

// export default ManageCoursePage; instead of exporting default our entire component, let's decorate it with connect
// connect function, connects our components to Redux

// Two ways of doing this:

// SECTION 5: a call to connect, which connects this component to Redux library

export default connect(mapStateToProps, mapDispatchToProps)(ManageCoursePage);
// export default connect(mapStateToProps)(ManageCoursePage);

// function mapDispatchToProps

// at this point we don´t need a mapDispatchToProps function, so our component gets a dispatch prop injected automatically

// or

// const connectedStateAndProps = connect(mapStateToProps, mapDispatchToProps);
// export default connectedStateAndProps(ManageCoursePage);
