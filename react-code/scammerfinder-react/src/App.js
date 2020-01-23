import React from "react";
import logo from "./logo.svg";
import "./App.css";
import { fetchJsonp } from "fetch-jsonp";
import ScammerFinderPage from "./components/ScammerFinderPage";
import { HashRouter as Router, Route } from "react-router-dom";
import ChoicePage from "./components/ChoicePage";
function App() {
  return (
    <Router basename={process.env.PUBLIC_URL}>
      <Route exact path={"/"} component={ChoicePage}></Route>
      <Route path={"/find"} component={ScammerFinderPage}></Route>
    </Router>
  );
}

export default App;
