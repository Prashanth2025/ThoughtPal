import React, { useState } from "react";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const ForgotPassword = () => {
  const [step, setStep] = useState("forgot");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  // Step 1: Request OTP
  const handleForgot = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(
        "https://thoughtpal-client.onrender.com/api/v1/user/forgot-password",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        }
      );
      const data = await res.json();
      if (res.ok) {
        toast.success(data.msg);
        setStep("reset");
      } else {
        toast.error(data.msg);
      }
    } catch (err) {
      toast.error("Error sending OTP: " + err.message);
    }
  };

  // Step 2: Reset password with OTP
  const handleReset = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(
        "https://thoughtpal-server.onrender.com/api/v1/user/reset-password",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, otp, newPassword }),
        }
      );
      const data = await res.json();
      if (res.ok) {
        toast.success(data.msg);
        setStep("done");
        setTimeout(() => navigate("/login"), 2000);
      } else {
        toast.error(data.msg);
      }
    } catch (err) {
      toast.error("Error resetting password: " + err.message);
    }
  };

  return (
    <div className="container d-flex justify-content-center align-items-center vh-100">
      <div
        className="card shadow p-4"
        style={{ maxWidth: "400px", width: "100%" }}
      >
        {step === "forgot" && (
          <>
            <h4 className="text-center mb-3">Forgot Password?</h4>
            <p className="text-muted text-center">
              Enter your email to receive an OTP
            </p>
            <form onSubmit={handleForgot}>
              <div className="mb-3">
                <label className="form-label">Email address</label>
                <input
                  type="email"
                  className="form-control"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <button type="submit" className="btn btn-primary w-100">
                Send OTP
              </button>
            </form>
          </>
        )}

        {step === "reset" && (
          <>
            <h4 className="text-center mb-3">Reset Password</h4>
            <p className="text-muted text-center">
              Enter the OTP sent to your email
            </p>
            <form onSubmit={handleReset}>
              <div className="mb-3">
                <label className="form-label">OTP Code</label>
                <input
                  type="text"
                  className="form-control"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  required
                />
              </div>
              <div className="mb-3">
                <label className="form-label">New Password</label>
                <div className="input-group">
                  <input
                    type={showPassword ? "text" : "password"}
                    className="form-control"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    className="input-group-text"
                    aria-label="Toggle password visibility"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <i className="bi bi-eye-slash"></i>
                    ) : (
                      <i className="bi bi-eye"></i>
                    )}
                  </button>
                </div>
              </div>
              <button type="submit" className="btn btn-success w-100">
                Reset Password
              </button>
            </form>
          </>
        )}

        {step === "done" && (
          <div className="text-center">
            <h4>Password Reset Successful 🎉</h4>
            <p>You’ll be redirected to login shortly...</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;
