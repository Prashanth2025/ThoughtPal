const jwt = require("jsonwebtoken");
const User = require("../module/usermodel");
const bcrypt = require("bcryptjs");
const nodemailer = require("nodemailer");
const crypto = require("crypto");
require("dotenv").config();

// Signup
const handleSignup = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ msg: "All fields are required" });
    }

    const isUser = await User.findOne({ email });
    if (isUser) {
      return res.status(409).json({ msg: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ name, email, password: hashedPassword });
    await newUser.save();

    res.status(201).json({ msg: "User created successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Server error" });
  }
};

// Login
const handlelogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ msg: "All fields are required" });
    }

    const isUser = await User.findOne({ email });
    if (!isUser) {
      return res.status(404).json({ msg: "Email not found" });
    }

    const isMatched = await bcrypt.compare(password, isUser.password);
    if (!isMatched) {
      return res.status(401).json({ msg: "Invalid credentials" });
    }

    const token = jwt.sign({ _id: isUser._id, email: isUser.email }, "Mern", {
      expiresIn: "1h",
    });

    res.status(200).json({
      msg: "Login successful",
      token,
      user: {
        _id: isUser._id,
        name: isUser.name,
        email: isUser.email,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Server error" });
  }
};

// Get user info
const getUserInfo = async (req, res) => {
  const { _id } = req.payload;
  try {
    const user = await User.findById(_id).select("-password");
    res.status(200).json({ user });
  } catch (error) {
    res.status(500).json({ msg: "Server error" });
  }
};

// Update name
const handleNameUpdate = async (req, res) => {
  const { _id } = req.payload;
  try {
    const { name } = req.body;
    if (!name) {
      return res.status(400).json({ msg: "Name is required" });
    }

    await User.findByIdAndUpdate(_id, { $set: { name } });
    res.status(200).json({ msg: "Name updated successfully" });
  } catch (error) {
    res.status(500).json({ msg: "Server error" });
  }
};

// Update password (logged-in user)
const updateUserPassword = async (req, res) => {
  const { _id } = req.payload;
  const { oldPassword, newPassword, confirmPassword } = req.body;

  if (!oldPassword || !newPassword || !confirmPassword) {
    return res.status(400).json({ msg: "All fields are required" });
  }
  if (newPassword !== confirmPassword) {
    return res.status(400).json({ msg: "New passwords do not match" });
  }

  try {
    const user = await User.findById(_id);
    if (!user) return res.status(404).json({ msg: "User not found" });

    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch)
      return res.status(401).json({ msg: "Old password is incorrect" });

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await User.findByIdAndUpdate(_id, { password: hashedPassword });

    res.status(200).json({ msg: "Password updated successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Server error" });
  }
};

// Nodemailer transporter
let transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS, // must be App Password
  },
});

// Forgot Password → generate OTP
const forgotPass = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ msg: "User not found" });

    const otp = crypto.randomInt(100000, 999999).toString();
    user.otp = otp;
    user.otpExpiry = Date.now() + 5 * 60 * 1000; // 5 minutes
    await user.save();

    console.log("DEBUG: Generated OTP:", otp);
    console.log("DEBUG: Expiry set to:", user.otpExpiry);

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Your OTP Code",
      text: `Your OTP is ${otp}. It is valid for 5 minutes.`,
    });

    res.json({ msg: "OTP sent to email" });
  } catch (error) {
    console.error("ERROR in forgotPass:", error);
    res.status(500).json({ msg: "Server error" });
  }
};

// Reset Password → validate OTP
const resetPass = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;
    const user = await User.findOne({ email });

    // Debugging logs
    console.log("DEBUG: Email received:", email);
    console.log("DEBUG: OTP received:", otp);
    if (user) {
      console.log("DEBUG: Stored OTP:", user.otp);
      console.log("DEBUG: Stored Expiry:", user.otpExpiry);
      console.log("DEBUG: Current Time:", Date.now());
    }

    if (
      !user ||
      String(user.otp) !== String(otp) ||
      Date.now() > user.otpExpiry
    ) {
      console.warn("DEBUG: OTP validation failed");
      return res.status(400).json({ msg: "Invalid or expired OTP" });
    }

    user.password = await bcrypt.hash(newPassword, 10);
    user.otp = null;
    user.otpExpiry = null;
    await user.save();

    console.log("DEBUG: Password reset successful for:", email);

    res.json({ msg: "Password reset successful" });
  } catch (error) {
    console.error("ERROR in resetPass:", error);
    res.status(500).json({ msg: "Server error" });
  }
};

module.exports = {
  handleSignup,
  handlelogin,
  getUserInfo,
  handleNameUpdate,
  updateUserPassword,
  forgotPass,
  resetPass,
};
