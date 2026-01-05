import { useState } from "react";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import profile from "../../src/assets/profile.jpg";

const Signup = () => {
  const [signupDetails, setSignupDetails] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSignChange = (e) => {
    const { value, name } = e.target;
    setSignupDetails({ ...signupDetails, [name]: value.trim() });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!signupDetails.name) return toast.error("Name is required!");
    if (!signupDetails.email) return toast.error("Email is required!");
    if (!/\S+@\S+\.\S+/.test(signupDetails.email)) {
      return toast.error("Please enter a valid email address");
    }
    if (!signupDetails.password) return toast.error("Password is required!");
    if (signupDetails.password.length < 8) {
      return toast.error("Password must be at least 8 characters long");
    }
    if (
      !/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/.test(
        signupDetails.password
      )
    ) {
      return toast.error(
        "Password must include uppercase, lowercase, number, and special character"
      );
    }

    setLoading(true);
    try {
      const { data } = await axios.post(
        "https://thoughtpal-server.onrender.com/api/v1/user/signup",
        signupDetails
      );
      toast.success(data.msg || "Signup successful");
      setTimeout(() => navigate("/login"), 1500); // delay redirect
    } catch (error) {
      const message =
        error?.response?.data?.msg || "Signup failed. Please try again.";
      toast.error(message);
      if (process.env.NODE_ENV === "development") {
        console.error("Signup error:", error);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="d-flex flex-column justify-content-center align-items-center vh-100 bg-light">
      <div
        className="card shadow rounded-3 p-4"
        style={{ maxWidth: "400px", width: "100%" }}
      >
        {/* Profile Avatar */}
        <div className="text-center mb-4">
          <img
            src={profile}
            alt="Default Profile"
            className="rounded-circle border border-2"
            style={{ width: "100px", height: "100px", objectFit: "cover" }}
          />
        </div>

        {/* Title */}
        <h3 className="text-center mb-4 fw-bold text-primary">
          Create Account
        </h3>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          {/* Name */}
          <div className="form-floating mb-3">
            <input
              type="text"
              name="name"
              className="form-control"
              id="floatingName"
              placeholder="Full Name"
              value={signupDetails.name}
              onChange={handleSignChange}
              autoFocus
            />
            <label htmlFor="floatingName">Full Name</label>
          </div>

          {/* Email */}
          <div className="form-floating mb-3">
            <input
              type="email"
              name="email"
              className="form-control"
              id="floatingEmail"
              placeholder="Email Address"
              value={signupDetails.email}
              onChange={handleSignChange}
            />
            <label htmlFor="floatingEmail">Email Address</label>
          </div>

          {/* Password */}
          <div className="input-group mb-3">
            <div className="form-floating flex-grow-1">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                className="form-control"
                id="floatingPassword"
                placeholder="Password"
                value={signupDetails.password}
                onChange={handleSignChange}
              />
              <label htmlFor="floatingPassword">Password</label>
            </div>
            <span
              className="input-group-text"
              style={{ cursor: "pointer" }}
              onClick={() => setShowPassword(!showPassword)}
              aria-label="Toggle password visibility"
            >
              <i
                className={`bi ${showPassword ? "bi-eye-slash" : "bi-eye"}`}
              ></i>
            </span>
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="btn btn-primary btn-lg w-100 fw-bold"
            disabled={loading}
          >
            {loading ? "Signing up..." : "Sign Up"}
          </button>

          {/* Redirect */}
          <p className="mt-3 text-center">
            Already have an account? <Link to="/login">Login here</Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Signup;
