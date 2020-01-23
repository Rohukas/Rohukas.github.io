import React, { useState } from "react";
import { Radio, Input, Row, Col, Button, Card, Tooltip } from "antd";
import { useHistory } from "react-router-dom";

function ChoicePage(props) {
  const [state, setState] = useState({
    sortBy: "new",
    timeFrame: "hour",
    query: "tech support"
  });
  const history = useHistory();

  const onChange = e => {
    const { value, name } = e.target;
    if ((!isNaN(value) || value !== "") && (!isNaN(name) || name !== "")) {
      setState(prevState => ({
        ...prevState,
        [name]: value
      }));
    }
  };

  const radioStyle = {
    display: "block",
    height: "30px",
    lineHeight: "30px"
  };
  return (
    <div>
      <h1></h1>
      <Row>
        <Col span={12} offset={6} style={{ textAlign: "center" }}>
          <Card title="Select the sorting method">
            <Radio.Group onChange={onChange} name="sortBy" value={state.sortBy}>
              <Radio style={radioStyle} value={"new"}>
                New
              </Radio>
              <Radio style={radioStyle} value={"relevance"}>
                Relevance
              </Radio>
              <Radio style={radioStyle} value={"hot"}>
                Hot
              </Radio>
            </Radio.Group>
          </Card>
          <Card title="Select the time-frame">
            <Radio.Group
              onChange={onChange}
              name="timeFrame"
              value={state.timeFrame}
            >
              <Radio style={radioStyle} value={"hour"}>
                Hour
              </Radio>
              <Radio style={radioStyle} value={"day"}>
                Day
              </Radio>
              <Radio style={radioStyle} value={"week"}>
                Week
              </Radio>
            </Radio.Group>
          </Card>
          <Card title="Enter your query">
            <Input
              placeholder="Tech support"
              name="query"
              onChange={onChange}
              style={{ width: 200 }}
            />
            <Button
              type="primary"
              icon="search"
              onClick={() => {
                history.push(
                  process.env.PUBLIC_URL +
                    "/find?timeFrame=" +
                    state.timeFrame +
                    "&sortBy=" +
                    state.sortBy +
                    "&query=" +
                    state.query
                );
              }}
            ></Button>
          </Card>
        </Col>
      </Row>
    </div>
  );
}

export default ChoicePage;
