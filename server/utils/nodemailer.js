const sgMail = require("@sendgrid/mail");
require("dotenv").config();

// Set API Key
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

// Send OTP Mail Function
const sendMail = async (to, otp) => {
  try {
    const fromEmail = process.env.SENDGRID_FROM;

    if (!fromEmail) {
      throw new Error("SENDGRID_FROM is not defined in .env");
    }

    const msg = {
      to,
      from: {
        email: fromEmail.trim(),
        name: "ThoughtPal",
      },
      subject: "OTP Verification - ThoughtPal",

      text: `
Hello,

We received a request to verify your identity for your ThoughtPal account.

Your One-Time Password (OTP) is:

${otp}

This OTP is valid for the next 5 minutes. Please enter this code to complete your verification process.

🔒 Security Notice:
- Do not share this OTP with anyone.
- ThoughtPal will never ask for your OTP via phone or email.
- If you did not request this, please ignore this message.

If you're having trouble, you can try requesting a new OTP.

Thank you,  
Team ThoughtPal
      `,
    };

    await sgMail.send(msg);

    return {
      success: true,
      message:
        "OTP has been sent successfully. Please check your inbox or spam folder.",
    };
  } catch (error) {
    console.error("Email sending failed:");

    if (error.response) {
      console.error(error.response.body);
    } else {
      console.error(error);
    }

    return {
      success: false,
      message: "Failed to send OTP. Please try again later or contact support.",
    };
  }
};

module.exports = sendMail;
