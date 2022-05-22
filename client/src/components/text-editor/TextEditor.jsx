import "./TextEditor.styles.scss";
import React, { useState, useEffect, useCallback } from "react";
import Quill from "quill";
import { io } from "socket.io-client";
import "quill/dist/quill.snow.css";
import toolbarOptions from "../../utility/ToolbarOptions";
import { useParams } from "react-router-dom";
import _ from "underscore";

//https://github.com/mars/heroku-cra-node.git <- full stack hosting

const TextEditor = () => {
  const [socket, setSocket] = useState();
  const [shareQuillData, setShareQuillData] = useState();
  const { id } = useParams();

  //saves the current instance's (room) ID, so user can be redirected to the same one after leaving the page
  useEffect(() => {
    localStorage.setItem("previousRoomURL", id);
  }, [id]);

  //saves the server's IP address and clears previous connection, to prevent multiple ones being open
  useEffect(() => {
    // const socket = io("http://192.168.1.3:5001"); <- needs ssl to use Auth0, maybe there's some library
    const serverSocket = io("https://text-editor-finished.herokuapp.com/");
    setSocket(serverSocket);

    //"Some side-effects need cleanup: close a socket, clear timers."
    return () => serverSocket.disconnect;
  }, []);

  /*gets any existing text attributed to that room ID from the server. Here, "instance" is the object Quill.js's 
  text editor uses to save and update text*/
  useEffect(() => {
    if (socket == null || shareQuillData == null) return;
    socket.once("load-instance", (instance) => {
      if (typeof instance.ops !== "undefined") {
        let convert = _.unescape(instance.ops[0].insert);
        instance.ops[0].insert = convert;
      }
      shareQuillData.setContents(instance);
      shareQuillData.enable();
    });

    socket.emit("get-instance", id);
  }, [shareQuillData, socket, id]);

  useEffect(() => {
    if (socket == null || shareQuillData == null) return;
    const detectChange = (delta, oldDelta, source) => {
      console.log(delta);
      //Quill.js docs - change may also be from source 'api', so I'm accepting changes from 'user' only
      if (source === "api") return;
      socket.emit("send-change", delta);
    };
    //"text-change" = Quill.js event - updates when the text editor's contents change
    shareQuillData.on("text-change", detectChange);

    return () => {
      shareQuillData.off("text-change", detectChange);
    };
  }, [socket, shareQuillData]);

  useEffect(() => {
    if (socket == null || shareQuillData == null) return;
    let convert;
    const detectChange = (delta) => {
      let receivedData = delta;
      if (typeof receivedData.ops[1] !== "undefined") {
        if (typeof receivedData.ops[1].insert !== "undefined")
          convert = _.unescape(receivedData.ops[1].insert);
        receivedData.ops[1].insert = convert;
      }
      shareQuillData.updateContents(receivedData);
    };
    socket.on("receive-change", detectChange);

    return () => {
      socket.off("receive-change", detectChange);
    };
  }, [socket, shareQuillData]);

  //sends all changes to server every second, which in turns saves it to mongoDB
  useEffect(() => {
    if (socket == null || shareQuillData == null) return;
    const saveToDB = setInterval(() => {
      socket.emit("save-doc", shareQuillData.getContents());
    }, 1000);

    return () => clearInterval(saveToDB);
  }, [socket, shareQuillData]);

  /*without cleanup, I get a new text editor instance with every rerender. Used useCallback to set
  wrapper variable instead of useEffect, otherwise I get "undefined" error, because the 
  useEffect ran and evaluated the ref "wrapper" in the div "container" before it would be defined*/
  const wrapper = useCallback((wrapper) => {
    if (wrapper == null) return;
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

  return (
    /* setting the new Quill in this div so I can "clean" it at every rerender (otherwise I get multiple 
      Quill instances on page), and referencing it to gain access to the div in the useCallback */
    <>
      <div className="container" ref={wrapper}></div>
    </>
  );
};

export default TextEditor;
