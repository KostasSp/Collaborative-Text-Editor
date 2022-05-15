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

// chalk version 4.1.0 (not higher) required
if (!io.connected) console.log(chalk.red("connecting..."));

io.on("connection", (socket) => {
  socket.on("get-instance", async (id) => {
    console.log(date);
    const doc = await getOrCreateDocument(id);
    socket.join(id);
    socket.emit("load-instance", doc.data);
    console.log(doc.data);

    socket.on("send-change", (delta) => {
      // console.log(delta);
      socket.broadcast.to(id).emit("receive-change", delta);
    });

    socket.on("save-doc", async (data) => {
      /*The if statements below prevent unnecessary server updating when text editor contents are the same as the
      contents of document's that was fetched on load (i.e., the object saved on the database, under the same id)*/
      if (data.ops[0].insert == null) return;
      if (doc.data.ops != null)
        if (doc.data.ops[0].insert == data.ops[0].insert) return;
      console.log("true");
      let clean = sanitizeHtml(data.ops[0].insert);
      data.ops[0].insert = clean;
      await mongoSchema.findByIdAndUpdate(id, { data: data });
    });

    console.log(chalk.bold.greenBright("connected"));
  });
});

const getOrCreateDocument = async (id) => {
  if (id == null) return;
  const document = await mongoSchema.findById(id); //error was here, needed to await findById operation
  if (document) return document;
  return await mongoSchema.create({ _id: id, data: "" });
};
