const mongoose = require("mongoose");

await mongoose.connect("mongodb://localhost/text-editor");

const io = require("socket.io")(3001, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  socket.on("get-instance", (id) => {
    const data = "why";
    socket.join(id);
    socket.emit("load-instance", data);

    socket.on("send-change", (delta) => {
      socket.broadcast.to(id).emit("receive-change", delta);
    });
  });
  //   socket.disconnect();
  console.log("connected");
});
