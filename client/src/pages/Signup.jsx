import axios from "axios";
import React, { useState } from "react";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import bgImage from "../assets/sunset.jpg";

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

    if (!name) return toast.error("Name field is mandatory");
    if (!email) return toast.error("Email field is mandatory");
    if (!password) return toast.error("Password field is mandatory");

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
        <h2 className="text-center mb-4">📝 Signup</h2>

        <form onSubmit={handleSubmit}>
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

          <div className="mb-3 position-relative">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              value={signupDetails.password}
              placeholder="Password"
              onChange={handleChange}
              className="form-control"
              disabled={loading}
            />
            <i
              className={`bi ${showPassword ? "bi-eye-slash" : "bi-eye"}`}
              onClick={() => !loading && setShowPassword(!showPassword)}
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

          <button
            type="submit"
            className="btn btn-success w-100 d-flex align-items-center justify-content-center"
            disabled={loading}
          >
            {loading ? <span className="rotate-loader"></span> : "Signup"}
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
