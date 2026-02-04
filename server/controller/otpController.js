const Otp = require("../model/otpModel");
const User = require("../model/userModel");
const sendMail = require("../utils/nodemailer");
const bcrypt = require("bcrypt");

// Generate 4-digit OTP
function randomOtp() {
  return Math.floor(1000 + Math.random() * 9000).toString();
}

// Create OTP and send email
const generateOtp = async (req, res) => {
  const { email } = req.body;
  if (!email)
    return res
      .status(400)
      .json({ status: false, message: "We need Your Email to Send An OTP" });

  try {
    const isUser = await User.findOne({ email });
    if (!isUser)
      return res.status(400).json({
        message: "Email Provided Doesn't Match with Registered Email",
      });

    const otp = randomOtp();

    // Delete any previous OTP for this email
    await Otp.findOneAndDelete({ email });

    // Send OTP email
    try {
      await sendMail(email, otp);
    } catch (err) {
      console.error("Failed to Send OTP:", err);
      return res.status(500).json({ message: "Failed to Send OTP" });
    }

    // Save OTP with timestamp
    await Otp.create({ email, otp, createdAt: Date.now() });

    return res.status(200).json({ message: "OTP has been Sent To Your Email" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server Side Error" });
  }
};

// Verify OTP
const handleVerifyOtp = async (req, res) => {
  const { otp, email } = req.body;
  if (!otp || !email)
    return res.status(400).json({
      status: false,
      message:
        "Enter the OTP Sent to your Email...! If Not In Inbox Check In Spam folder",
    });

  try {
    const otpRecord = await Otp.findOne({ email });
    if (!otpRecord)
      return res.status(400).json({ status: false, message: "Invalid email" });

    // Check OTP expiry (10 minutes)
    const isExpired = Date.now() - otpRecord.createdAt > 10 * 60 * 1000;
    if (isExpired)
      return res
        .status(400)
        .json({ status: false, message: "OTP has been Expired" });

    if (otpRecord.otp.toString() !== otp.toString())
      return res.status(400).json({ status: false, message: "Invalid OTP" });

    // OTP verified, delete it after success
    await Otp.findOneAndDelete({ email });

    return res
      .status(200)
      .json({ message: "OTP verified. Now you can reset password" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server side error" });
  }
};

// Change password
const handleChangePassword = async (req, res) => {
  const { password, email } = req.body;
  if (!password || !email)
    return res
      .status(400)
      .json({ status: false, message: "Enter All Input Fields " });

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid email" });

    const hashedPassword = await bcrypt.hash(password, 10);
    user.password = hashedPassword;
    await user.save();

    return res.status(200).json({ message: "Password updated successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server side error" });
  }
};

module.exports = { generateOtp, handleVerifyOtp, handleChangePassword };
