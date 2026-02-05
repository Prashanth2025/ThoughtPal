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
    if (!token) navigate("/login");
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
      localStorage.removeItem("token");
      setUser(null);
      navigate("/login");
    } catch (error) {
      toast.error(error?.response?.data?.message);
    }
  };

  return (
    <div className="container py-5" style={{ maxWidth: "600px" }}>
      <div className="card shadow-sm border-0 p-4">
        <h3 className="text-center fw-bold mb-4">
          <i className="bi bi-person-circle me-2"></i>Profile
        </h3>

        <div className="text-center mb-4">
          <h5 className="fw-semibold mb-1">{user?.name}</h5>
          <p className="text-muted mb-0">{user?.email}</p>
        </div>

        <div className="d-flex gap-2 mb-4">
          <button
            className={`btn flex-fill ${
              isUpdate === "name" ? "btn-dark" : "btn-outline-dark"
            }`}
            onClick={() => setIsUpdate(isUpdate === "name" ? false : "name")}
          >
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
            Update Password
          </button>
        </div>

        {/* Update Name */}
        {isUpdate === "name" && (
          <form onSubmit={handleUpdateName}>
            <div className="mb-3">
              <label className="form-label">New Name</label>
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

        {/* Update Password */}
        {isUpdate === "password" && (
          <form onSubmit={handleUpdatePass}>
            <div className="mb-3 position-relative">
              <label className="form-label">Current Password</label>
              <input
                type={showPassword ? "text" : "password"}
                className="form-control"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <i
                className={`bi ${showPassword ? "bi-eye-slash" : "bi-eye"}`}
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: "absolute",
                  right: 12,
                  top: "60%",
                  cursor: "pointer",
                }}
              ></i>
            </div>

            <div className="mb-3 position-relative">
              <label className="form-label">New Password</label>
              <input
                type={showNewPassword ? "text" : "password"}
                className="form-control"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
              <i
                className={`bi ${showNewPassword ? "bi-eye-slash" : "bi-eye"}`}
                onClick={() => setShowNewPassword(!showNewPassword)}
                style={{
                  position: "absolute",
                  right: 12,
                  top: "60%",
                  cursor: "pointer",
                }}
              ></i>
            </div>

            <button className="btn btn-danger w-100">Update Password</button>
          </form>
        )}
      </div>
    </div>
  );
};

export default Profile;
