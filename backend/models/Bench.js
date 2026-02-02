const mongoose = require("mongoose");

const BenchSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    courts: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Court",
        required: true,
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Bench", BenchSchema);
