import React from "react";
import "bootstrap-icons/font/bootstrap-icons.css";

const Footer = () => {
  return (
    <footer className="mt-auto border-top bg-white">
      <div className="container py-4">
        {/* Tagline */}
        <div className="text-center mb-3">
          <p className="text-muted fst-italic mb-2">
            “Your thoughts deserve a safe place.”
          </p>
        </div>

        {/* Social Icons */}
        <div className="d-flex justify-content-center gap-3 mb-3">
          <a
            href="https://github.com/Prashanth2025"
            target="_blank"
            rel="noreferrer"
            className="btn btn-light rounded-circle shadow-sm"
            title="GitHub"
          >
            <i className="bi bi-github"></i>
          </a>

          <a
            href="https://www.linkedin.com/in/prashanth2005r"
            target="_blank"
            rel="noreferrer"
            className="btn btn-light rounded-circle shadow-sm"
            title="LinkedIn"
          >
            <i className="bi bi-linkedin text-primary"></i>
          </a>

          <a
            href="mailto:prashanthramesh.02@gmail.com"
            className="btn btn-light rounded-circle shadow-sm"
            title="Email"
          >
            <i className="bi bi-envelope-fill text-danger"></i>
          </a>
        </div>

        {/* Divider */}
        <hr className="my-3 opacity-25" />

        {/* Copyright */}
        <div className="text-center">
          <small className="text-muted">
            © {new Date().getFullYear()}{" "}
            <span className="fw-semibold">ThoughtPal</span> · Built by Prashanth
          </small>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
