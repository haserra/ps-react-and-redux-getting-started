// Firstly we import the core libraries that we will need in any container components

// SECTION 1: Imports needed in any Container component

// import { checkPropTypes } from "prop-types";
import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import * as courseActions from "../../redux/actions/courseActions"; // we need to import our courseActions to be able to dispatch them

// instead I can use a named import:
// import { loadCourses, saveCourse } from "../../redux/actions/courseActions"; // we need to import our courseActions to be able to dispatch them

import * as authorActions from "../../redux/actions/authorActions"; // we also need to import our authorActions to be able to dispatch them
// import { loadAuthors } from "../../redux/actions/authorActions"; // we also need to import our authorActions to be able to dispatch them

import PropTypes from "prop-types";
import { bindActionCreators } from "redux"; // I kept it just for a reference an alternative way to implement mapDispatchToProps

import CourseForm from "./CourseForm";
import { newCourse } from "../../../tools/mockData";
import Spinner from "../common/Spinner";
import { toast } from "react-toastify";

/**
 * Once the Redux infrastructure is completed, we need to update our container component (ManageCoursePage) to connect to Redux
 */

// debugger;
// SECTION 2: The function Component Declaration

function ManageCoursePage(props) {
  // Note: I could declare the entire destructured object inside the function parameter

  /**
   *
   * Options for when to load courses
   * 1. When App loads
   * 2. When course page is loaded
   * 3. Define the right life cycle method where to call the API , knowing before hand that we are connected to Redux
   *
   */

  // Object destructuring and The rest pattern "..."
  // Check this out at : https://javascript.info/destructuring-assignment
  // ...otherProps is an object which contains all others (the rest of) properties of the Props object

  const {
    courses,
    authors,
    actions,
    loadCourses,
    saveCourse, // once we add saveCourse to mapDispatchToProps, we can destructure it on props
    loadAuthors,
    history,
    ...otherProps
  } = props;
  // const { course, courses, authors, actions, loadCourses, loadAuthors } = props;

  // courses, and authors have been mapped to props by mapStateToProps
  // actions have been mapped to props by mapDispatchToProps
  // loadCourses, loadAuthors have been mapped to props by mapDisptachToProps
  // saveCourse, has also been mapped to props by mapDispatchToProps, so now we can implement an handleSave function
  // once this mapping has been completed we can destructure the object

  // if we're not using Redux we would just write:
  // getCourses().then((courses) => this.setState({ courses: courses }));
  // but since we're using Redux, we need to invoke an action that has been binded to props via mapDispatchToProps, down below:

  // ! in order to avoid making a new http call each time the ManageCoursePage mounts we should see if we really need it, like this:

  // without using object destructuring as declared right above

  // IMPORTANT: The next consts are declaring LOCAL state, not Redux store state
  //            Redux store state has been mapped to props, and is declared above

  // defining (local) state for this function component. I'm not using state from Redux store!

  // IMPORTANT: To choose Redux vs local state, ask your self: "Who cares about this data? If only a few closely related components use that data, prefer plain React state"

  const [course, setCourse] = useState({ ...otherProps.course }); // it must be a copy of course, no the course itself
  // const [course_, setCourse] = useState(...course);
  const [errors, setErrors] = useState({}); // it must be a copy of course, not the course itself

  // setting some local state, this is fleeting data, that the rest of the application won't care about
  // we could run this interaction through the Redux flow, but it's completely unnecessary
  const [saving, setSaving] = useState(false);

  // IMPORTANT: Avoid using Redux for all state. Use plain React state

  useEffect(() => {
    if (courses.length === 0) {
      console.log("component did mount");
      loadCourses()
        .then((x) => console.log("Everything went ok " + x))
        .catch((error) => {
          alert("Loading courses failed" + error);
        });
    } else {
      setCourse({ ...otherProps.course });
    }

    if (authors.length === 0) {
      loadAuthors()
        .then((y) => console.log("Everything went ok " + y))
        .catch((error) => {
          alert("Loading authors failed" + error);
        });
    }
  }, [props.course]);

  // NEVER forget to declare the dependency array of the useEffect hook - the dependency array is where we tell
  // useEffect when it should re-run

  function handleChange(event) {
    const { name, value } = event.target;
    const { target } = event;

    console.log(
      `The event its target name is ${event.target.name}. And the element that has been target is: ${event.target}`
    );
    // start thinking here:
    // to change the name of the course (event click), using a simple-minded approach would be:

    // DO NOT UNCOMMENT THIS !!!
    // course.title = event.target.title; // wrong !

    // because state is immutable, we need to create a copy of that piece

    const updatedCourse = {
      ...course,
      title: event.target.value,
    };

    // however it's better to use JavaScript Computed property name (ES6 syntax), like this:
    const updatedCourse_ = {
      ...course,
      [target.name]: event.target.value,
    };

    // I can either pass an object or a function to setState, so in this case I am passing a function to setState
    setCourse((prevCourse) => ({
      ...prevCourse,
      [name]: name === "authorId" ? parseInt(value, 10) : value,
    }));

    // or:
    /* setCourse( prevCourse => {
        return( 
          { 
            ...prevCourse,
            [name]: name === "authorId" ? parseInt(value, 10) : value }
        )
      }); */

    // or :
    // directly passing the object to setState:
    /* setCourse(updatedCourse_); */
  }

  function formIsValid() {
    // Object destructuring
    // actually this is what the object course is:

    /*  
      const course = {
      title: "some title",
      authorId: "the auithorId",
      category: "teh category"
    }; 
    
    */

    const { title, authorId, category } = course;
    const errors = {};

    if (!title) errors.title = "Title is required.";
    if (!authorId) errors.author = "Author is required";
    if (!category) errors.category = "Category is required";

    setErrors(errors);
    // Form is valid if the errors object still has no properties
    return Object.keys(errors).length === 0;
  }

  function handleSave(event) {
    event.preventDefault(); // to prevent the page to posting back
    if (!formIsValid()) return;
    setSaving(true);
    saveCourse(course)
      .then(() => {
        // we want to display the toast after the save is successfully completed
        toast.success("Course saved.");
        history.push("/courses");
      })
      .catch((error) => {
        setSaving(false); // This way the user can try submitting the form again after an error occurs
        setErrors({
          onSave: error.message,
        });
      }); // course which is available in state

    // at this point we still have/ had two problems:
    // 1. Don't have a link to add course
    // 2. No feedback upon save

    // Let's use React Router's history object to handle redirect:
  }

  /**
   *  define UI
   */

  return authors.length === 0 || courses.length === 0 ? (
    <Spinner />
  ) : (
    <>
      <h2>Manage Course</h2>
      <h3>Manage a Course</h3>

      {/* {this.props.courses.map((course) => (
          <div key={course.title}>{course.title}</div>
        ))} */}

      {/**
       * ! Note: we may omit the fragment up above
       */}

      <CourseForm
        course={course}
        errors={errors}
        authors={authors}
        onChange={handleChange}
        onSave={handleSave}
        saving={saving}
      />
    </>
  );
}

// SECTION 3: PropTypes declaration

// props types!
ManageCoursePage.propTypes = {
  course: PropTypes.object.isRequired,
  authors: PropTypes.array.isRequired,
  courses: PropTypes.array.isRequired,
  //dispatch: PropTypes.func.isRequired,
  // createCourse: PropTypes.func.isRequired,
  actions: PropTypes.object.isRequired,
  loadCourses: PropTypes.func.isRequired,
  saveCourse: PropTypes.func.isRequired,
  loadAuthors: PropTypes.func.isRequired,
  history: PropTypes.object.isRequired,
};

// this function is typically called selector, because it selects data from the Redux store
// learn more here: https://react-redux.js.org/using-react-redux/connect-mapstate#use-selector-functions-to-extract-and-transform-data

export function getCourseBySlug(courses, slug) {
  return courses.find((course) => course.slug === slug) || null;
}

// SECTION 4: Redux mapStateToProps and mapDispatchToProps functions which determines what state and what actions we'd like to access in our component

// 1. what part of the state we expose (is passed) to our component, via props?
// mapStateToProps determines that:
// this function connects pieces of state to props

// IMPORTANT: mapStateToProps function runs every time the Redux store changes!

function mapStateToProps(state, ownProps) {
  // because initially we only have an array of courses, as our state, we will return that array of courses, out of the state object
  // we may don't need ownProps argument.
  // we need it to get the slug:
  const slug = ownProps.match.params.slug;
  // debugger;
  const course =
    slug && state.courses.length > 0
      ? getCourseBySlug(state.courses, slug)
      : newCourse;

  // debugger;
  return {
    // _courses: state.courses,
    course_: state.course, // why not like this?
    // course: newCourse, // this way, we are always passing in an empty course
    course: course,
    // could be :
    //course,
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

// Here is the best declaration:

const mapDispatchToProps = {
  loadCourses: courseActions.loadCourses,
  saveCourse: courseActions.saveCourse,
  loadAuthors: authorActions.loadAuthors,
};

// alternatively:

/* const mapDispatchToProps = {
  loadCourses,
  loadAuthors,
  saveCourse
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
