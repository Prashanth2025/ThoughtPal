import React, { useEffect, useState } from "react";
import { useUser } from "../contex/UserContex";
import { getUserDetails } from "../utils/getUserDetailds";
import { toast } from "react-hot-toast";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "bootstrap-icons/font/bootstrap-icons.css";
const API_URL = import.meta.env.VITE_BACKEND_URL;

const Profile = () => {
  const { user, setUser } = useUser();
  const [isUpdate, setIsUpdate] = useState(false);
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    getUserDetails(setUser);
    const token = localStorage.getItem("token");
    if (!token) {
      return navigate("/login");
    }
  }, [navigate, setUser]);

  const handleUpdateName = async (e) => {
    e.preventDefault();
    if (!name) return toast.error("Name cannot be empty");
    if (name === user.name)
      return toast.error("New name cannot be same as current name");

    const token = localStorage.getItem("token");
    try {
      const res = await axios.patch(
        `${API_URL}/api/v1/user/name`,
        { name },
        { headers: { Authorization: `Bearer ${token}` } },
      );
      toast.success(res.data.message);
      getUserDetails(setUser);
      setIsUpdate(false);
      setName("");
    } catch (error) {
      toast.error(error?.response?.data?.message);
    }
  };

  const handleUpdatePass = async (e) => {
    e.preventDefault();
    if (!password || !newPassword)
      return toast.error("Password fields cannot be empty");

    const token = localStorage.getItem("token");
    try {
      const res = await axios.patch(
        `${API_URL}/api/v1/user/password`,
        { password, newPassword },
        { headers: { Authorization: `Bearer ${token}` } },
      );
      toast.success(res.data.message);
      setIsUpdate(false);
      setPassword("");
      setNewPassword("");
      localStorage.removeItem("token");
      navigate("/login");
      setUser(null);
    } catch (error) {
      toast.error(error?.response?.data?.message);
    }
  };

  return (
    <div className="container mt-5" style={{ maxWidth: "700px" }}>
      <div
        className="card shadow-lg p-4"
        style={{ backgroundColor: "#1c1c1c", color: "#f5f5f5" }}
      >
        <h2 className="mb-3 text-uppercase fw-bold m-auto">
          <i className="bi bi-person-circle me-2"></i> Profile
        </h2>
        <h4>
          <i className="bi bi-person-fill me-2 text-primary"></i>
          {user?.name}
        </h4>
        <h5>
          <i className="bi bi-envelope-fill me-2 text-info"></i>
          {user?.email}
        </h5>

        <div className="mt-4 d-flex gap-3 w-75 m-auto">
          <button
            className="btn btn-primary fw-bold flex-fill"
            onClick={() => setIsUpdate(isUpdate ? false : "name")}
          >
            <i className="bi bi-pencil-square me-2 w-25"></i> Update Name
          </button>
          <button
            className="btn btn-danger fw-bold flex-fill"
            onClick={() => setIsUpdate(isUpdate ? false : "password")}
          >
            <i className="bi bi-shield-lock-fill me-2"></i> Update Password
          </button>
        </div>

        {/* Update Name Form */}
        {isUpdate === "name" && (
          <form onSubmit={handleUpdateName} className="mt-4">
            <div className="mb-3">
              <label className="form-label fw-bold">New Name</label>
              <input
                type="text"
                className="form-control border border-primary"
                placeholder="Enter new name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <button type="submit" className="btn btn-success w-100 fw-bold">
              <i className="bi bi-check-circle me-2"></i> Confirm Update
            </button>
          </form>
        )}

        {/* Update Password Form */}
        {isUpdate === "password" && (
          <form onSubmit={handleUpdatePass} className="mt-4">
            <div className="mb-3 position-relative">
              <label className="form-label fw-bold">Current Password</label>
              <input
                type={showPassword ? "text" : "password"}
                className="form-control border border-warning"
                placeholder="Enter current password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <i
                className={`bi ${showPassword ? "bi-eye-slash" : "bi-eye"}`}
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: "absolute",
                  right: "10px",
                  top: "55%",
                  cursor: "pointer",
                  fontSize: "1.2rem",
                  color: "black",
                }}
              ></i>
            </div>

            <div className="mb-3 position-relative">
              <label className="form-label fw-bold">New Password</label>
              <input
                type={showNewPassword ? "text" : "password"}
                className="form-control border border-danger"
                placeholder="Enter new password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
              <i
                className={`bi ${showNewPassword ? "bi-eye-slash" : "bi-eye"}`}
                onClick={() => setShowNewPassword(!showNewPassword)}
                style={{
                  position: "absolute",
                  right: "10px",
                  top: "55%",
                  cursor: "pointer",
                  fontSize: "1.2rem",
                  color: "black",
                }}
              ></i>
            </div>

            <button type="submit" className="btn btn-danger w-100 fw-bold">
              <i className="bi bi-lock-fill me-2"></i> Confirm Password Update
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default Profile;
