import React from "react";
import { render } from "react-dom";
import { BrowserRouter as Router } from "react-router-dom"; // react-router-dom is the version that works for the web
import "bootstrap/dist/css/bootstrap.min.css"; // the right file to import CSS files is index.js, the entry point of the App
import App from "./components/App";
//import App from "./App";
import "./index.css";
import configureStore from "./redux/configureStore";
import { Provider as ReduxProvider } from "react-redux"; // Provider is a Higher-Order component that proviedes React's store data to child components

// let's instantiate the store
const store = configureStore(); // it can be useful to pass in, initial state into the store, overriding initial state passed in the reducers themselves

// from now on we are good to go, so let's connect our first container component to work with redux

function Hello() {
  return <p>Hello World</p>;
}

render(
  <ReduxProvider store={store}>
    <Router>
      <App />
    </Router>
  </ReduxProvider>,
  document.getElementById("app-root")
);
