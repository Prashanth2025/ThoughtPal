import axios from "axios";
import React, { useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import "bootstrap-icons/font/bootstrap-icons.css";

const API_URL = import.meta.env.VITE_BACKEND_URL;

const ForgetPassword = () => {
  const [email, setEmail] = useState("");
  const [isVerifyOtp, setIsVerifyOtp] = useState(false);
  const [otp, setOtp] = useState("");
  const [isResetPassword, setIsResetPassword] = useState(false);
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const Spinner = () => (
    <span className="spinner-border spinner-border-sm" role="status" />
  );

  /* ================= STEP 1 ================= */
  const handleGetOtp = async (e) => {
    e.preventDefault();
    if (!email) return toast.error("Please provide your email");

    try {
      setLoading(true);
      const res = await axios.post(`${API_URL}/api/v1/otp/create`, { email });

      toast.success(
        `${res.data.message} If you don't see it, check spam/junk folder.`,
      );
      setIsVerifyOtp(true);
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  /* ================= STEP 2 ================= */
  const handleSendOtp = async (e) => {
    e.preventDefault();
    if (!otp) return toast.error("Please provide OTP");

    try {
      setLoading(true);
      const res = await axios.post(`${API_URL}/api/v1/otp/verify`, {
        email,
        otp,
      });

      toast.success(res.data.message);
      setIsResetPassword(true);
      setIsVerifyOtp(false);
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to verify OTP");
    } finally {
      setLoading(false);
    }
  };

  /* ================= STEP 3 ================= */
  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (!password) return toast.error("Please provide new password");

    try {
      setLoading(true);
      const res = await axios.post(`${API_URL}/api/v1/otp/password`, {
        password,
        email,
      });

      toast.success(res.data.message);
      navigate("/login");
    } catch (error) {
      toast.error(
        error?.response?.data?.message || "Failed to change password",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-5" style={{ maxWidth: "460px" }}>
      {/* Header */}
      <div className="text-center mb-4">
        <h3 className="fw-bold mb-1">
          <i className="bi bi-shield-lock me-2 text-primary"></i>
          Reset Password
        </h3>
        <p className="text-muted small mb-0">
          Secure your account in 3 quick steps
        </p>
      </div>

      {/* Progress */}
      <div className="progress mb-4" style={{ height: "6px" }}>
        <div
          className="progress-bar"
          style={{
            width: isResetPassword ? "100%" : isVerifyOtp ? "66%" : "33%",
          }}
        />
      </div>

      {/* STEP 1 */}
      {!isVerifyOtp && !isResetPassword && (
        <form onSubmit={handleGetOtp} className="card border-0 shadow-sm p-4">
          <label className="form-label fw-semibold">Email address</label>
          <input
            type="email"
            className="form-control form-control-lg mb-3"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={loading}
          />

          <button
            type="submit"
            className="btn btn-primary btn-lg w-100 d-flex justify-content-center align-items-center gap-2"
            disabled={loading}
          >
            {loading && <Spinner />}
            Get OTP
          </button>
        </form>
      )}

      {/* STEP 2 */}
      {isVerifyOtp && (
        <form onSubmit={handleSendOtp} className="card border-0 shadow-sm p-4">
          <label className="form-label fw-semibold">Enter OTP</label>
          <input
            type="text"
            className="form-control form-control-lg mb-3 text-center fw-bold"
            placeholder="------"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            disabled={loading}
          />

          <button
            type="submit"
            className="btn btn-success btn-lg w-100 d-flex justify-content-center align-items-center gap-2"
            disabled={loading}
          >
            {loading && <Spinner />}
            Verify OTP
          </button>
        </form>
      )}

      {/* STEP 3 */}
      {isResetPassword && (
        <form
          onSubmit={handleChangePassword}
          className="card border-0 shadow-sm p-4"
        >
          <label className="form-label fw-semibold">New Password</label>
          <input
            type="password"
            className="form-control form-control-lg mb-3"
            placeholder="Enter new password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={loading}
          />

          <button
            type="submit"
            className="btn btn-warning btn-lg w-100 d-flex justify-content-center align-items-center gap-2"
            disabled={loading}
          >
            {loading && <Spinner />}
            Change Password
          </button>
        </form>
      )}
    </div>
  );
};

export default ForgetPassword;
