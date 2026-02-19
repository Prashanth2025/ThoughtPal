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

  /* ================= INIT ================= */
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return navigate("/login");
    getUserDetails(setUser);
  }, [navigate, setUser]);

  /* ================= UPDATE NAME ================= */
  const handleUpdateName = async (e) => {
    e.preventDefault();

    if (!name.trim()) return toast.error("Name cannot be empty");
    if (name === user?.name)
      return toast.error("New name cannot be same as current name");

    const token = localStorage.getItem("token");

    try {
      const res = await axios.patch(
        `${API_URL}/api/v1/user/name`,
        { name },
        { headers: { Authorization: `Bearer ${token}` } },
      );

      toast.success(res.data.message);
      await getUserDetails(setUser);
      setIsUpdate(false);
      setName("");
    } catch (error) {
      toast.error(error?.response?.data?.message || "Update failed");
    }
  };

  /* ================= UPDATE PASSWORD ================= */
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
      localStorage.removeItem("token");
      setUser(null);
      navigate("/login");
    } catch (error) {
      toast.error(error?.response?.data?.message || "Update failed");
    }
  };

  /* ================= UI ================= */
  return (
    <div className="container py-5" style={{ maxWidth: "620px" }}>
      <div className="card border-0 shadow-sm rounded-4 p-4">
        {/* 🔥 Header */}
        <div className="text-center mb-4">
          <h3 className="fw-bold mb-2">
            <i className="bi bi-person-circle me-2 text-primary"></i>
            Profile
          </h3>
          <p className="text-muted small mb-0">Manage your account settings</p>
        </div>

        {/* 👤 User Info */}
        <div className="text-center mb-4">
          <h5 className="fw-semibold mb-1">{user?.name || "User"}</h5>
          <p className="text-muted mb-0 small">{user?.email}</p>
        </div>

        {/* 🔘 Toggle Buttons */}
        <div className="d-grid gap-2 d-md-flex mb-4">
          <button
            className={`btn flex-fill ${
              isUpdate === "name" ? "btn-dark" : "btn-outline-dark"
            }`}
            onClick={() => setIsUpdate(isUpdate === "name" ? false : "name")}
          >
            <i className="bi bi-pencil-square me-1"></i>
            Update Name
          </button>

          <button
            className={`btn flex-fill ${
              isUpdate === "password" ? "btn-danger" : "btn-outline-danger"
            }`}
            onClick={() =>
              setIsUpdate(isUpdate === "password" ? false : "password")
            }
          >
            <i className="bi bi-shield-lock me-1"></i>
            Update Password
          </button>
        </div>

        {/* ✏️ Update Name */}
        {isUpdate === "name" && (
          <form onSubmit={handleUpdateName}>
            <div className="mb-3">
              <label className="form-label fw-semibold">New Name</label>
              <input
                type="text"
                className="form-control"
                placeholder="Enter new name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <button className="btn btn-success w-100">Save Changes</button>
          </form>
        )}

        {/* 🔐 Update Password */}
        {isUpdate === "password" && (
          <form onSubmit={handleUpdatePass}>
            {/* Current password */}
            <div className="mb-3 position-relative">
              <label className="form-label fw-semibold">Current Password</label>
              <input
                type={showPassword ? "text" : "password"}
                className="form-control pe-5"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <i
                className={`bi ${showPassword ? "bi-eye-slash" : "bi-eye"}`}
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: "absolute",
                  right: 14,
                  top: "70%",
                  transform: "translateY(-50%)",
                  cursor: "pointer",
                  color: "#6c757d",
                }}
              />
            </div>

            {/* New password */}
            <div className="mb-3 position-relative">
              <label className="form-label fw-semibold">New Password</label>
              <input
                type={showNewPassword ? "text" : "password"}
                className="form-control pe-5"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
              <i
                className={`bi ${showNewPassword ? "bi-eye-slash" : "bi-eye"}`}
                onClick={() => setShowNewPassword(!showNewPassword)}
                style={{
                  position: "absolute",
                  right: 14,
                  top: "70%",
                  transform: "translateY(-50%)",
                  cursor: "pointer",
                  color: "#6c757d",
                }}
              />
            </div>

            <button className="btn btn-danger w-100">Update Password</button>
          </form>
        )}
      </div>
    </div>
  );
};

export default Profile;
