import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import EmailPreview from "./EmailPreview";

const SendToEmail = (props) => {
  //this should navigate to its own path, and add message "login to automatically fill out email address",
  //also show preview of what would be sent (format it for email viewing first)
  const [data, setData] = useState("");

  return (
    <div className="send-email-button">
      {/* <EmailPreview show={props.quillCurrentContent} aseME={"lol"} /> */}
      <button
        onClick={() =>
          typeof props.quillCurrentContent === "undefined" &&
          // `${props.quillContents.ops[0].insert}`}
          console.log("hey hey hey")
        }
      >
        Send
      </button>
    </div>
  );
};

export default SendToEmail;
