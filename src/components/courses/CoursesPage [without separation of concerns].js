// import { checkPropTypes } from "prop-types";
import React, { Component } from "react";
import { connect } from "react-redux";
import * as courseActions from "../../redux/actions/courseActions"; // we need to import our courseActions to be able to dispatch them
import PropTypes from "prop-types";
import { bindActionCreators } from "redux";

/**
 * Once the Redux infrastructure is completed, we need to update our container component (CoursesPage) to connect to Redux
 */

// debugger;

class CoursesPage extends Component {
  /**
   * define the class fields, in other words: state
   */
  state = {
    course: {
      title: "Intro to Redux",
    },
    courses: [],
    authors: [],
  };

  /**
   * However, I can completely omit the constructor as well ! So I can ignore the constructor()
   */
  constructor(props) {
    super(props);
    /**
     * set state here
     */
    this.state = {
      course: {
        title: "New Intro to Redux 2",
      },
    };

    // this.handleChange = this.handleChange.bind(this); // Now the function is only bound once
    // this.handleSubmit = this.handleSubmit.bind(this);

    // ! however Arrow functions inherit the binding context of their enclosing scope, and normal functions dont't!
  }

  // this is called a class field,  a new feature on ES2018
  // After ES2018 and later, it's better to define the change handler as an arrow function, because the "this" context is inherited from the class, not from the caller
  handleChange = (event) => {
    const course = { ...this.state.course, title: event.target.value }; // Warning: this way, our method is inheriting the this context of the caller , which is the change handler

    // Set state using setState
    this.setState({ course: course });
  };

  /**
 handleSubmit(event){
    event.preventDefault();
    alert(this.state.course.title);
  };
 */

  handleSubmit = (event) => {
    event.preventDefault();
    alert(this.state.course.title);
    // debugger;

    // this.props.dispatch(courseActions.createCourse(this.state.course));
    // alternatively if we wrap up createCourse in disptach (see below), then we can call createCourse directly, like so:
    // this.props.createCourse(this.state.course); // if using an object to expose actions

    this.props.actions.createCourse(this.state.course);
  };

  /**
   * Define class methods
   */
  /**
 * 
   handleChange_(event) {
    // Warning: Do Not Mutate state directly!
    // this.state.course.title = event.target.value; // <-- this is wrong!!!
    // instead create a copy of it, like this, using object spread
    // with Object spread any values on the right side override those on the left

    const course = {
      ...this.state.course, // Warning: this way, our method is inheriting the this context of the caller , which is the change handler
      title: event.target.value,
    };

    // Set state using setState
    this.setState({ course: course });
    // but I could use the Object short hand syntax instead
    // this.setState({ course})
  }
 * 
 */

  // overiding the implementaion of render (?)
  render() {
    /**
     *  define UI
     */
    return (
      <form onSubmit={this.handleSubmit}>
        <h2>Courses</h2>
        <h3>Add Course</h3>
        <input
          type="text"
          onChange={this.handleChange}
          value={this.state.course.title}
        />
        <input type="submit" value="Save" />
        {this.props.courses.map((course) => (
          <div key={course.title}>{course.title}</div>
        ))}
      </form>
    );
  }
}

// props types!
CoursesPage.propTypes = {
  courses: PropTypes.array.isRequired,
  //dispatch: PropTypes.func.isRequired,
  // createCourse: PropTypes.func.isRequired,
  actions: PropTypes.object.isRequired,
};

// 1. What part of the state we expose (is passed) to our component, via props?
// mapStateToProps determines that:
// this function connects pieces of state to props

function mapStateToProps(state, ownProps) {
  // because initially we only have an array of courses, as our state, we will return that array of courses, out of the state object
  // we may don't need ownProps argument

  // debugger;

  return {
    courses: state.courses,
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
// 3. using bindActionCreators
// 4. using an object instead of a function

// 2. mapDispatchToProps determines what actions are available ON PROPS in our component - i.e., what actions we want to expose on our component
// if we omit this function (mapDispatchToProps) a default dispatch prop is injected automatically
// alternative way:
function _mapDispatchToProps(dispatch) {
  // return the createCourseAction
  // from now on, only the actions we declare in mapDispatchToProps are going to be injeted in our container component. Dispatch is no longer injected.
  return {
    createCourse: (course) => dispatch(courseActions.createCourse(course)),
    /* createCourse: function(course){
      return dispatch(courseActions.createCourse(course))
    } */
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(courseActions, dispatch), // now all actions wrapped by disptach will be returned in an object instead
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
