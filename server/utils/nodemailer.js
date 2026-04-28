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
      subject: "Your OTP Code - ThoughtPal",
      text: `Your OTP is ${otp}. It is valid for 5 minutes.`,
      html: `
      <div style="font-family: Arial, sans-serif; background-color:#f4f4f4; padding:20px;">
        <div style="max-width:500px; margin:auto; background:white; border-radius:10px; overflow:hidden; box-shadow:0 4px 10px rgba(0,0,0,0.1);">
          
          <!-- Header -->
          <div style="background:#4f46e5; padding:20px; text-align:center; color:white;">
            <h2 style="margin:0;">ThoughtPal</h2>
          </div>

          <!-- Body -->
          <div style="padding:30px; text-align:center;">
            <h3 style="margin-bottom:10px;">OTP Verification</h3>
            <p style="color:#555; font-size:14px;">
              Use the OTP below to complete your verification process.
            </p>

            <!-- OTP Box -->
            <div style="margin:20px 0;">
              <span style="
                display:inline-block;
                padding:15px 25px;
                font-size:24px;
                letter-spacing:5px;
                background:#f1f5f9;
                border-radius:8px;
                font-weight:bold;
                color:#111;
              ">
                ${otp}
              </span>
            </div>

            <p style="color:#777; font-size:13px;">
              This OTP is valid for <b>5 minutes</b>.
            </p>
          </div>

          <!-- Footer -->
          <div style="background:#f9fafb; padding:15px; text-align:center; font-size:12px; color:#999;">
            If you didn’t request this, you can safely ignore this email.
          </div>

        </div>
      </div>
      `,
    };

    await sgMail.send(msg);

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
