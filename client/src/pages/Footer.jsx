import React from "react";
import "bootstrap-icons/font/bootstrap-icons.css";

const Footer = () => {
  return (
    <footer className="border-top py-3 bg-light mt-auto">
      <div className="container text-center">
        <p className="mb-2 text-muted fst-italic">
          “Your thoughts deserve a safe place.”
        </p>

        <div className="d-flex justify-content-center gap-4 mb-2">
          <a
            href="https://github.com/Prashanth2025"
            target="_blank"
            rel="noreferrer"
            className="text-dark fs-5"
          >
            <i className="bi bi-github"></i>
          </a>

          <a
            href="https://www.linkedin.com/in/prashanth2005r"
            target="_blank"
            rel="noreferrer"
            className="text-primary fs-5"
          >
            <i className="bi bi-linkedin"></i>
          </a>

          <a
            href="mailto:prashanthramesh.02@gmail.com"
            className="text-danger fs-5"
          >
            <i className="bi bi-envelope-fill"></i>
          </a>
        </div>

        <small className="text-muted">
          © {new Date().getFullYear()} ThoughtPal
        </small>
      </div>
    </footer>
  );
};

export default Footer;
