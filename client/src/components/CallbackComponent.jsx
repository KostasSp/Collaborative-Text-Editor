import React from "react";

const CallbackComponent = () => {
  const prevURI = localStorage.getItem("previousRoomURL");
  return <div>{console.log(prevURI)}</div>;
};

export default CallbackComponent;
