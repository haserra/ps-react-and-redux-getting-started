import React, { Component } from "react";

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

    this.handleChange = this.handleChange.bind(this); // Now the function is only bound once

    // ! however Arrow functions inherit the binding context of their enclosing scope, and normal functions dont't !
  }

  // this is called a class field,  a new feature on ES2018
  // After ES2018 and later, it's better to define the change handler as an arrow function, because the "this" context is inherited from the class, not from the caller

  handleChange_ = (event) => {
    const course = {
      ...this.state.course, // Note: this way, our method is inheriting the this context of the caller, which is the change handler
      title: event.target.value,
    };

    // Set state using setState
    this.setState({ course: course });
  };

  /**
   * Define class methods
   */

  handleChange(event) {
    // Warning: Do Not Mutate state directly!
    // this.state.course.title = event.target.value; // <-- this is wrong!!!
    // instead create a copy of it, like this, using object spread
    // with Object spread any values on the right side override those on the left

    const course = {
      ...this.state.course, // Warning: this way, our method is inheriting the this context of the caller, which is the change handler
      title: event.target.value,
    };

    // Set state using setState
    this.setState({ course: course });
    // but I could use the Object short hand syntax instead
    // this.setState({ course})
  }

  // overiding the implementaion of render (?)
  render() {
    /**
     *  define UI
     */
    return (
      <form>
        <h2>Courses</h2>
        <h3>Add Course</h3>
        <input
          type="text"
          onChange={this.handleChange}
          value={this.state.course.title}
        />
        <input type="submit" value="Save" />
      </form>
    );
  }
}

export default CoursesPage;
