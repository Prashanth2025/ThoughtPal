import React from "react";
import { Link } from "react-router-dom";
import Live from "../assets/lp.webm";

const LandingPage = () => {
  return (
    <div className="landing-container">
      <video autoPlay loop muted className="background-video">
        <source src={Live} type="video/mp4" />
      </video>

      <div className="overlay d-flex flex-column justify-content-center align-items-center text-center px-3">
        <h1 className="display-3 fw-bold text-white mb-2">ThoughtPal</h1>
        <p className="lead text-white mb-4">Your Thoughts, Your Notes!</p>
        <div className="d-flex gap-3">
          <Link to="/login" className="btn btn-primary px-4 py-2">
            Login
          </Link>
          <Link to="/signup" className="btn btn-success px-4 py-2">
            Signup
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
