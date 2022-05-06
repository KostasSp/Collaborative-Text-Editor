import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import EmailPreview from "./EmailPreview";
import emailjs from "@emailjs/browser";

const SendToEmail = (props) => {
  //add message "login to automatically fill out email address (and name?)",
  //also show preview of what would be sent (format it for email viewing first)
  const PUBLIC_KEY = "hkQX5Spwrk9B5Z-O3"; //public key, no point hiding it in env
  const { REACT_APP_TEMPLATE_ID } = process.env;

  const sendEmail = (e) => {
    console.log(REACT_APP_TEMPLATE_ID);
    e.preventDefault();
    emailjs
      .sendForm(
        "default_service",
        `${REACT_APP_TEMPLATE_ID}`,
        e.target,
        PUBLIC_KEY
      )
      .then(
        (result) => {
          console.log(result.text);
        },
        (error) => {
          console.log(error.text);
        }
      );
    e.target.reset();
  };

  return (
    <div className="send-email-button">
      <div className="container">
        <form onSubmit={sendEmail}>
          <div className="row pt-5 mx-auto">
            <div className="col-8 form-group mx-auto">
              <input
                type="text"
                className="form-control"
                placeholder="Name"
                name="name"
              />
            </div>
            <div className="col-8 form-group pt-2 mx-auto">
              <input
                type="email"
                className="form-control"
                placeholder="Email Address"
                name="email"
                required
              />
            </div>
            <div className="col-8 form-group pt-2 mx-auto">
              <input
                type="text"
                className="form-control"
                placeholder="Subject"
                name="subject"
              />
            </div>
            <div className="col-8 form-group pt-2 mx-auto">
              <textarea
                className="form-control"
                id=""
                cols="40"
                rows="6"
                placeholder="Your message"
                name="message"
                value={props.text}
                required
              ></textarea>
            </div>
            <div className="col-8 pt-3 mx-auto">
              <input
                type="submit"
                className="btn btn-info"
                value="Send Message"
              ></input>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SendToEmail;
