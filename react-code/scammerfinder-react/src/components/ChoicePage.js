import React, { useState } from "react";
import {
  Radio,
  Input,
  Row,
  Col,
  Button,
  Card,
  Tooltip,
  InputNumber,
  Checkbox
} from "antd";
import { useHistory } from "react-router-dom";
import Information from "./Information";

function ChoicePage(props) {
  const [state, setState] = useState({
    sortBy: "new",
    timeFrame: "hour",
    query: "tech support",
    count: 125,
    showAll: true
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
  const countChanged = newVal => {
    setState(prevState => ({
      ...prevState,
      count: newVal
    }));
  };
  const checkboxChanged = e => {
    setState(prevVal => ({
      ...prevVal,
      showAll: e.target.checked
    }));
  };
  const radioStyle = {
    display: "block",
    height: "30px",
    lineHeight: "30px"
  };
  return (
    <div>
      <Information></Information>
      <Row>
        <Col span={12} offset={6} style={{ textAlign: "center" }}>
          <Card title="Select the sorting method.">
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
          <br></br>

          <Card title="Select the time-frame. How old should the posts be at maximum?">
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
          <br></br>

          <Card title="Amount of posts to load. Anything around 125 - 250 is more than enough.">
            <InputNumber
              min={25}
              max={500}
              defaultValue="125"
              name="count"
              precision={0}
              onChange={countChanged}
            />
          </Card>
          <Card>
            <Checkbox onChange={checkboxChanged} defaultChecked={true}>
              Show duplicate numbers
            </Checkbox>
          </Card>
          <br></br>
          <Card title="Enter your query. Try something like 'tech support' or 'customer support'">
            <Input
              placeholder="Tech support"
              name="query"
              onChange={onChange}
              style={{ width: 200, marginBottom: "10px" }}
            />
            <br></br>
            <Button
              type="primary"
              icon="search"
              onClick={() => {
                history.push(
                  "/find?timeFrame=" +
                    state.timeFrame +
                    "&sortBy=" +
                    state.sortBy +
                    "&query=" +
                    state.query +
                    "&count=" +
                    state.count +
                    "&showAll=" +
                    state.showAll
                );
              }}
            >
              Search
            </Button>
          </Card>
        </Col>
      </Row>
    </div>
  );
}

export default ChoicePage;
