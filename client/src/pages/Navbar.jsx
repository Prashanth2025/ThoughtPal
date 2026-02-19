import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useUser } from "../contex/UserContex";
import toast from "react-hot-toast";
import "bootstrap-icons/font/bootstrap-icons.css";

const Navbar = () => {
  const { setUser } = useUser();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setUser(null);
    toast.success("You are logged out");
    navigate("/");
  };

  const handleClose = () => setIsOpen(false);

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark shadow-sm sticky-top">
      <div className="container">
        {/* ✅ Brand */}
        <Link
          className="navbar-brand fw-bold d-flex align-items-center gap-2"
          to="/dashboard"
          onClick={handleClose}
        >
          <i className="bi bi-journal-text"></i>
          ThoughtPal
        </Link>

        {/* ✅ Hamburger */}
        <button
          className="navbar-toggler"
          type="button"
          aria-controls="navbarContent"
          aria-expanded={isOpen}
          aria-label="Toggle navigation"
          onClick={() => setIsOpen(!isOpen)}
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* ✅ Collapsible menu */}
        <div
          id="navbarContent"
          className={`collapse navbar-collapse ${isOpen ? "show" : ""}`}
        >
          <ul className="navbar-nav ms-auto text-center text-lg-start">
            <li className="nav-item">
              <Link className="nav-link" to="/dashboard" onClick={handleClose}>
                <i className="bi bi-speedometer2 me-1"></i>
                Dashboard
              </Link>
            </li>

            <li className="nav-item">
              <Link
                className="nav-link"
                to="/createnotes"
                onClick={handleClose}
              >
                <i className="bi bi-plus-circle me-1"></i>
                Create Notes
              </Link>
            </li>

            <li className="nav-item">
              <Link className="nav-link" to="/profile" onClick={handleClose}>
                <i className="bi bi-person-circle me-1"></i>
                Profile
              </Link>
            </li>

            {/* ✅ Logout */}
            <li className="nav-item mt-2 mt-lg-0 ms-lg-3">
              <button
                className="btn btn-outline-light btn-sm w-100 w-lg-auto"
                onClick={handleLogout}
              >
                <i className="bi bi-box-arrow-right me-1"></i>
                Logout
              </button>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
