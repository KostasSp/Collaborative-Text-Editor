const chalk = require("chalk");
const mongoose = require("mongoose");
const mongoSchema = require("./MongoSchema");

mongoose.connect("mongodb://localhost/text-editor");

const io = require("socket.io")(5001, {
  cors: {
    origin: "http://192.168.1.3:3001",
    methods: ["GET", "POST"],
  },
});

if (!io.connected) console.log(chalk.red("connecting..."));

io.on("connection", (socket) => {
  socket.on("get-instance", async (id) => {
    const doc = await getOrCreateDocument(id);
    socket.join(id);
    socket.emit("load-instance", doc.data);

    socket.on("send-change", (delta) => {
      socket.broadcast.to(id).emit("receive-change", delta);
    });
    socket.on("save-doc", async (data) => {
      await mongoSchema.findByIdAndUpdate(id, { data: data });
    });
    //   socket.disconnect();
    console.log(chalk.bold.greenBright("connected"));
  });
});

const getOrCreateDocument = async (id) => {
  if (id == null) return;

  const document = await mongoSchema.findById(id); //error was here, needed to await findById operation
  if (document) return document;
  return await mongoSchema.create({ _id: id, data: "" });
};
