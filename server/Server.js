const io = require("socket.io")(3001, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  socket.on("get-instance", (id) => {
    const data = null;
    socket.join(id);
    socket.emit("load-instance", data);
  });
  socket.on("send-change", (delta) => {
    //broadcasting to all client instances
    socket.broadcast.emit("receive-change", delta);
  });
  //   socket.disconnect();
  console.log("connected");
});
