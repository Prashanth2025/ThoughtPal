const express = require("express");
const {
  generateOtp,
  handleVerifyOtp,
  handleChangePassword,
} = require("../controller/otpController");

const otpRouter = express.Router();

otpRouter.post("/create", generateOtp);
otpRouter.post("/verify", handleVerifyOtp);
otpRouter.post("/password", handleChangePassword);

module.exports = otpRouter;
