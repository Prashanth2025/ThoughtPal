const Otp = require("../model/otpModel");
const User = require("../model/userModel");
const sendMail = require("../utils/nodemailer");
const bcrypt = require("bcrypt");

function randomOtp() {
  let otp = Math.trunc(Math.random() * 10000);
  if (otp < 1000) otp = otp + "0";
  return otp;
}

const generateOtp = async (req, res) => {
  const { email } = req.body;
  if (!email)
    return res.status(400).json({ status: false, message: "Provide email" });

  try {
    const isUser = await User.findOne({ email });
    if (!isUser) return res.status(400).json({ message: "Invalid email" });

    const otp = randomOtp();
    await sendMail(email, otp);
    await Otp.create({ email, otp });

    return res.status(200).json({ message: "OTP has been sent to your email" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server side error" });
  }
};

const handleVerifyOtp = async (req, res) => {
  const { otp, email } = req.body;
  if (!otp || !email)
    return res
      .status(400)
      .json({ status: false, message: "Provide input fields" });

  try {
    const isUser = await Otp.findOne({ email });
    if (!isUser)
      return res.status(400).json({ status: false, message: "Invalid email" });

    if (isUser.otp !== otp)
      return res.status(400).json({ status: false, message: "Wrong OTP" });

    return res.status(200).json({ message: "Now you can reset the password" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server side error" });
  }
};

const handleChangePassword = async (req, res) => {
  const { password, email } = req.body;
  if (!password || !email)
    return res
      .status(400)
      .json({ status: false, message: "Provide input fields" });

  try {
    const isUser = await User.findOne({ email });
    if (!isUser) return res.status(400).json({ message: "Invalid email" });

    const hashedPassword = await bcrypt.hash(password, 10);
    isUser.password = hashedPassword;
    await isUser.save();

    return res.status(200).json({ message: "Password updated successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server side error" });
  }
};

module.exports = { generateOtp, handleVerifyOtp, handleChangePassword };
