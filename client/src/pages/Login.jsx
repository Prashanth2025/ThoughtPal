import React, { useState } from "react";
import { toast } from "react-hot-toast";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import bgImage from "../assets/login.jpg";
import "bootstrap-icons/font/bootstrap-icons.css";

const API_URL = import.meta.env.VITE_BACKEND_URL;

const Login = () => {
  const [loginDetails, setLoginDetails] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { value, name } = e.target;
    setLoginDetails({ ...loginDetails, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!loginDetails.email) return toast.error("Email field is empty");
    if (!loginDetails.password) return toast.error("Password field is empty");

    try {
      setLoading(true);

      const { data } = await axios.post(
        `${API_URL}/api/v1/user/login`,
        loginDetails,
      );

      localStorage.setItem("token", data.token);
      toast.success(data.message);
      navigate("/dashboard");
    } catch (error) {
      toast.error(error?.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        backgroundImage: `url(${bgImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: "20px",
      }}
    >
      {/* Premium Glass Card */}
      <div
        className="shadow-lg"
        style={{
          backdropFilter: "blur(14px)",
          background: "rgba(0,0,0,0.55)",
          borderRadius: "18px",
          maxWidth: "420px",
          width: "100%",
          padding: "32px",
          color: "white",
          border: "1px solid rgba(255,255,255,0.15)",
        }}
      >
        <h2 className="text-center mb-4 fw-bold">🔐 Welcome Back</h2>

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <input
              type="email"
              name="email"
              className="form-control"
              placeholder="Email address"
              value={loginDetails.email}
              onChange={handleChange}
              disabled={loading}
            />
          </div>

          <div className="mb-3 position-relative">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              className="form-control"
              placeholder="Password"
              value={loginDetails.password}
              onChange={handleChange}
              disabled={loading}
            />
            <i
              className={`bi ${showPassword ? "bi-eye-slash" : "bi-eye"}`}
              onClick={() => setShowPassword(!showPassword)}
              style={{
                position: "absolute",
                right: "12px",
                top: "50%",
                transform: "translateY(-50%)",
                cursor: "pointer",
                fontSize: "1.2rem",
                color: "#ddd",
              }}
            ></i>
          </div>

          <button
            type="submit"
            className="btn btn-primary w-100 d-flex align-items-center justify-content-center fw-semibold"
            disabled={loading}
            style={{ borderRadius: "10px" }}
          >
            {loading ? <span className="rotate-loader"></span> : "Login"}
          </button>
        </form>

        <div className="text-center mt-4">
          <small className="text-light">
            Don&apos;t have an account?{" "}
            <Link to="/signup" className="text-info fw-semibold">
              Signup
            </Link>
          </small>
          <br />
          <small>
            <Link to="/forgetPassword" className="text-warning fw-semibold">
              Forgot Password?
            </Link>
          </small>
        </div>
      </div>
    </div>
  );
};

export default Login;
