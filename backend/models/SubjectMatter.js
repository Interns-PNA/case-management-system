const mongoose = require("mongoose");

const subjectMatterSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  cases: {
    type: Number,
    default: 0,
  },
});

module.exports = mongoose.model("SubjectMatter", subjectMatterSchema);
