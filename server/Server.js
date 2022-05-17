const chalk = require("chalk");
const mongoose = require("mongoose");
const mongoSchema = require("./MongoSchema");
const date = require("../client/src/utility/DateFormat");
const sanitizeHtml = require("sanitize-html");
const _ = require("underscore");

mongoose.connect("mongodb://localhost/text-editor");

const io = require("socket.io")(5001, {
  cors: {
    origin: "http://localhost:3000",
    // origin: "http://192.168.1.3:3000", <- needs ssl to use Auth0, maybe there's some library
    methods: ["GET", "POST"],
  },
});

//Quill.js is known to be vulnerable to XSS attacks - some extra security implemented below
const cleanIncomingData = (data) => {
  return sanitizeHtml(data);
};

// function testHtml(str) {
//   if (typeof str.ops[0] !== "undefined")
//     return str.ops[0].insert.replace(/</g, "&lt;").replace(/>/g, "&gt;");
// }

// chalk version 4.1.0 (not higher) required
if (!io.connected) console.log(chalk.red("connecting..."));

//
io.on("connection", (socket) => {
  socket.on("get-instance", async (id) => {
    const doc = await getOrCreateDocument(id);
    console.log(date);
    socket.join(id);
    socket.emit("load-instance", doc.data);

    socket.on("send-change", (delta) => {
      // console.log(delta.ops[1].insert);
      // // if (typeof delta.ops !== "undefined")
      // let clean = cleanIncomingData(delta.ops[1].insert);
      // delta.ops[1].insert = clean;
      // console.log(delta.ops[1].insert);
      let clean;
      let receivedData = delta;
      if (typeof receivedData.ops[1] !== "undefined") {
        if (typeof receivedData.ops[1].insert !== "undefined")
          clean = cleanIncomingData(receivedData.ops[1].insert);
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

//search for existing object with the passed ID in mongoDB, or create one if it doesn't already exist
const getOrCreateDocument = async (id) => {
  if (id == null) return;
  const document = await mongoSchema.findById(id); //error was here, needed to await findById operation
  if (document) return document;
  return await mongoSchema.create({ _id: id, data: "" });
};
