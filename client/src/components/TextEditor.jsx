import React, { useState, useEffect, useRef, useCallback } from "react";
import Quill from "quill";
import { io } from "socket.io-client";
import "quill/dist/quill.snow.css";
import toolbarOptions from "../ToolbarOptions";
import { useParams } from "react-router-dom";
import sanitizeHtml from "sanitize-html";
import SendToEmail from "./SendToEmail";
import { Link, useNavigate } from "react-router-dom";
import EmailPreview from "./EmailPreview";

//https://github.com/mars/heroku-cra-node.git <- full stack hosting

//maybe add whatsapp and messenger link sharing, for collaboration
const TextEditor = () => {
  const [shareSocketData, setShareSocketData] = useState();
  const [shareQuillData, setShareQuillData] = useState();
  const [quillContents, setQuillContents] = useState();
  const { id } = useParams();

  /*without useEffect cleanup, I get new Quill inst. with every rerender. Used useCallback to set
  wrapper variable instead, otherwise first render crashes app, because (I think) the useEffect ran and
  evaluated the ref in div "container" before it was instantiated*/
  const wrapper = useCallback((wrapper) => {
    console.log("use call back ran");
    if (wrapper === null) return; //wrapper is null at first at every rerender, so without this app crashes
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

  useEffect(() => {
    localStorage.setItem("previousRoomURL", id);
  }, [id]);

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

      console.log(shareQuillData.getContents().ops[0].insert);
      console.log(quillContents);

      shareSocketData.emit("send-change", cleanedInput);
    };
    //"text-change" = Quill.js event - updates when the contents of Quill change
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
    console.log(detectChange());

    return () => {
      shareSocketData.off("receive-change", detectChange);
    };
  }, [shareSocketData, shareQuillData]);

  useEffect(() => {
    if (shareSocketData == null || shareQuillData == null) return;

    const saveToDB = setInterval(() => {
      shareSocketData.emit("save-doc", shareQuillData.getContents());
      setQuillContents(shareQuillData.getContents());
    }, 1000);

    return () => clearInterval(saveToDB);
  }, [shareSocketData, shareQuillData]);

  return (
    //setting the new Quill in this div so I can "clean" it at every rerender (otherwise multiple Quill instances
    //on page), and referencing it to gain access to the div in the useCallback
    <div>
      <div className="container" ref={wrapper}></div>
    </div>
  );
};

export default TextEditor;
