import axios from "axios";
import React, { useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const ForgetPassword = () => {
  const [email, setEmail] = useState("");
  const [isVerifyOtp, setIsVerifyOtp] = useState(false);
  const [otp, setOtp] = useState("");
  const [isResetPassword, setIsResetPassword] = useState(false);
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleGetOtp = async (e) => {
    e.preventDefault();
    if (!email) return toast.error("Provide email");

    try {
      const res = await axios.post("http://localhost:2000/api/v1/otp/create", {
        email,
      });
      toast.success(res.data.message);
      setIsVerifyOtp(true);
    } catch (error) {
      toast.error(error?.response?.data?.message);
    }
  };

  const handleSendOtp = async (e) => {
    e.preventDefault();
    if (!otp) return toast.error("Provide OTP");

    try {
      const res = await axios.post("http://localhost:2000/api/v1/otp/verify", {
        email,
        otp,
      });
      toast.success(res.data.message);
      setIsResetPassword(true);
      setIsVerifyOtp(false);
    } catch (error) {
      toast.error(error?.response?.data?.message);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (!password) return toast.error("Provide password");

    try {
      const res = await axios.post(
        "http://localhost:2000/api/v1/otp/password",
        { password, email },
      );
      toast.success(res.data.message);
      navigate("/login");
    } catch (error) {
      toast.error(error?.response?.data?.message);
    }
  };

  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4">🔑 Forget Password</h2>

      {!isVerifyOtp && !isResetPassword && (
        <form onSubmit={handleGetOtp} className="card p-4 shadow-sm">
          <div className="mb-3">
            <label className="form-label">Email</label>
            <input
              type="email"
              className="form-control"
              value={email}
              placeholder="Enter your email"
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <button type="submit" className="btn btn-primary w-100">
            Get OTP
          </button>
        </form>
      )}

      {isVerifyOtp && (
        <form onSubmit={handleSendOtp} className="card p-4 shadow-sm mt-3">
          <div className="mb-3">
            <label className="form-label">OTP</label>
            <input
              type="text"
              className="form-control"
              value={otp}
              placeholder="Enter OTP"
              onChange={(e) => setOtp(e.target.value)}
            />
          </div>
          <button type="submit" className="btn btn-success w-100">
            Verify OTP
          </button>
        </form>
      )}

      {isResetPassword && (
        <form
          onSubmit={handleChangePassword}
          className="card p-4 shadow-sm mt-3"
        >
          <div className="mb-3">
            <label className="form-label">New Password</label>
            <input
              type="password"
              className="form-control"
              value={password}
              placeholder="Enter new password"
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button type="submit" className="btn btn-warning w-100">
            Change Password
          </button>
        </form>
      )}
    </div>
  );
};

export default ForgetPassword;
