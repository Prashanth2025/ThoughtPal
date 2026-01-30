require("dotenv").config();
const express = require("express");
const connetDb = require("./db/dbConnect");
const userRouter = require("./route/userRouter");
const cors = require("cors");
const noteRouter = require("./route/noteRouter");
const otpRouter = require("./route/otpRouter");
const path = require("path");


const app = express();

app.use(cors());
//json middleware
app.use(express.json());
//db connection
connetDb();

app.use("/api/v1/user", userRouter);
app.use("/api/v1/note", noteRouter);
app.use("/api/v1/otp", otpRouter);


const clientPath=path.join(__dirname,"../client/dist")
app.use(express.static(clientPath))

app.use((req,res)=>{
  res.sendFile(path.join(clientPath,"index.html"))
})


app.listen(process.env.PORT, () => {
  console.log("server is running");
});
