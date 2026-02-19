import axios from "axios";
import React, { useState } from "react";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import "bootstrap-icons/font/bootstrap-icons.css"; // ✅ IMPORTANT
import bgImage from "../assets/signup.jpg";

const API_URL = import.meta.env.VITE_BACKEND_URL;

const Signup = () => {
  const navigate = useNavigate();
  const [signupDetails, setSignupDetails] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { value, name } = e.target;
    setSignupDetails({ ...signupDetails, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { name, email, password } = signupDetails;

    if (!name.trim()) return toast.error("Name field is mandatory");
    if (!email.trim()) return toast.error("Email field is mandatory");
    if (!password.trim()) return toast.error("Password field is mandatory");

    // ✅ simple email check
    if (!email.includes("@")) return toast.error("Enter valid email");

    try {
      setLoading(true);

      const res = await axios.post(
        `${API_URL}/api/v1/user/signup`,
        signupDetails,
      );

      toast.success(res.data.message);
      navigate("/login");
    } catch (error) {
      toast.error(error?.response?.data?.message || "Signup failed");
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
      <div
        style={{
          background: "rgba(0,0,0,0.65)",
          padding: "30px",
          borderRadius: "12px",
          maxWidth: "400px",
          width: "100%",
          color: "white",
          backdropFilter: "blur(6px)",
        }}
      >
        <h2 className="text-center mb-4">📝 Signup</h2>

        <form onSubmit={handleSubmit}>
          {/* Name */}
          <div className="mb-3">
            <input
              type="text"
              name="name"
              value={signupDetails.name}
              placeholder="Name"
              onChange={handleChange}
              className="form-control"
              disabled={loading}
            />
          </div>

          {/* Email */}
          <div className="mb-3">
            <input
              type="email"
              name="email"
              value={signupDetails.email}
              placeholder="Email"
              onChange={handleChange}
              className="form-control"
              disabled={loading}
            />
          </div>

          {/* Password */}
          <div className="mb-3 position-relative">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              value={signupDetails.password}
              placeholder="Password"
              onChange={handleChange}
              className="form-control pe-5"
              disabled={loading}
            />

            <i
              className={`bi ${showPassword ? "bi-eye-slash" : "bi-eye"}`}
              onClick={() => !loading && setShowPassword(!showPassword)}
              style={{
                position: "absolute",
                right: "12px",
                top: "50%",
                transform: "translateY(-50%)",
                cursor: loading ? "not-allowed" : "pointer",
                fontSize: "1.2rem",
                color: "#ccc",
              }}
            ></i>
          </div>

          {/* Button */}
          <button
            type="submit"
            className="btn btn-success w-100"
            disabled={loading}
          >
            {loading ? "Please wait..." : "Signup"}
          </button>
        </form>

        <div className="mt-3 text-center">
          <small>
            Already have an account?{" "}
            <Link to="/login" className="text-info">
              Login
            </Link>
          </small>
        </div>
      </div>
    </div>
  );
};

export default Signup;
