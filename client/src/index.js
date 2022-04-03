import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import { Auth0Provider } from "@auth0/auth0-react";

const domain = process.env.REACT_APP_AUTH0_DOMAIN;
const clientID = process.env.REACT_APP_AUTH0_CLIENT_ID;
const roomID = localStorage.getItem("previousRoomURL");

ReactDOM.render(
  <Auth0Provider
    domain={domain}
    clientId={clientID}
    redirectUri={"http://localhost:3000/CallbackComponent"}
  >
    {console.log(roomID)}
    <App />
  </Auth0Provider>,
  document.getElementById("root")
);
