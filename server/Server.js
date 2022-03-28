const chalk = require("chalk");
const mongoose = require("mongoose");
const mongoSchema = require("./MongoSchema");

mongoose.connect("mongodb://localhost/text-editor");

const io = require("socket.io")(3001, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

if (!io.connected) console.log(chalk.red("connecting..."));

io.on("connection", (socket) => {
  socket.on("get-instance", (id) => {
    const doc = getOrCreateDocument(id);
    socket.join(id);
    socket.emit("load-instance", doc.data);

    socket.on("send-change", (delta) => {
      socket.broadcast.to(id).emit("receive-change", delta);
    });
    socket.on("save-doc", (data) => {
      mongoSchema.findByIdAndUpdate(id, { data: data });
    });
    //   socket.disconnect();
    console.log(chalk.bold.greenBright("connected"));
  });
});

const getOrCreateDocument = async (id) => {
  if (id == null) return;

  const document = mongoSchema.findById(id);
  if (document) return document;
  return await mongoSchema.create({ _id: id, data: "test" });
};
