const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const managerSchema = new Schema({
  username: {
    type: String,
  },
  password: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  lastModified: {
    type: Date,
    default: Date.now(),
  },
  description: {
    type: String,
  },
});

module.exports = mongoose.model("Manager", managerSchema);
