const nodemailer = require("nodemailer");
require("dotenv").config();

// Create a transporter using Ethereal test credentials.

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL,
    pass: process.env.EMAIL_PASSKEY,
  },
});

// Send an email using async/await
const sendMail = async (email, otp) => {
  const info = await transporter.sendMail({
    from: process.env.EMAIL,
    to: email,
    subject: "OTP VERIFICATION CODE",
    text: `YOUR OTP IS ${otp} & its valid for 5 min`, // Plain-text version of the message
    html: `<b>YOUR OTP IS ${otp} & its valid for 5 min</b>`, // HTML version of the message
  });

  console.log("Message sent:", info.messageId);
};

module.exports = sendMail;
