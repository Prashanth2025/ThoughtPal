const express = require("express");
const {
  handleSignup,
  handlelogin,
  getUserInfo,
  handleNameUpdate,
  updateUserPassword,
  forgotPass,
  resetPass,
} = require("../controller/userController");
const verifyToken = require("../middleware/verifyToken");

const UserRouter = express.Router();

// Public routes
UserRouter.post("/signup", handleSignup);
UserRouter.post("/login", handlelogin);
UserRouter.post("/forgot-password", forgotPass);
UserRouter.post("/reset-password", resetPass);

// Protected routes
UserRouter.get("/me", verifyToken, getUserInfo);
UserRouter.patch("/name", verifyToken, handleNameUpdate);
UserRouter.patch("/password", verifyToken, updateUserPassword);

module.exports = UserRouter;
