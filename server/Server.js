const chalk = require("chalk");
const mongoose = require("mongoose");
const mongoSchema = require("./MongoSchema");
const date = require("./DateFormat");

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

    socket.on("send-change", (delta) => {
      console.log(delta);
      socket.broadcast.to(id).emit("receive-change", delta);
    });
    socket.on("save-doc", async (data) => {
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
