const express = require("express");
const {
  handleSignup,
  handleLogin,
  getUserInfo,
  handleNameUpdate,
  updateUserPassword,
  forgotPass,
  resetPass,
} = require("../controller/userController");
const verifyToken = require("../middleware/verifyToken");

const UserRouter = express.Router();

// Auth routes
UserRouter.post("/signup", handleSignup);
UserRouter.post("/login", handleLogin);

// Protected routes
UserRouter.get("/", verifyToken, getUserInfo);
UserRouter.patch("/name", verifyToken, handleNameUpdate);
UserRouter.patch("/password", verifyToken, updateUserPassword);

// Password reset routes
UserRouter.post("/forgot-password", forgotPass);
UserRouter.post("/reset-password", resetPass);

module.exports = UserRouter;
