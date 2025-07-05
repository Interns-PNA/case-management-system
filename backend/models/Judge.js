const mongoose = require('mongoose');

const judgeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  court: { type: mongoose.Schema.Types.ObjectId, ref: 'Court', required: true },
  location: { type: mongoose.Schema.Types.ObjectId, ref: 'Location', required: true },
});

module.exports = mongoose.model('Judge', judgeSchema);
