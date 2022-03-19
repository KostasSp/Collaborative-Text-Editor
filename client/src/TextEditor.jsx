import React, { useState, useEffect, useRef, useCallback } from "react";
import Quill from "quill";
import { io } from "socket.io-client";
import "quill/dist/quill.snow.css";
import toolbarOptions from "./ToolbarOptions";

//NEED to sanitise whatever gets stored here (opportunity to have concrete examples on how to do this)
//Also use this to keep track of notes in multiple files for IRP
const TextEditor = () => {
  const [shareSocketData, setShareSocketData] = useState();
  const [shareQuillData, setShareQuillData] = useState();

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
    setShareQuillData(quill);
    console.log(quill);
  }, []);

  useEffect(() => {
    const socket = io("http://localhost:3001");
    setShareSocketData(socket);

    return () => socket.disconnect;
  }, []);

  useEffect(() => {
    console.log(shareSocketData);
    if (shareSocketData == null || shareQuillData == null) return;

    const detectChange = (delta, oldDelta, source) => {
      //Quill doc - change may be from 'api', so accepting changes from 'user' only
      if (source !== "user") return;
      shareSocketData.emit("send-change", delta);
    };
    //"text-change" = Quill event - updates when the contents of Quill have changed
    shareQuillData.on("text-change", detectChange);

    return () => {
      shareQuillData.off("text-change", detectChange);
    };
  }, [shareSocketData, shareQuillData]);

  useEffect(() => {
    if (shareSocketData == null || shareQuillData == null) return;

    const detectChange = (delta) => {
      shareQuillData.updateContents(delta);
    };
    shareSocketData.on("receive-change", detectChange);

    return () => {
      shareSocketData.off("receive-change", detectChange);
    };
  }, [shareSocketData, shareQuillData]);

  //setting the new Quill in this div so I can "clean" it at every rerender (otherwise multiple Quills
  //on page), and referencing it to gain access to the div in the useCallback
  return <div className="container" ref={wrapper}></div>;
};

export default TextEditor;
