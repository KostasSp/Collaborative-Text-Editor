const { model, Schema } = require("mongoose");

const mongoSchema = new Schema({
  _id: String,
  data: Object,
});

module.exports = model("mongo-schema", mongoSchema);
