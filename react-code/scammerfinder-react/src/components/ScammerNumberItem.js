import React from "react";
import { Card } from "antd";
import "antd/dist/antd.css"; // or 'antd/dist/antd.less'
function ScammerNumberItem(props) {
  return (
    <div>
      <Card
        title={props.title}
        // extra={<a href="#">Link to reddit</a>}
        style={{ width: window.innerWidth / 3 }}
      >
        <p>Age: {props.age}</p>
        <p>Parsed number: {props.number}</p>
        <p>Link: {props.link}</p>
      </Card>{" "}
    </div>
  );
}

export default ScammerNumberItem;
