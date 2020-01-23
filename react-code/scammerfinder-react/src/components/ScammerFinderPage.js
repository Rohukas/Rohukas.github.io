import React, { useEffect, useState } from "react";
import fetchJsonp from "fetch-jsonp";
import axios from "axios";
import StackGrid from "react-stack-grid";
import ScammerNumberItem from "./ScammerNumberItem";
import { utc } from "moment";
import { useHistory } from "react-router-dom";
import { blue } from "@ant-design/colors";
import {
  Skeleton,
  Row,
  Col,
  Card,
  Result,
  Icon,
  Typography,
  Button,
  PageHeader,
  message
} from "antd";

import queryString from "query-string";
const style = {
  width: "350px",
  height: "200px",
  border: "solid 1px #555",
  backgroundColor: "#eed",
  boxShadow: "10px -10px  rgba(0,0,0,0.6)"
};
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

    let count = params["count"];
    count = count == null ? 125 : count;

    let showAll = params["showAll"];
    showAll = showAll == null ? true : showAll === "true";

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

        // Filter out numbers if needed
        if (!showAll) {
          let tempList = [];
          for (const scammer of displayItems) {
            // Check if already in list
            let alreadyInList = false;
            for (const s of tempList) {
              if (s.number == scammer.number) {
                alreadyInList = true;
              }
            }
            if (!alreadyInList) {
              tempList.push(scammer);
            }
          }
          displayItems = tempList;
        }

        setItems(displayItems);
        setLoading(false);
      });
  }, []);
  return (
    <div>
      <Skeleton loading={loading} active>
        <PageHeader
          style={{ backgroundColor: blue.primary }}
          onBack={() => history.push("/")}
          title="Menu"
          subTitle="Go back to menu"
        />
        {!loading && items.length == 0 ? (
          <Result
            status="error"
            // title="No results found"
            // subTitle="Try a different set of parameters.."
            style={{ textAlign: "center" }}
            extra={[
              <h1 style={{ color: "white" }}>No results were found.</h1>,
              <p>Try a different set of parameters.</p>,
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
        <Row
          gutter={16}
          style={{
            marginLeft: 20,
            marginRight: 20,
            marginTop: 30,
            marginBottom: 30
          }}
        >
          {items.map(item => (
            <Col style={{ paddingBottom: "20px" }} span={8}>
              <Card
                title={item.title}
                // extra={<a href="#">Link to reddit</a>}
                //style={{ width: window.innerWidth / 3 }}
                style={{
                  border: "solid 1px #555",
                  backgroundColor: "#eed",
                  boxShadow: "10px -10px  rgba(0,0,0,0.6)",
                  paddingRight: 20
                }}
              >
                <p>Age: {item.age}</p>
                <p>Parsed number: {item.number}</p>
                <p>
                  Link:{" "}
                  <a href={item.link} target="_blank">
                    Open post
                  </a>
                </p>
                <Button
                  type="primary"
                  onClick={() => {
                    navigator.clipboard.writeText(item.number);
                    message.info("Copied number to clipboard!");
                  }}
                >
                  Copy number
                </Button>
              </Card>
            </Col>
          ))}
        </Row>
      </Skeleton>
    </div>
    // </div>
  );
}

export default ScammerFinderPage;
