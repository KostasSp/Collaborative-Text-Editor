import React, { useState, useEffect, useRef, useCallback } from "react";
import Quill from "quill";
import { io } from "socket.io-client";
import "quill/dist/quill.snow.css";
import toolbarOptions from "../ToolbarOptions";
import { useParams } from "react-router-dom";
import sanitizeHtml from "sanitize-html";

//https://github.com/mars/heroku-cra-node.git <- full stack hosting

//NEED to sanitise whatever gets stored here (opportunity to have concrete examples on how to do this)
//Also use this to keep track of notes in multiple files for IRP
const TextEditor = () => {
  const [shareSocketData, setShareSocketData] = useState();
  const [shareQuillData, setShareQuillData] = useState();
  const { id } = useParams();

  /*without useEffect cleanup, I get new Quill inst. with every rerender. However, used useCallback to set
  wrapper variable instead, otherwise first render crashes app, because (I think) the useEffect ran and
  evaluated the ref in div "container" before it was instantiated*/
  const wrapper = useCallback((wrapper) => {
    console.log(wrapper);
    console.log("nhiii");
    if (wrapper === null) return; //wrapper is null at first at every rerender, so without this app crashes
    //no return() for useCallback, so have to empty the div JS-style
    wrapper.innerHTML = "";
    let editorDiv = document.createElement("div");
    wrapper.append(editorDiv);
    const quill = new Quill(editorDiv, {
      theme: "snow",
      modules: { toolbar: toolbarOptions },
    });
    quill.disable();
    quill.setText("Loading document...");

    setShareQuillData(quill);
  }, []);

  useEffect(() => {
    // const socket = io("http://192.168.1.3:5001"); <- needs ssl to use Auth0, maybe there's some library
    const socket = io("http://localhost:5001");
    setShareSocketData(socket);

    //"Some side-effects need cleanup: close a socket, clear timers." https://dmitripavlutin.com/react-useeffect-explanation/#3-component-lifecycle
    return () => socket.disconnect;
  }, []);

  useEffect(() => {
    if (shareSocketData == null || shareQuillData == null) return;

    shareSocketData.once("load-instance", (instance) => {
      const dirty = instance.ops[0].insert;
      const clean = { ops: [{ insert: sanitizeHtml(dirty) }] };
      shareQuillData.setContents(clean);
      shareQuillData.enable();
    });

    shareSocketData.emit("get-instance", id);
  }, [shareQuillData, shareSocketData, id]);

  useEffect(() => {
    console.log(shareSocketData);
    if (shareSocketData == null || shareQuillData == null) return;

    const detectChange = (delta, oldDelta, source) => {
      //Quill docs - change may also be from 'api', so accepting changes from 'user' only
      if (source !== "user") return;
      const dirty = delta.ops[1].insert;
      const clean = {
        ops: [
          { retain: delta.ops[0].retain + 1 },
          { insert: sanitizeHtml(dirty) },
        ],
      };
      console.log(oldDelta);
      console.log(delta.ops[1].insert);
      console.log(clean);
      shareSocketData.emit("send-change", clean);
    };
    //"text-change" = Quill event - updates when the contents of Quill change
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

  useEffect(() => {
    if (shareSocketData == null || shareQuillData == null) return;

    const saveToDB = setInterval(() => {
      shareSocketData.emit("save-doc", shareQuillData.getContents());
    }, 1000);

    return () => clearInterval(saveToDB);
  }, [shareSocketData, shareQuillData]);

  return (
    //setting the new Quill in this div so I can "clean" it at every rerender (otherwise multiple Quill instances
    //on page), and referencing it to gain access to the div in the useCallback
    <div className="container" ref={wrapper}>
      <div>Log in</div>
    </div>
  );
};

export default TextEditor;