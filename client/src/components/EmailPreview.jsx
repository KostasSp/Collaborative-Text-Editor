import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { io } from "socket.io-client";

const EmailPreview = (props) => {
  const { state } = useLocation();
  const [socketIP, setSocketIP] = useState();
  const [contents, setContents] = useState();
  const id = localStorage.getItem("previousRoomURL");

  useEffect(() => {
    // const socket = io("http://192.168.1.3:5001"); <- needs ssl to use Auth0, maybe there's some library
    const socket = io("http://localhost:5001");
    setSocketIP(socket);
    //"Some side-effects need cleanup: close a socket, clear timers." https://dmitripavlutin.com/react-useeffect-explanation/#3-component-lifecycle
    return () => socket.disconnect;
  }, []);

  useEffect(() => {
    if (socketIP == null) return;

    socketIP.once("load-instance", (instance) => {
      setContents(instance);
      console.log(instance);
    });

    // shareSocketData.emit("get-instance", id);
  }, [socketIP, id]);

  return (
    <div>
      {/* {props.show.ops[0].insert}!! */}
      {console.log(contents)}
      {typeof props.show !== "undefined" && props.show.ops[0].insert}
      <div
        style={{ marginTop: "15px", display: "flex", justifyContent: "center" }}
      >
        {console.log(props.show)}
        {state}
        {props.aseME}
      </div>
    </div>
  );
};

export default EmailPreview;
