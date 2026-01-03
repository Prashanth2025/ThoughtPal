import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const [user, setUsers] = useState(null);
  const [newName, setNewName] = useState("");
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNameField, setShowNameField] = useState(false);
  const [showPasswordField, setShowPasswordField] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser && storedUser !== "undefined" && storedUser !== "null") {
      try {
        setUsers(JSON.parse(storedUser));
      } catch (err) {
        console.error("Failed to parse user:", err);
      }
    }
  }, []);

  const getToken = () => localStorage.getItem("token");

  // Update name
  const handleNameUpdate = async (e) => {
    e.preventDefault();
    if (!newName.trim()) return toast.error("Name field is empty");
    const token = getToken();
    if (!token) return toast.error("You must be logged in");

    try {
      const res = await axios.patch(
        "http://localhost:2026/api/v1/user/name",
        { name: newName },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success(res.data.msg);
      const updatedUser = { ...user, name: newName };
      localStorage.setItem("user", JSON.stringify(updatedUser));
      setUsers(updatedUser);
      setNewName("");
      setShowNameField(false);
    } catch (err) {
      toast.error(err.response?.data?.msg || "Error updating name");
    }
  };

  // Update password
  const handlePasswordUpdate = async (e) => {
    e.preventDefault();
    if (!oldPassword || !newPassword || !confirmPassword) {
      return toast.error("All fields are required");
    }
    if (newPassword !== confirmPassword) {
      return toast.error("New passwords do not match");
    }
    const token = getToken();
    if (!token) return toast.error("You must be logged in");

    try {
      const res = await axios.patch(
        "http://localhost:2026/api/v1/user/password",
        { oldPassword, newPassword, confirmPassword },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success(res.data.msg);
      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setShowPasswordField(false);
      handleLogout(); // auto logout
    } catch (err) {
      toast.error(err.response?.data?.msg || "Error updating password");
    }
  };

  // Logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    toast.success("Logged out successfully");
    navigate("/login");
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
      <div className="card shadow-lg p-4" style={{ width: "400px" }}>
        <h2 className="text-center mb-4 text-primary">Profile</h2>
        {user ? (
          <>
            <div className="mb-3">
              <strong>Name:</strong>
              <p className="border border-2 border rounded p-2">{user.name}</p>
              <strong>Email:</strong>
              <p className="border border-2 border rounded p-2">{user.email}</p>
            </div>

            {/* Update Name */}
            {showNameField ? (
              <form onSubmit={handleNameUpdate} className="mb-3">
                <input
                  type="text"
                  className="form-control mb-2"
                  placeholder="Enter new name"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                />
                <button type="submit" className="btn btn-primary w-100 mb-2">
                  Save
                </button>
                <button
                  type="button"
                  className="btn btn-secondary w-100"
                  onClick={() => {
                    setShowNameField(false);
                    setNewName("");
                  }}
                >
                  Cancel
                </button>
              </form>
            ) : (
              <button
                className="btn btn-primary w-100 mb-2"
                onClick={() => setShowNameField(true)}
              >
                Update Name
              </button>
            )}

            {/* Update Password */}
            {showPasswordField ? (
              <form onSubmit={handlePasswordUpdate} className="mb-3">
                <input
                  type="password"
                  className="form-control mb-2"
                  placeholder="Enter old password"
                  value={oldPassword}
                  onChange={(e) => setOldPassword(e.target.value)}
                />
                <input
                  type="password"
                  className="form-control mb-2"
                  placeholder="Enter new password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
                <input
                  type="password"
                  className="form-control mb-2"
                  placeholder="Confirm new password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
                <button type="submit" className="btn btn-warning w-100 mb-2">
                  Save
                </button>
                <button
                  type="button"
                  className="btn btn-secondary w-100"
                  onClick={() => {
                    setShowPasswordField(false);
                    setOldPassword("");
                    setNewPassword("");
                    setConfirmPassword("");
                  }}
                >
                  Cancel
                </button>
              </form>
            ) : (
              <button
                className="btn btn-warning w-100 mb-2"
                onClick={() => setShowPasswordField(true)}
              >
                Update Password
              </button>
            )}
          </>
        ) : (
          <p className="text-center text-muted">No profile details available</p>
        )}
      </div>
    </div>
  );
};

export default Profile;
