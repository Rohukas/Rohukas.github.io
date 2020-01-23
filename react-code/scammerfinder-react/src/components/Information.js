import React from "react";

function Information(props) {
  return (
    <div
      style={{
        textAlign: "center",
        fontFamily: "Titillium Web, sans-serif"
      }}
    >
      <h1 style={{ color: "white", fontSize: 50 }}>
        Welcome to ScamFinder-Reddit
      </h1>
      <p>Start by entering some search ranges below and clicking 'Search'</p>
    </div>
  );
}

export default Information;
