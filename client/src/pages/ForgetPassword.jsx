import axios from "axios";
import React, { useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const API_URL = import.meta.env.VITE_BACKEND_URL;

const ForgetPassword = () => {
  const [email, setEmail] = useState("");
  const [isVerifyOtp, setIsVerifyOtp] = useState(false);
  const [otp, setOtp] = useState("");
  const [isResetPassword, setIsResetPassword] = useState(false);
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleGetOtp = async (e) => {
    e.preventDefault();
    if (!email) return toast.error("Please provide your email");

    try {
      setLoading(true);
      const res = await axios.post(`${API_URL}/api/v1/otp/create`, { email });
      toast.success(`${res.data.message} Check spam/junk folder if needed.`);
      setIsVerifyOtp(true);
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

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
    <div className="forget-container">
      <h2 className="text-center mb-4">🔑 Forget Password</h2>

      {/* STEP 1 */}
      {!isVerifyOtp && !isResetPassword && (
        <form onSubmit={handleGetOtp} className="card p-4 shadow-sm form-card">
          <input
            type="email"
            className="form-control mb-3"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={loading}
            aria-label="Email"
          />
          <button
            type="submit"
            className="btn btn-primary w-100 d-flex justify-content-center"
            disabled={loading}
          >
            {loading ? <span className="rotate-loader"></span> : "Get OTP"}
          </button>
        </form>
      )}

      {/* STEP 2 */}
      {isVerifyOtp && (
        <form
          onSubmit={handleSendOtp}
          className="card p-4 shadow-sm form-card mt-3"
        >
          <input
            type="text"
            className="form-control mb-3"
            placeholder="Enter OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            disabled={loading}
            aria-label="OTP"
          />
          <button
            type="submit"
            className="btn btn-success w-100 d-flex justify-content-center"
            disabled={loading}
          >
            {loading ? <span className="rotate-loader"></span> : "Verify OTP"}
          </button>
        </form>
      )}

      {/* STEP 3 */}
      {isResetPassword && (
        <form
          onSubmit={handleChangePassword}
          className="card p-4 shadow-sm form-card mt-3"
        >
          <input
            type="password"
            className="form-control mb-3"
            placeholder="Enter new password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={loading}
            aria-label="New Password"
          />
          <button
            type="submit"
            className="btn btn-warning w-100 d-flex justify-content-center"
            disabled={loading}
          >
            {loading ? (
              <span className="rotate-loader"></span>
            ) : (
              "Change Password"
            )}
          </button>
        </form>
      )}
    </div>
  );
};

export default ForgetPassword;
