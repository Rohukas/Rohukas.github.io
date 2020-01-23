import React from "react";
import logo from "./logo.svg";
import "./App.css";
import { fetchJsonp } from "fetch-jsonp";
import ScammerFinderPage from "./components/ScammerFinderPage";
import { BrowserRouter as Router, Route } from "react-router-dom";
import ChoicePage from "./components/ChoicePage";
function App() {
  return (
    <Router>
      <Route
        exact
        path={process.env.PUBLIC_URL + "/"}
        component={ChoicePage}
      ></Route>
      <Route
        path={process.env.PUBLIC_URL + "/find"}
        component={ScammerFinderPage}
      ></Route>
    </Router>
  );
}

export default App;
