let mongoose = require("mongoose");

let connectDB = async () => {
  try {
    await mongoose.connect("mongodb://localhost:27017/merndb");
    console.log("db connected");
  } catch (error) {
    console.log("not connected");
  }
};

module.exports = connectDB;
