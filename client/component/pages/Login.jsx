import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import axios from "axios";
import profile from "../../src/assets/profile.jpg";

let Login = () => {
  let [loginDetails, setLoginDetails] = useState({ email: "", password: "" });
  let [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate(); // ✅ useNavigate hook

  let handleChange = (e) => {
    let { value, name } = e.target;
    setLoginDetails({ ...loginDetails, [name]: value });
  };

  let handleSubmit = async (e) => {
    e.preventDefault();
    if (!loginDetails.email) {
      return toast.error("Email field is empty");
    }
    try {
      let { data } = await axios.post(
        "https://thoughtpal-server.onrender.com/api/v1/user/login",
        loginDetails
      );

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      toast.success(data.msg);
      console.log(data);

      // ✅ redirect immediately after success
      navigate("/dashboard");
    } catch (error) {
      toast.error(error?.response?.data?.msg || "Login failed");
    }
  };

  return (
    <>
      <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
        <div className="card shadow p-4 text-center" style={{ width: "350px" }}>
          {/* Profile Placeholder */}
          <div className="mb-3">
            <img
              src={profile}
              alt="Profile"
              className="rounded-circle border border-2"
              style={{ width: "100px", height: "100px", objectFit: "cover" }}
            />
          </div>

          <h3 className="mb-4">Login</h3>

          <form onSubmit={handleSubmit}>
            {/* Email */}
            <div className="mb-3 input-group">
              <span className="input-group-text">
                <i className="bi bi-envelope"></i>
              </span>
              <input
                type="text"
                name="email"
                className="form-control"
                value={loginDetails.email}
                placeholder="Enter your email"
                onChange={handleChange}
              />
            </div>

            {/* Password */}
            <div className="mb-3 input-group">
              <span className="input-group-text">
                <i className="bi bi-lock"></i>
              </span>
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                className="form-control"
                value={loginDetails.password}
                placeholder="Enter your password"
                onChange={handleChange}
              />
              <span
                className="input-group-text"
                style={{ cursor: "pointer" }}
                onClick={() => setShowPassword(!showPassword)}
              >
                <i
                  className={`bi ${showPassword ? "bi-eye-slash" : "bi-eye"}`}
                ></i>
              </span>
            </div>

            <button type="submit" className="btn btn-primary w-100">
              Login
            </button>
            <p>
              <Link to="/forgot-password">Forgot Password ?</Link>
            </p>
            <p className="mt-3">
              Don't have an account? <Link to="/signup">Signup</Link>
            </p>
          </form>
        </div>
      </div>
    </>
  );
};

export default Login;
