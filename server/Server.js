require("dotenv").config();
const chalk = require("chalk");
const mongoose = require("mongoose");
const mongoSchema = require("./MongoSchema");
const sanitizeHtml = require("sanitize-html");
const _ = require("underscore");
const express = require("express");
const cors = require("cors");
const app = express();

const port = process.env.PORT || 5001;

const io = require("socket.io")(port, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST"],
  })
);

mongoose.connect(process.env.MONGO_URI || "mongodb://localhost/texteditor");
// chalk version 4.1.0 (not higher) required
if (!io.connected) console.log(chalk.red("connecting..."));

//
io.on("connection", (socket) => {
  socket.on("get-instance", async (id) => {
    const doc = await getOrCreateDocument(id);
    socket.join(id);
    socket.emit("load-instance", doc.data);

    socket.on("send-change", (delta) => {
      let clean;
      let receivedData = delta;
      //Quill.js is known to be vulnerable to XSS attacks - some extra security implemented below
      if (typeof receivedData.ops[1] !== "undefined") {
        if (typeof receivedData.ops[1].insert !== "undefined")
          clean = sanitizeHtml(receivedData.ops[1].insert);
        receivedData.ops[1].insert = clean;
      }
      socket.broadcast.to(id).emit("receive-change", receivedData);
    });

    socket.on("save-doc", async (data) => {
      /*The if statements below prevent unnecessary server updating when text editor contents are the same as the
      contents of document's that was fetched on load (i.e., the object saved on the database, under the same id)*/
      if (data.ops[0].insert == null) return;
      if (doc.data.ops != null)
        if (doc.data.ops[0].insert == data.ops[0].insert) return;
      await mongoSchema.findByIdAndUpdate(id, { data: data });
    });
    console.log(chalk.bold.greenBright("connected"));
  });
});

//search for existing document (object) with the passed ID in mongoDB, or create one if it doesn't already exist
const getOrCreateDocument = async (id) => {
  if (id == null) return;
  const document = await mongoSchema.findById(id);
  if (document) return document;
  return await mongoSchema.create({ _id: id, data: "" });
};
