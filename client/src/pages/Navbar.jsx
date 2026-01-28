import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useUser } from "../contex/UserContex";
import toast from "react-hot-toast";

const Navbar = () => {
  const { setUser } = useUser();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    setUser(null);
    toast.success("You are logged out");
    navigate("/");
  };

  return (
    <nav className="navbar navbar-dark bg-dark px-3">
      <div className="container-fluid d-flex justify-content-between align-items-center">
        {/* Brand */}
        <Link className="navbar-brand fw-bold" to="/dashboard">
          NotesApp
        </Link>

        {/* Links */}
        <div className="d-flex align-items-center gap-3">
          <Link className="nav-link text-white" to="/dashboard">
            Dashboard
          </Link>
          <Link className="nav-link text-white" to="/createnotes">
            Create Notes
          </Link>
          <Link className="nav-link text-white" to="/profile">
            Profile
          </Link>
          <button className="btn btn-outline-light" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
