import React, { useEffect, useState } from "react";
import fetchJsonp from "fetch-jsonp";
import axios from "axios";
import StackGrid from "react-stack-grid";
import ScammerNumberItem from "./ScammerNumberItem";
import { utc } from "moment";
import { useHistory } from "react-router-dom";

import {
  Skeleton,
  Row,
  Col,
  Card,
  Result,
  Icon,
  Typography,
  Button
} from "antd";
import queryString from "query-string";
function ScammerFinderPage(props) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const history = useHistory();
  const FindNumber = str => {
    // Sometimes we have strings that have a single I or O in them
    // ... Can I Uninstall ...
    // This I would be replaced with a 1 later on and cause the number to become invalid.
    // Look for these sorts of situations and remove them!
    var clean = str.replace(/[a-zA-Z] [IO] [a-zA-Z]/g, "");
    //  Filter out words that have more than 3 consequent characters
    clean = clean.replace(/(?:[a-zA-Z]{3,}|[\$\@()+.])+/g, "");
    // Remove non alphanumeric chars
    clean = clean.replace(/[^a-zA-Z0-9]/g, "");
    clean = clean.replace("I", "1").replace("O", "0");
    let matches = /\s*(?:\+?(\d{1,3}))?[-. (]*(\d{3})[-. )]*(\d{3})[-. ]*(\d{4})(?: *x(\d+))?\s*/.exec(
      clean
    );
    if (matches != null && matches.length > 0) {
      return matches[0];
    }
    return null;
  };
  const diff = (timestamp1, timestamp2) => {
    var difference = timestamp1 - timestamp2;
    var minutes = Math.floor(difference / 1000 / 60);

    return minutes;
  };

  const chunk = (arr, len) => {
    var chunks = [],
      i = 0,
      n = arr.length;

    while (i < n) {
      chunks.push(arr.slice(i, (i += len)));
    }

    return chunks;
  };

  useEffect(() => {
    let params = queryString.parse(props.location.search);
    // https://www.reddit.com/r/all/search/.json?count=20&q=tech%20support&sort=new&t=hour
    // Homies over there allow us to make proper jsonp calls without building backend
    let query = params["query"];
    query = query == null ? "tech support" : query;

    let sortBy = params["sortBy"];
    sortBy = sortBy == null ? "new" : sortBy;

    let timeFrame = params["timeFrame"];
    timeFrame = timeFrame == null ? "day" : timeFrame;

    fetch(
      "https://jsonp.afeld.me/?url=" +
        encodeURIComponent(
          "https://www.reddit.com/r/all/search/.json?count=125&q=" +
            query +
            "&sort=" +
            sortBy +
            "&t=" +
            timeFrame
        )
    )
      .then(res => res.json())
      .then(resJson => {
        let items_with_phone_nr = resJson.data.children.filter(item =>
          FindNumber(item.data.title)
        );
        console.log("itetms: " + JSON.stringify(items_with_phone_nr));
        let displayItems = items_with_phone_nr.map(item => {
          let age = diff(new Date().getTime(), item.data.created_utc * 1000);
          console.log(age);
          if (age > 60) {
            age = Math.round(age / 60) + " hours";
          } else {
            age = age + " min";
          }

          return {
            title: item.data.title,
            link: "https://reddit.com" + item.data.permalink,
            age: age,
            number: FindNumber(item.data.title)
          };
        });
        setItems(displayItems);
        setLoading(false);
      });
  }, []);
  return (
    <div>
      {/* <div style={{ background: "#ECECEC", padding: "30px" }}> */}
      <Skeleton loading={loading} active>
        {!loading && items.length == 0 ? (
          <Result
            status="error"
            title="No results found"
            subTitle="Try a different set of parameters.."
            extra={[
              <Button
                type="primary"
                key="console"
                onClick={() => {
                  window.location.reload();
                }}
              >
                Retry
              </Button>,
              <Button
                key="buy"
                onClick={() => {
                  history.push("/");
                }}
              >
                Go back
              </Button>
            ]}
          ></Result>
        ) : (
          <div></div>
        )}
        <Row gutter={16}>
          {items.map(item => (
            <Col style={{ paddingBottom: "20px" }} span={8}>
              <Card
                title={item.title}
                // extra={<a href="#">Link to reddit</a>}
                //style={{ width: window.innerWidth / 3 }}
              >
                <p>Age: {item.age}</p>
                <p>Parsed number: {item.number}</p>
                <p>
                  Link:{" "}
                  <a href={item.link} target="_blank">
                    Open post
                  </a>
                </p>
              </Card>{" "}
            </Col>
          ))}
        </Row>
      </Skeleton>
    </div>
    // </div>
  );
}

export default ScammerFinderPage;
