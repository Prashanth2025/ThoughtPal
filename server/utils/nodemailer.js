const sgMail = require("@sendgrid/mail");
require("dotenv").config();

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const sendMail = async (to, otp) => {
  try {
    const fromEmail = process.env.SENDGRID_FROM;
    if (!fromEmail) throw new Error("SENDGRID_FROM is not defined in .env");

    const msg = {
      to,
      from: {
        email: fromEmail.trim(),
        name: "ThoughtPal",
      },
      subject: "OTP Verification Code",
      text: `Your OTP is ${otp} & it is valid for 5 minutes.`,
      html: `<b>Your OTP is ${otp} & it is valid for 5 minutes.</b>`,
    };

    await sgMail.send(msg);

    // Return a user-friendly message for the client
    return {
      success: true,
      message:
        "OTP has been sent to your email. Please check your inbox or spam folder.",
    };
  } catch (error) {
    console.error("Email sending failed:");
    if (error.response) console.error(error.response.body);
    else console.error(error);

    return {
      success: false,
      message:
        "Failed to send OTP. Please try again or contact support if the problem persists.",
    };
  }
};

module.exports = sendMail;
