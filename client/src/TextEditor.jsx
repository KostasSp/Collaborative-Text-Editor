import React, { useState, useEffect, useRef, useCallback } from "react";
import Quill from "quill";
import { io } from "socket.io-client";
import "quill/dist/quill.snow.css";
import toolbarOptions from "./ToolbarOptions";

//NEED to sanitise whatever gets stored here (opportunity to have concrete examples on how to do this)
//Also use this to keep track of notes in multiple files for IRP
const TextEditor = () => {
  const [shareSocket, setShareSocket] = useState();
  const [shareQuill, setShareQuill] = useState();

  useEffect(() => {
    const socket = io("http://localhost:3001");
    setShareSocket(socket);

    return () => socket.disconnect;
  }, []);

  //without useEffect cleanup, I get new Quill inst. with every rerender. However, used useCallback to set
  //wrapper variable instead, otherwise first render crashes app, because (I think) the useEffect ran and
  //evaluated the ref in div "container" before it was instantiated
  const wrapper = useCallback((wrapper) => {
    console.log(wrapper);
    if (wrapper === null) return; //wrapper is null at first at every rerender, so without this app crashes
    console.log("here");
    //no return() for useCallback, so have to empty the div JS-style
    wrapper.innerHTML = "";
    let editorDiv = document.createElement("div");
    wrapper.append(editorDiv);
    const quill = new Quill(editorDiv, {
      theme: "snow",
      modules: { toolbar: toolbarOptions },
    });
    setShareQuill(quill);
    console.log(quill);
  }, []);

  useEffect(() => {
    //I could also use double equals 'null' - strict equality 'null' breaks the app
    if (typeof shareSocket === "undefined" || typeof shareQuill === "undefined")
      return;

    const detectChange = (delta, oldDelta, source) => {
      if (source !== "user") return;
      shareSocket.emit("send-change", delta);
    };
    shareQuill.on("text-change", detectChange);

    return () => {
      shareQuill.off("text-change", detectChange);
    };
  }, [shareSocket, shareQuill]);

  useEffect(() => {
    //I could also use double equals 'null' - strict equality 'null' breaks the app
    if (typeof shareSocket === "undefined" || typeof shareQuill === "undefined")
      return;

    const detectChange = (delta) => {
      shareQuill.updateContents(delta);
    };
    shareSocket.on("receive-change", detectChange);

    return () => {
      shareSocket.off("receive-change", detectChange);
    };
  }, [shareSocket, shareQuill]);

  //setting the new Quill in this div so I can "clean" it at every rerender (otherwise multiple Quills
  //on page), and referencing it to gain access to the div in the useCallback
  return <div className="container" ref={wrapper}></div>;
};

export default TextEditor;
