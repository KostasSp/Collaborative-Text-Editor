import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { io } from "socket.io-client";
import "./EmailPreview.scss";
import SendToEmail from "./SendToEmail";

//maybe make this preview look in email template
const EmailPreview = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const [socketIP, setSocketIP] = useState();
  const [contents, setContents] = useState();
  const textLineLength = 55;
  const id = localStorage.getItem("previousRoomURL");

  useEffect(() => {
    const socket = io("http://localhost:5001");
    setSocketIP(socket);

    return () => socket.disconnect;
  }, []);

  useEffect(() => {
    if (socketIP == null) return;

    socketIP.once("load-instance", (instance) => {
      setContents(instance);
    });

    socketIP.emit("get-instance", id);
  }, [socketIP, id]);

  const formatText = (text) => {
    let formattedText = text
      .split("")
      .reduce(
        (acc, iter, index) =>
          acc + iter + (index % textLineLength === 0 ? "\n" : ""),
        ""
      );
    return formattedText;
  };

  const checkUndefined = (object) => {
    let result;
    if (typeof object !== "undefined") {
      typeof object.ops[1] !== "undefined"
        ? (result =
            formatText(object.ops[0].insert) + formatText(object.ops[1].insert))
        : (result = formatText(object.ops[0].insert));

      return result;
    }
  };

  return (
    <div>
      <button className="button__arrow--left" onClick={() => navigate(-1)}>
        go back
      </button>
      {/*  add download option here? */}
      <div className="email-preview-box">
        <table>
          <thead>
            <tr>
              <th>Progress preview</th>
            </tr>
          </thead>
          <tbody>
            {/* {(typeof contents !== "undefined") &&
            formatText(contents.ops[0].insert) +
              typeof formatText(contents.ops[1].insert !== "undefined")
              ? formatText(contents.ops[1].insert !== "undefined")
              : ""} */}
            {checkUndefined(contents)}
            {console.log(contents)}
          </tbody>
        </table>
      </div>
      <SendToEmail text={checkUndefined(contents)} />
    </div>
  );
};

export default EmailPreview;
