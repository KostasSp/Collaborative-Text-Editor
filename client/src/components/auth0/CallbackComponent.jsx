import React from "react";

/*this temp path (/CallbackComponent) is allowed in the Auth0 callback URI. It then navigates to the 
previous room*/
const CallbackComponent = () => {
  const prevURI = localStorage.getItem("previousRoomURL");
  return <div>{console.log(prevURI)}</div>;
};

export default CallbackComponent;
