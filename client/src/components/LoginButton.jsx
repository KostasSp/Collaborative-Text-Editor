import React from "react";
import { useAuth0 } from "@auth0/auth0-react";

//need to get current room ID before log in and redirect there (will also probably need to change the fields
//on Auth0 site), otherwise it gets me to a new room after log in (and log out too, probably)
const LoginButton = () => {
  const { loginWithRedirect } = useAuth0();
  return <button onClick={() => loginWithRedirect()}>Log in</button>;
};

export default LoginButton;
