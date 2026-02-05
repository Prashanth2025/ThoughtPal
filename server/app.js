require("dotenv").config();
const express = require("express");
const connetDb = require("./db/dbConnect");
const userRouter = require("./route/userRouter");
const cors = require("cors");
const noteRouter = require("./route/noteRouter");
const otpRouter = require("./route/otpRouter");

const app = express();

const path = require("path");

app.use(express.static(path.join(__dirname, "client/build")));

app.get("/*", (req, res) => {
  res.sendFile(path.join(__dirname, "client/build", "index.html"));
});
app.use(cors());
//json middleware
app.use(express.json());
//db connection
connetDb();

app.use("/api/v1/user", userRouter);
app.use("/api/v1/note", noteRouter);
app.use("/api/v1/otp", otpRouter);

app.listen(process.env.PORT, () => {
  console.log("server is running");
});
