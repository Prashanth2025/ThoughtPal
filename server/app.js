let express = require("express");
const connectDB = require("./db/data");
let cors = require("cors");
let userRoute = require("./route/userRoute");
let PORT = process.env.PORT || 2026;
require("dotenv").config();

let app = express();

app.use(express.json());
connectDB();

app.use(
  cors({
    origin: ["http://localhost:5173", "https://thoughtpal-client.onrender.com"],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

app.use("/api/v1/user", userRoute);

app.listen(PORT, () => {
  console.log("server running at http://localhost:2026");
});
