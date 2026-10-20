const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();

const connectDB = async () => {
  try {
    const uri = process.env.MONGO_URI || process.env.MongoURI;
    if (!uri) {
      throw new Error("MONGO_URI (or legacy MongoURI) is not set");
    }
    await mongoose.connect(uri);
    console.log("MongoDB Connected 🚀");
  } catch (err) {
    console.error("MongoDB Connection Failed ❌", err);
    process.exit(1);
  }
};

module.exports = connectDB;
