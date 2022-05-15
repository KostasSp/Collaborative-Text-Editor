import React, { useState, useEffect, useCallback } from "react";
import Quill from "quill";
import { io } from "socket.io-client";
import "quill/dist/quill.snow.css";
import toolbarOptions from "../../utility/ToolbarOptions";
import { useParams } from "react-router-dom";
import sanitizeHtml from "sanitize-html";
import _ from "underscore";

//https://github.com/mars/heroku-cra-node.git <- full stack hosting

const TextEditor = () => {
  const [shareSocketData, setShareSocketData] = useState();
  const [shareQuillData, setShareQuillData] = useState();
  const { id } = useParams();

  /*without useEffect cleanup, I get a new text editor instance with every rerender. Used useCallback to set
  wrapper variable instead, otherwise first render crashes the app, (I presume) because the useEffect ran and
  evaluated the ref in div "container" before it was instantiated*/
  const wrapper = useCallback((wrapper) => {
    if (wrapper === null) return;
    wrapper.innerHTML = ""; //no return() for useCallback - have to empty the div JS-style
    let editorDiv = document.createElement("div");
    wrapper.append(editorDiv);
    const quill = new Quill(editorDiv, {
      theme: "snow",
      modules: { toolbar: toolbarOptions },
    });
    quill.disable();
    quill.setText("Connecting to the server...");

    setShareQuillData(quill);
  }, []);

  //saves the current instance's (room) ID, so user can be redirected to the same one after leaving the page
  useEffect(() => {
    localStorage.setItem("previousRoomURL", id);
  }, [id]);

  //saves the server's IP address and clears previous connection, to prevent multiple ones being open
  useEffect(() => {
    // const socket = io("http://192.168.1.3:5001"); <- needs ssl to use Auth0, maybe there's some library
    const socket = io("http://localhost:5001");
    setShareSocketData(socket);

    //"Some side-effects need cleanup: close a socket, clear timers."
    return () => socket.disconnect;
  }, []);

  /*gets any existing text attributed to that room ID from the server. "instance" here is the object Quill.js's 
  text editor uses to save and update text*/
  useEffect(() => {
    if (shareSocketData == null || shareQuillData == null) return;
    shareSocketData.once("load-instance", (instance) => {
      if (typeof instance.ops !== "undefined") {
        let convert = _.unescape(instance.ops[0].insert);
        instance.ops[0].insert = convert;
      }
      shareQuillData.setContents(instance);

      shareQuillData.enable();
    });

    shareSocketData.emit("get-instance", id);
  }, [shareQuillData, shareSocketData, id]);

  useEffect(() => {
    if (shareSocketData == null || shareQuillData == null) return;
    const detectChange = (delta, oldDelta, source) => {
      //Quill.js docs - change may also be from source 'api', so I'm accepting changes from 'user' only
      if (source !== "user") return;
      //Quill.js is known to be vulnerable to XSS attacks - some extra security implemented below
      const dirtyInput = delta.ops[1].insert;
      const cleanedInput = {
        ops: [
          { retain: delta.ops[0].retain + 1 },
          { insert: sanitizeHtml(dirtyInput) },
        ],
      };
      shareSocketData.emit("send-change", cleanedInput);
    };
    //"text-change" = Quill.js event - updates when the text editor's contents change
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

  //sends all changes to server every second, which in turns saves it to mongoDB
  useEffect(() => {
    if (shareSocketData == null || shareQuillData == null) return;
    const saveToDB = setInterval(() => {
      shareSocketData.emit("save-doc", shareQuillData.getContents());
    }, 1000);

    return () => clearInterval(saveToDB);
  }, [shareSocketData, shareQuillData]);

  return (
    /* setting the new Quill in this div so I can "clean" it at every rerender (otherwise I get multiple 
      Quill instances on page), and referencing it to gain access to the div in the useCallback */
    <>
      <div className="container" ref={wrapper}></div>
    </>
  );
};

export default TextEditor;
