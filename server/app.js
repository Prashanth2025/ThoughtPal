let express = require("express");
const connectDB = require("./db/data");
let cors = require("cors");
let userRoute = require("./route/userRoute");
require("dotenv").config();

let app = express();
app.use(cors());
app.use(express.json());
connectDB();

app.use("/api/v1/user", userRoute);

app.listen(2026, () => {
  console.log("server running at http://localhost:2026");
});
