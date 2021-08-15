// import { checkPropTypes } from "prop-types";
import React, { Component } from "react";
import { connect } from "react-redux";
import * as courseActions from "../../redux/actions/courseActions"; // we need to import our courseActions to be able to dispatch them
import * as authorActions from "../../redux/actions/authorActions"; // we also need to import our authorActions to be able to dispatch them
import PropTypes from "prop-types";
import { bindActionCreators } from "redux";
import CourseList from "./courseList";
import { Redirect } from "react-router-dom";
import Spinner from "../common/Spinner";
import { toast } from "react-toastify";

/**
 * Once the Redux infrastructure is completed, we need to update our container component (CoursesPage) to connect to Redux
 */
// debugger;

class CoursesPage extends Component {
  state = {
    course: {
      title: "Intro to Redux",
    },
    courses: [],
    authors: [],
    redirectToAddCoursePage: false,
  };

  /**
   * Let's handle adds/ edits on a separate page (component), so this component is only concerned with
   */

  /**
   *
   * Options for when to load courses
   * 1. When App loads
   * 2. When course page is loaded
   * 3. Define the right life cycle method where to call the API, knowing before hand that we are connected to Redux
   *
   */

  componentDidMount() {
    const { courses, authors, actions } = this.props;

    // if we're not using Redux we would just write:
    // getCourses().then((courses) => this.setState({ courses: courses }));
    // but since we're using Redux, we need to invoke an action that has been binded to props via mapDispatchToProps, down below:

    // in order to avoid making a new http call each time the CoursesPage mounts we should see if we really need it, like this:

    // without using object destructuring as declared right above

    if (this.props.courses.length === 0) {
      console.log("component did mount");
      this.props.actions
        .loadCourses()
        .then()
        .catch((error) => {
          alert("Loading courses failed" + error);
        });
    }

    if (this.props.authors.length === 0) {
      actions
        .loadAuthors()
        .then()
        .catch((error) => {
          alert("Loading authors failed" + error);
        });
    }
  }

  // without using object destructuring as declared right above

  /* if (courses.length === 0) {
      console.log("component did mount");
      actions
        .loadCourses()
        .then()
        .catch((error) => {
          alert("Loading courses failed" + error);
        });
    }

    if (authors.length === 0) {
      this.props.actions
        .loadAuthors()
        .then()
        .catch((error) => {
          alert("Loading authors failed" + error);
        });
    } */

  /**
   * Define class methods
   */

  handleDeleteCourse = (course) => {
    toast.success("Course deleted");
    this.props.actions.deleteCourse(course).catch((error) => {
      toast.error("Delete failed. " + error.message, {
        autoClose: false,
      });
    });
  };

  // let's refactor the handleDeleteCourse method to use Async/ Await instead of Promises

  handleDeleteCourse_ = async (course) => {
    toast.success("Course deleted!");
    try {
      await this.props.actions.deleteCourse(course);
    } catch (error) {
      toast.error("Delete failed. " + error.message, {
        autoClose: false,
      });
    }
  };

  // overiding the implementaion of render (?)
  render() {
    /**
     *  define UI
     */
    return (
      <>
        {this.state.redirectToAddCoursePage && <Redirect to="/course" />}
        <h2>Courses</h2>
        <h3>Add Course</h3>
        {console.log(
          `There are currently ${this.state.apiCallsInProgress} in progress`
        )}
        {this.props.loading ? (
          <Spinner />
        ) : (
          <>
            <button
              style={{ marginBottom: 20 }}
              className="btn btn-primary add-course"
              onClick={() => this.setState({ redirectToAddCoursePage: true })}
            >
              Add Course
            </button>

            {/* {this.props.courses.map((course) => (
            <div key={course.title}>{course.title}</div>
            ))} */}

            <CourseList
              onDeleteClick={this.handleDeleteCourse}
              courses={this.props.courses}
            />
          </>
        )}
      </>
    );
  }
}

// props types!
CoursesPage.propTypes = {
  authors: PropTypes.array.isRequired,
  courses: PropTypes.array.isRequired,
  //dispatch: PropTypes.func.isRequired,
  // createCourse: PropTypes.func.isRequired,
  actions: PropTypes.object.isRequired,
  loading: PropTypes.bool.isRequired,
};

// 1. what part of the state we expose (is passed) to our component, via props?
// mapStateToProps determines that:
// this function connects pieces of state to props

function mapStateToProps(state, ownProps) {
  // because initially we only have an array of courses , as our state, we will return that array of courses, out of the state object
  // we may dont need ownProps argument
  // debugger;
  return {
    // _courses: state.courses,
    courses:
      state.authors.length === 0
        ? []
        : state.courses.map((course) => {
            return {
              ...course,
              authorName: state.authors.find((a) => a.id === course.authorId)
                .name,
            };
          }),
    authors: state.authors,
    loading: state.apiCallsInProgress > 0,
  };
}

// alternatively using object destructuring in the argument
// let { courses } = this.state;
function _mapStateToProps({ courses }) {
  return {
    courses,
  };
}

// There are four options to handle mapDispatchToProps
// 1. ignore it
// 2. wrap manually - it is the best option when getting started with Redux
// 3. using bindActionCreators -
// 4. using an object instead of a function

// 2. mapDispatchToProps determines what actions are available ON PROPS in our component - i.e., what actions we want to expose on our component
// if we omit this function (mapDispatchToProps) a default dispatch prop is injected automatically
// alternative way:
function _mapDispatchToProps(dispatch) {
  // return the createCourseAction
  // from now , only the actions we declare in mapDispatchToProps are going to be injeted in our container component. Dispatch is no longer injected.
  return {
    createCourse: (course) => dispatch(courseActions.createCourse(course)),
    /* createCourse: function(course){
      return dispatch(courseActions.createCourse(course))
    } */
  };
}

function ___mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(courseActions, dispatch), // this way ALL actions wrapped by disptach will be returned in an object instead
  };
}

// alternatively we should be more specific :

function mapDispatchToProps(dispatch) {
  return {
    actions: {
      loadCourses: bindActionCreators(courseActions.loadCourses, dispatch), // now only loadCourses will be dipstached actions wrapped by disptach will be returned in an object instead
      loadAuthors: bindActionCreators(authorActions.loadAuthors, dispatch),
      deleteCourse: bindActionCreators(courseActions.deleteCourse, dispatch),
    },
  };
}

// using an object
// inside the object we can declare properties for each action we want to expose
const __mapDispatchToProps = {
  createCourse: courseActions.createCourse, // when we declare as an object, each property is automatically bound to dispatch
};

// export default CoursesPage; instead of exporting default our entire component, lets decorate it with connect
// connect function, connects our components to Redux

// Two ways of doing this:

export default connect(mapStateToProps, mapDispatchToProps)(CoursesPage);
// export default connect(mapStateToProps)(CoursesPage);

// function mapDispatchToProps

// at this point we don´t need a mapDispatchToProps function, so our component gets a dispatch prop injected automatically

// or

// const connectedStateAndProps = connect(mapStateToProps, mapDispatchToProps);
// export default connectedStateAndProps(CoursesPage);
