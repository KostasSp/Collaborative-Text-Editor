import React from "react";

//navigates to this temp path that is allowed in Auth0 settings after login, which is then navigated to the previous room
const CallbackComponent = () => {
  const prevURI = localStorage.getItem("previousRoomURL");
  return <div>{console.log(prevURI)}</div>;
};

export default CallbackComponent;
