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
  message,
  Spin
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
    let temp = "";
    // Replace unicode shit
    for (let c of clean) {
      switch (c) {
        case "𝟎":
          temp += "0";
          break;
        case "𝟭":
          temp += "1";
          break;
        case "𝟐":
          temp += "2";
          break;
        case "𝟑":
          temp += "3";
          break;
        case "𝟒":
          temp += "4";
          break;
        case "𝟓":
          temp += "5";
          break;
        case "𝟔":
          temp += "6";
          break;
        case "𝟕":
          temp += "7";
          break;
        case "𝟖":
          temp += "8";
          break;
        case "𝟗":
          temp += "9";
          break;
        case "𝟘":
          temp += "0";
          break;
        case "𝟙":
          temp += "1";
          break;
        case "𝟚":
          temp += "2";
          break;
        case "𝟛":
          temp += "3";
          break;
        case "𝟜":
          temp += "4";
          break;
        case "𝟝":
          temp += "5";
          break;
        case "𝟞":
          temp += "6";
          break;
        case "𝟟":
          temp += "7";
          break;
        case "𝟠":
          temp += "8";
          break;
        case "𝟡":
          temp += "9";
          break;
        case "𝟢":
          temp += "0";
          break;
        case "𝟣":
          temp += "1";
          break;
        case "𝟤":
          temp += "2";
          break;
        case "𝟥":
          temp += "3";
          break;
        case "𝟦":
          temp += "4";
          break;
        case "𝟧":
          temp += "5";
          break;
        case "𝟨":
          temp += "6";
          break;
        case "𝟩":
          temp += "7";
          break;
        case "𝟴":
          temp += "8";
          break;
        case "𝟵":
          temp += "9";
          break;
        case "𝟶":
          temp += "0";
          break;
        case "𝟷":
          temp += "1";
          break;
        case "𝟸":
          temp += "2";
          break;
        case "𝟹":
          temp += "3";
          break;
        case "𝟺":
          temp += "4";
          break;
        case "𝟻":
          temp += "5";
          break;
        case "𝟼":
          temp += "6";
          break;
        case "𝟽":
          temp += "7";
          break;
        case "𝟾":
          temp += "8";
          break;
        case "𝟿":
          temp += "9";
          break;
        default:
          temp += c;
      }
    }
    clean = temp;
    // Remove dates that have the format mm(/ or .)dd(/ or .)yyyy
    clean = clean.replace(
      /(?<=\D)[0-1][0-9][\/.][0-9]{1,2}[\/.][2][0]\d\d/g,
      ""
    );
    // Remove dates that have the format yy(/ or .)mm(/ or .)dd
    clean = clean.replace(
      /(?<=\D)[2][0]\d\d[\/.][0-3][0-9][\/.][0-9]{1,2}/g,
      ""
    );
    //Remove 24/7 and 24 Hour texts
    clean = clean.replace(/(?<=[a-zA-Z]{2,}) \d\d..(?=[a-zA-Z ]){2,}/g, "");

    // Remove 24 hour texts that are in the beginning
    clean = clean.replace(/^\d\d..(?=[a-zA-Z ]){2,}/g, "");

    //  Filter out words that have more than 3 consequent characters
    clean = clean.replace(/(?:[a-zA-Z]{3,}|[\$\@()+.])+/g, "");
    // Remove non alphanumeric chars
    clean = clean.replace(/[^a-zA-Z0-9]/g, "");
    clean = clean.replace("I", "1").replace("O", "0");
    // let matches = /\s*(?:\+?(\d{1,3}))?[-. (]*(\d{3})[-. )]*(\d{3})[-. ]*(\d{4})(?: *x(\d+))?\s*/.exec(
    //   clean
    // );
    let matches = /\d{9,11}/.exec(clean);
    if (matches != null && matches.length > 0) {
      return matches[0];
    }
    console.log("No match: " + str);
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
        let displayItems = items_with_phone_nr.map(item => {
          let age = diff(new Date().getTime(), item.data.created_utc * 1000);
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

        {/* {loading ? (
        <Spin style={{ textAlign: "center" }} tip="Loading..."></Spin>
      ) : (
        <div></div>
      )} */}

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
                <br />
                <Button
                  type="primary"
                  style={{ marginTop: 5 }}
                  onClick={() => {
                    navigator.clipboard.writeText(
                      "Title: " +
                        item.title +
                        "\nAge: " +
                        item.age +
                        "\nNumber: " +
                        item.number +
                        "\nLink: " +
                        item.link +
                        "\n\n[Number found with Dalfins ScamFinder-Reddit https://rohukas.github.io/scamfinder/]"
                    );
                    message.info("Copied information to clipboard!");
                  }}
                >
                  Copy all information
                </Button>
                {/* <br /> */}
                {/* <Button
                  type="danger"
                  style={{ marginTop: 5 }}
                  onClick={() => {
                    window.open("https://reddit.com/report", "_blank");
                  }}
                >
                  Report in reddit
                </Button> */}
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
