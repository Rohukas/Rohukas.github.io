import React from "react";
import logo from "./logo.svg";
import "./App.css";
import { fetchJsonp } from "fetch-jsonp";
import ScammerFinderPage from "./components/ScammerFinderPage";
import { BrowserRouter as Router, Route } from "react-router-dom";
import ChoicePage from "./components/ChoicePage";
function App() {
  return (
    <Router basename="/scamfinder">
      <Route exact path="/" component={ChoicePage}></Route>
      <Route exact path="/find" component={ScammerFinderPage}></Route>
    </Router>
  );
}

export default App;
