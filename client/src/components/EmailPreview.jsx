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
  const textLineLength = 70;
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
      console.log(instance);
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

  return (
    <div>
      <button onClick={() => navigate(-1)}>go back</button>
      {/*  add download option here? */}
      <div className="email-preview">
        <table>
          <thead>
            <tr>
              <th>Preview</th>
            </tr>
          </thead>
          <tbody>
            {typeof contents !== "undefined" &&
              formatText(contents.ops[0].insert)}
            {/* {typeof contents !== "undefined" && contents.ops[0].insert} */}
          </tbody>
        </table>
      </div>
      <SendToEmail />
    </div>
  );
};

export default EmailPreview;
