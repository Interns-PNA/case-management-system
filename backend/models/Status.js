const mongoose = require("mongoose");

const statusSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    unique: true,
  },
});

module.exports = mongoose.model("Status", statusSchema);
