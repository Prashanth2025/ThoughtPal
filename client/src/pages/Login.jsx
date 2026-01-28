import React, { useState } from "react";
import { toast } from "react-hot-toast";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import bgImage from "../assets/sunset.jpg";

const Login = () => {
  const [loginDetails, setLoginDetails] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
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
      const { data } = await axios.post(
        "http://localhost:2000/api/v1/user/login",
        loginDetails,
      );
      localStorage.setItem("token", data.token);
      toast.success(data.message);
      navigate("/dashboard");
    } catch (error) {
      toast.error(error?.response?.data?.message);
    }
  };

  return (
    <div
      style={{
        backgroundImage: `url(${bgImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div
        style={{
          background: "rgba(0,0,0,0.6)",
          padding: "30px",
          borderRadius: "12px",
          maxWidth: "400px",
          width: "100%",
          color: "white",
        }}
      >
        <h2 className="text-center mb-4">🔐 Login</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <input
              type="email"
              name="email"
              className="form-control"
              value={loginDetails.email}
              placeholder="Email"
              onChange={handleChange}
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
            />
            <i
              className={`bi ${showPassword ? "bi-eye-slash" : "bi-eye"}`}
              onClick={() => setShowPassword(!showPassword)}
              style={{
                position: "absolute",
                right: "10px",
                top: "50%",
                transform: "translateY(-50%)",
                cursor: "pointer",
                fontSize: "1.2rem",
                color: "lightgray",
              }}
            ></i>
          </div>

          <button type="submit" className="btn btn-primary w-100">
            Login
          </button>
        </form>

        <div className="text-center mt-3">
          <small>
            Don't have an account?{" "}
            <Link to="/signup" className="text-info">
              Signup
            </Link>
          </small>
          <br />
          <small>
            <Link to="/forgetPassword" className="text-warning">
              Forgot Password?
            </Link>
          </small>
        </div>
      </div>
    </div>
  );
};

export default Login;
