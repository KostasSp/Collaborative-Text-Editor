import React from "react";
import { useAuth0, Auth0Provider } from "@auth0/auth0-react";

//need to get current room ID before log in and redirect there (will also probably need to change the fields
//on Auth0 site), otherwise it gets me to a new room after log in (and log out too, probably)
const LoginButton = () => {
  const roomID = localStorage.getItem("previousRoomURL");
  console.log(roomID);
  const { loginWithRedirect } = useAuth0({
    appState: { returnTo: roomID },
  });

  return (
    <button
      onClick={async () =>
        await loginWithRedirect({
          redirect_uri: `http://localhost:3000/documents/${roomID}`,
        })
      }
    >
      Log in
    </button>
  );
};

export default LoginButton;
