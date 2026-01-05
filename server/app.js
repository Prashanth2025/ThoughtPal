const express = require("express");
const connectDB = require("./db/data");
const cors = require("cors");
const userRoute = require("./route/userRoute");
require("dotenv").config();

const PORT = process.env.PORT || 2026;
const app = express();

// Middleware
app.use(
  cors({
    origin: "https://thoughtpal-client.onrender.com",
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    credentials: true,
  })
);
app.use(express.json());

// Routes
app.use("/api/v1/user", userRoute);

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ msg: "Something went wrong" });
});

// Start server only after DB connects
const startServer = async () => {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(`Server running at http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
};

startServer();
