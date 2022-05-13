import React from "react";
import { useAuth0, Auth0Provider } from "@auth0/auth0-react";
import { Button } from "@material-ui/core";

const LoginButton = () => {
  const roomID = localStorage.getItem("previousRoomURL");
  console.log(roomID);
  const { loginWithRedirect } = useAuth0({
    appState: { returnTo: roomID },
  });

  return (
    <Button
      style={{ textTransform: "none" }}
      onClick={async () => await loginWithRedirect()}
    >
      Login
    </Button>
  );
};

export default LoginButton;
