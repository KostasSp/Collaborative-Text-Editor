import React from "react";
import { useAuth0, Auth0Provider } from "@auth0/auth0-react";
import { Button } from "@material-ui/core";

const LoginButton = () => {
  const roomID = localStorage.getItem("previousRoomURL");
  console.log(roomID);
  const { user, isAuthenticated, loginWithRedirect } = useAuth0();

  return (
    <Button
      style={{ textTransform: "none" }}
      onClick={() => loginWithRedirect()}
    >
      {/* isAuthenticated is always false at the moment because the "Application Login URI" field on auth0 has 
      to be https, so it won't work with localhost. Maybe add the production URI once it's deployed */}
      {isAuthenticated && console.log(JSON.stringify(user))}
      Login
    </Button>
  );
};

export default LoginButton;
