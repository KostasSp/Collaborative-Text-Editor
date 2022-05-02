import React from "react";
import { Link, useNavigate } from "react-router-dom";
import EmailPreview from "./EmailPreview";

const SendToEmail = (props) => {
  //this should navigate to its own path, and add message "login to automatically fill out email address",
  //also show preview of what would be sent (format it for email viewing first)
  return (
    <div>
      <Link className="email-link" to="/email">
        Send progress to Email {/*  add download option as well here? */}
      </Link>

      {typeof props.quillContents !== "undefined" &&
        console.log(props.quillContents)}
    </div>
  );
};

export default SendToEmail;
