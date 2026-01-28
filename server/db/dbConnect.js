const mongoose = require("mongoose");
// done evrything test changes
const connetDb = async () => {
  try {
    await mongoose.connect(process.env.DB_URL);
    console.log("db connected successfully");
  } catch (error) {
    console.log("db NOT connected.....");
  }
};

module.exports = connetDb;
