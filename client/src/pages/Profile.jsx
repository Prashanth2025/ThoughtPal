import React, { useEffect, useState } from "react";
import { useUser } from "../contex/UserContex";
import { getUserDetails } from "../utils/getUserDetailds";
import { toast } from "react-hot-toast";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const API_URL = import.meta.env.VITE_BACKEND_URL;

const S = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&display=swap');

  *, *::before, *::after { box-sizing: border-box; }

  .pr-root {
    min-height: 100vh;
    background: #f4f5f7;
    display: flex;
    justify-content: center;
    align-items: flex-start;
    padding: 48px 16px 80px;
    font-family: 'Inter', sans-serif;
  }

  .pr-shell {
    width: 100%;
    max-width: 480px;
  }

  /* page title */
  .pr-page-title {
    font-size: 13px;
    font-weight: 500;
    color: #9099a8;
    letter-spacing: 0.04em;
    text-transform: uppercase;
    margin-bottom: 20px;
  }

  /* card */
  .pr-card {
    background: #fff;
    border: 1px solid #e4e7ec;
    border-radius: 12px;
    overflow: hidden;
    box-shadow: 0 1px 3px rgba(0,0,0,0.06), 0 4px 16px rgba(0,0,0,0.04);
    animation: fadeUp 0.35s ease both;
  }
  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(12px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  /* user row */
  .pr-user-row {
    display: flex;
    align-items: center;
    gap: 14px;
    padding: 24px 28px;
    border-bottom: 1px solid #f0f2f5;
  }
  .pr-avatar {
    width: 44px;
    height: 44px;
    border-radius: 10px;
    background: #1a1f2e;
    color: #fff;
    font-size: 15px;
    font-weight: 600;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    letter-spacing: 0.02em;
  }
  .pr-user-info { flex: 1; min-width: 0; }
  .pr-user-name {
    font-size: 15px;
    font-weight: 600;
    color: #0f1623;
    margin: 0 0 2px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .pr-user-email {
    font-size: 13px;
    color: #8a94a6;
    margin: 0;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .pr-badge {
    font-size: 11px;
    font-weight: 500;
    color: #3d7eff;
    background: #eef3ff;
    border: 1px solid #d0e0ff;
    border-radius: 6px;
    padding: 3px 8px;
    flex-shrink: 0;
  }

  /* nav tabs */
  .pr-nav {
    display: flex;
    border-bottom: 1px solid #f0f2f5;
  }
  .pr-nav-btn {
    flex: 1;
    padding: 14px 0;
    background: none;
    border: none;
    font-family: 'Inter', sans-serif;
    font-size: 13px;
    font-weight: 500;
    color: #8a94a6;
    cursor: pointer;
    border-bottom: 2px solid transparent;
    margin-bottom: -1px;
    transition: color 0.15s, border-color 0.15s;
  }
  .pr-nav-btn:hover { color: #0f1623; }
  .pr-nav-btn.active-name  { color: #0f1623; border-bottom-color: #0f1623; }
  .pr-nav-btn.active-pass  { color: #d0331e; border-bottom-color: #d0331e; }

  /* form area */
  .pr-form-area {
    padding: 28px;
    animation: fadeUp 0.25s ease both;
  }

  .pr-section-title {
    font-size: 13px;
    font-weight: 600;
    color: #0f1623;
    margin: 0 0 4px;
  }
  .pr-section-sub {
    font-size: 12px;
    color: #9099a8;
    margin: 0 0 22px;
  }

  .pr-field { margin-bottom: 16px; }
  .pr-label {
    display: block;
    font-size: 12px;
    font-weight: 500;
    color: #4b5563;
    margin-bottom: 6px;
  }
  .pr-input-wrap { position: relative; }
  .pr-input {
    width: 100%;
    padding: 9px 12px;
    border: 1px solid #e4e7ec;
    border-radius: 8px;
    font-family: 'Inter', sans-serif;
    font-size: 14px;
    color: #0f1623;
    background: #fff;
    outline: none;
    transition: border-color 0.15s, box-shadow 0.15s;
  }
  .pr-input::placeholder { color: #b0b8c4; }
  .pr-input:focus {
    border-color: #3d7eff;
    box-shadow: 0 0 0 3px rgba(61,126,255,0.12);
  }
  .pr-input.has-eye { padding-right: 40px; }

  .pr-eye {
    position: absolute;
    right: 10px;
    bottom: 8px;
    background: none;
    border: none;
    cursor: pointer;
    color: #b0b8c4;
    padding: 2px;
    display: flex;
    align-items: center;
    transition: color 0.15s;
  }
  .pr-eye:hover { color: #4b5563; }

  .pr-actions { margin-top: 20px; display: flex; gap: 8px; }

  .pr-btn {
    padding: 9px 18px;
    border-radius: 8px;
    border: none;
    font-family: 'Inter', sans-serif;
    font-size: 13px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.15s;
  }
  .pr-btn-primary {
    background: #0f1623;
    color: #fff;
  }
  .pr-btn-primary:hover { background: #1e2a40; }

  .pr-btn-danger {
    background: #d0331e;
    color: #fff;
  }
  .pr-btn-danger:hover { background: #b82b18; }

  .pr-btn-ghost {
    background: transparent;
    color: #6b7585;
    border: 1px solid #e4e7ec;
  }
  .pr-btn-ghost:hover { background: #f7f8fa; }

  /* empty state */
  .pr-idle {
    padding: 28px;
    text-align: center;
    color: #b0b8c4;
    font-size: 13px;
  }
`;

const EyeIcon = ({ open }) =>
  open ? (
    <svg
      width="15"
      height="15"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  ) : (
    <svg
      width="15"
      height="15"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
      <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
      <line x1="1" y1="1" x2="23" y2="23" />
    </svg>
  );

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
    const token = localStorage.getItem("token");
    if (!token) return navigate("/login");
    getUserDetails(setUser);
  }, [navigate, setUser]);

  const handleUpdateName = async (e) => {
    e.preventDefault();
    if (!name.trim()) return toast.error("Name cannot be empty");
    if (name === user?.name) return toast.error("Same as current name");
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
    } catch (err) {
      toast.error(err?.response?.data?.message || "Update failed");
    }
  };

  const handleUpdatePass = async (e) => {
    e.preventDefault();
    if (!password || !newPassword) return toast.error("Fields cannot be empty");
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
    } catch (err) {
      toast.error(err?.response?.data?.message || "Update failed");
    }
  };

  const initials =
    user?.name
      ?.split(" ")
      .map((w) => w[0])
      .slice(0, 2)
      .join("")
      .toUpperCase() || "U";

  const cancel = () => {
    setIsUpdate(false);
    setName("");
    setPassword("");
    setNewPassword("");
  };

  return (
    <>
      <style>{S}</style>
      <div className="pr-root">
        <div className="pr-shell">
          <p className="pr-page-title">Account Settings</p>

          <div className="pr-card">
            {/* User row */}
            <div className="pr-user-row">
              <div className="pr-avatar">{initials}</div>
              <div className="pr-user-info">
                <p className="pr-user-name">{user?.name || "—"}</p>
                <p className="pr-user-email">{user?.email || "—"}</p>
              </div>
              <span className="pr-badge">Free</span>
            </div>

            {/* Nav */}
            <div className="pr-nav">
              <button
                className={`pr-nav-btn${isUpdate === "name" ? " active-name" : ""}`}
                onClick={() =>
                  setIsUpdate(isUpdate === "name" ? false : "name")
                }
              >
                Edit Name
              </button>
              <button
                className={`pr-nav-btn${isUpdate === "password" ? " active-pass" : ""}`}
                onClick={() =>
                  setIsUpdate(isUpdate === "password" ? false : "password")
                }
              >
                Change Password
              </button>
            </div>

            {/* Edit Name */}
            {isUpdate === "name" && (
              <div className="pr-form-area">
                <p className="pr-section-title">Display Name</p>
                <p className="pr-section-sub">
                  This is how your name appears across the app.
                </p>
                <form onSubmit={handleUpdateName}>
                  <div className="pr-field">
                    <label className="pr-label">Full Name</label>
                    <input
                      className="pr-input"
                      type="text"
                      placeholder={user?.name || "Enter your name"}
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                  </div>
                  <div className="pr-actions">
                    <button type="submit" className="pr-btn pr-btn-primary">
                      Save Changes
                    </button>
                    <button
                      type="button"
                      className="pr-btn pr-btn-ghost"
                      onClick={cancel}
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Change Password */}
            {isUpdate === "password" && (
              <div className="pr-form-area">
                <p className="pr-section-title">Change Password</p>
                <p className="pr-section-sub">
                  You'll be signed out after updating your password.
                </p>
                <form onSubmit={handleUpdatePass}>
                  <div className="pr-field">
                    <label className="pr-label">Current Password</label>
                    <div className="pr-input-wrap">
                      <input
                        className="pr-input has-eye"
                        type={showPassword ? "text" : "password"}
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                      />
                      <button
                        type="button"
                        className="pr-eye"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        <EyeIcon open={showPassword} />
                      </button>
                    </div>
                  </div>
                  <div className="pr-field">
                    <label className="pr-label">New Password</label>
                    <div className="pr-input-wrap">
                      <input
                        className="pr-input has-eye"
                        type={showNewPassword ? "text" : "password"}
                        placeholder="••••••••"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                      />
                      <button
                        type="button"
                        className="pr-eye"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                      >
                        <EyeIcon open={showNewPassword} />
                      </button>
                    </div>
                  </div>
                  <div className="pr-actions">
                    <button type="submit" className="pr-btn pr-btn-danger">
                      Update Password
                    </button>
                    <button
                      type="button"
                      className="pr-btn pr-btn-ghost"
                      onClick={cancel}
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            )}

            {!isUpdate && (
              <div className="pr-idle">
                Select an option above to make changes.
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Profile;
