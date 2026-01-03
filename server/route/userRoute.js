let express = require("express");

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

let UserRouter = express.Router();

UserRouter.post("/signup", handleSignup);
UserRouter.post("/login", handlelogin);
UserRouter.get("/", verifyToken, getUserInfo);
UserRouter.patch("/name", verifyToken, handleNameUpdate);
UserRouter.patch("/password", verifyToken, updateUserPassword);
UserRouter.post("/forgot-password", forgotPass);
UserRouter.post("/reset-password", resetPass);

module.exports = UserRouter;
