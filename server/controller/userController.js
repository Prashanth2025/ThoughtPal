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
        .json({ status: false, message: "with this email user alredy exist" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    await User.insertOne({ name, email, password: hashedPassword });

    return res
      .status(201)
      .json({ status: true, message: "user created successfully" });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ status: false, message: "server side error" });
  }
};

const handleUserLogin = async (req, res) => {
  if (req.body == undefined) {
    return res
      .status(400)
      .json({ status: false, message: "without details user cannot be login" });
  }
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res
        .status(400)
        .json({ status: false, message: "provide all the input fields" });
    }
    const isUser = await User.findOne({ email });
    if (!isUser) {
      return res.status(400).json({
        status: false,
        message: "with this email user does not exist",
      });
    }
    const isMatched = await bcrypt.compare(password, isUser.password);
    if (!isMatched) {
      return res
        .status(400)
        .json({ status: false, message: "invalid password" });
    }
    let payload = { _id: isUser._id, email };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "1d" });
    return res
      .status(200)
      .json({ status: true, message: "Login SUccessfull", token });
  } catch (error) {
    return res
      .status(500)
      .json({ status: false, message: "server side error" });
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
      .json({ status: false, message: "server side error" });
  }
};

const handleUserUpdateName = async (req, res) => {
  const { _id } = req.payload;
  if (req.body == undefined) {
    return res.status(400).json({
      status: false,
      message: "without details user name cannot be update",
    });
  }
  try {
    const { name } = req.body;
    if (!name) {
      return res
        .status(400)
        .json({ status: false, message: "provide all the input fields" });
    }
    await User.findByIdAndUpdate({ _id }, { $set: { name: name } });

    return res.status(200).json({ status: true, message: "user name updated" });
  } catch (error) {
    return res
      .status(500)
      .json({ status: false, message: "server side error" });
  }
};

const handleUserUpdatePassword = async (req, res) => {
  const { _id } = req.payload;
  if (req.body == undefined) {
    return res.status(400).json({
      status: false,
      message: "without details password cannot be update",
    });
  }
  try {
    const { password, newPassword } = req.body;
    if (!password || !newPassword) {
      return res
        .status(400)
        .json({ status: false, message: "provide all the input fields" });
    }
    const user = await User.findById({ _id });
    const isMatched = await bcrypt.compare(password, user.password);
    if (!isMatched) {
      return res
        .status(400)
        .json({ status: false, message: "current password is not matching" });
    }
    if (password == newPassword) {
      return res.status(400).json({
        status: false,
        message: "current password cannot be same as newpassword",
      });
    }
    const hashedPass = await bcrypt.hash(newPassword, 10);
    user.password = hashedPass;
    await user.save();
    return res.status(200).json({ status: true, message: "password updated" });
  } catch (error) {
    return res
      .status(500)
      .json({ status: false, message: "server side error" });
  }
};
module.exports = {
  handleUserSignup,
  handleUserLogin,
  getUserInfo,
  handleUserUpdateName,
  handleUserUpdatePassword,
};
