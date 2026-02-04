const User = require("../model/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const handleUserSignup = async (req, res) => {
  if (req.body == undefined) {
    return res.status(400).json({
      status: false,
      message: "without details user cannot be created",
    });
  }

  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res
        .status(400)
        .json({ status: false, message: "provide all the input fields" });
    }
    const isUser = await User.findOne({ email });
    if (isUser) {
      return res
        .status(400)
        .json({ status: false, message: "User Already Exists" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    await User.insertOne({ name, email, password: hashedPassword });

    return res
      .status(201)
      .json({ status: true, message: "User Created Successfully" });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ status: false, message: "Server Side Error" });
  }
};

const handleUserLogin = async (req, res) => {
  if (req.body == undefined) {
    return res
      .status(400)
      .json({ status: false, message: "Details Required to Login" });
  }
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res
        .status(400)
        .json({ status: false, message: "All Input Fields are Required" });
    }
    const isUser = await User.findOne({ email });
    if (!isUser) {
      return res.status(400).json({
        status: false,
        message: "Email Not Found ",
      });
    }
    const isMatched = await bcrypt.compare(password, isUser.password);
    if (!isMatched) {
      return res
        .status(400)
        .json({ status: false, message: "Invalid Password" });
    }
    let payload = { _id: isUser._id, email };
    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });
    return res
      .status(200)
      .json({ status: true, message: "Login Successfull", token });
  } catch (error) {
    return res
      .status(500)
      .json({ status: false, message: "Server Side Error" });
  }
};

const getUserInfo = async (req, res) => {
  const { _id } = req.payload;
  try {
    const user = await User.findById({ _id }, { password: 0 });
    return res.status(200).json({ status: true, user });
  } catch (error) {
    return res
      .status(500)
      .json({ status: false, message: "Server Side Error" });
  }
};

const handleUserUpdateName = async (req, res) => {
  const { _id } = req.payload;
  if (req.body == undefined) {
    return res.status(400).json({
      status: false,
      message: "To Update Name We need Your Details",
    });
  }
  try {
    const { name } = req.body;
    if (!name) {
      return res
        .status(400)
        .json({ status: false, message: "All Fields are Required" });
    }
    await User.findByIdAndUpdate({ _id }, { $set: { name: name } });

    return res
      .status(200)
      .json({ status: true, message: "Name Updated Successfully" });
  } catch (error) {
    return res
      .status(500)
      .json({ status: false, message: "Server Side Error" });
  }
};

const handleUserUpdatePassword = async (req, res) => {
  const { _id } = req.payload;
  if (req.body == undefined) {
    return res.status(400).json({
      status: false,
      message: "To Update Password We Need Your Details",
    });
  }
  try {
    const { password, newPassword } = req.body;
    if (!password || !newPassword) {
      return res
        .status(400)
        .json({ status: false, message: "All Fields are Required" });
    }
    const user = await User.findById({ _id });
    const isMatched = await bcrypt.compare(password, user.password);
    if (!isMatched) {
      return res.status(400).json({
        status: false,
        message: "Sorry Your Current Password is Not Matching",
      });
    }
    if (password == newPassword) {
      return res.status(400).json({
        status: false,
        message: "Old and New Password Cannot be Same ",
      });
    }
    const hashedPass = await bcrypt.hash(newPassword, 10);
    user.password = hashedPass;
    await user.save();
    return res
      .status(200)
      .json({ status: true, message: "Password Updated Successfully" });
  } catch (error) {
    return res
      .status(500)
      .json({ status: false, message: "Server Side Error" });
  }
};
module.exports = {
  handleUserSignup,
  handleUserLogin,
  getUserInfo,
  handleUserUpdateName,
  handleUserUpdatePassword,
};
