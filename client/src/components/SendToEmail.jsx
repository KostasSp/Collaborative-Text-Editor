import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import EmailPreview from "./EmailPreview";

const SendToEmail = (props) => {
  //this should navigate to its own path, and add message "login to automatically fill out email address",
  //also show preview of what would be sent (format it for email viewing first)
  const [data, setData] = useState("");

  return (
    <div>
      <Link className="email-link" to={"/email"} state={"test"}>
        {/* {console.log(data)} */}
        Send progress to Email! {/*  add download option as well here? */}
      </Link>
      {/* <EmailPreview show={props.quillCurrentContent} aseME={"lol"} /> */}
      {props.test}
      <button
        onClick={() =>
          typeof props.quillCurrentContent === "undefined" &&
          // `${props.quillContents.ops[0].insert}`}
          console.log("hey hey hey")
        }
      >
        see preview
      </button>
      {/* {console.log(props.quillCurrentContent)} */}
      {/* {typeof props.quillContents !== "undefined" &&
        console.log(props.quillContents.ops[0].insert)} */}
      {/* <EmailPreview show={props.quillCurrentContent} aseME={"loooool"} /> */}
    </div>
  );
};

export default SendToEmail;
