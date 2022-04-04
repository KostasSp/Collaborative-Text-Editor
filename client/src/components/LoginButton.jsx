import React from "react";
import { useAuth0, Auth0Provider } from "@auth0/auth0-react";
import { Button } from "@material-ui/core";

//need to get current room ID before log in and redirect there (will also probably need to change the fields
//on Auth0 site), otherwise it gets me to a new room after log in (and log out too, probably)
const LoginButton = () => {
  const roomID = localStorage.getItem("previousRoomURL");
  console.log(roomID);
  const { loginWithRedirect } = useAuth0({
    appState: { returnTo: roomID },
  });

  // const { handleRedirectCallback } = useAuth0();
  // const appState = handleRedirectCallback(loginWithRedirect.appState);

  // console.log(appState);
  // /* when user clicks one of the log buttons, then return to previous ID (keep track of ID before log
  // buttons pressed) */
  return <Button onClick={async () => await loginWithRedirect()}>Login</Button>;
};

export default LoginButton;
