import React from "react";

const Footer = () => {
  return (
    <footer className="mt-auto border-top py-3 bg-light">
      <div className="container text-center">
        <p className="mb-1 text-muted">
          © {new Date().getFullYear()} ThoughtPal
        </p>
        <small className="text-muted">
          Built with ❤️ using React & Node.js
        </small>
      </div>
    </footer>
  );
};

export default Footer;
