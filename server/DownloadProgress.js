//maybe put this in server.js, and have whatever is in there in seperate
//routes of express
const express = require("express");
const app = express();
const PORT = 4000;

app.get("/", function (req, res) {
  res.download("Hello.txt");
});

app.listen(PORT, function (err) {
  if (err) console.log(err);
  console.log("Server listening on PORT", PORT);
});
