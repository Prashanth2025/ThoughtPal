import { Link, useNavigate } from "react-router-dom";
import { useEffect } from "react";

const LandingPage = () => {
  const navigate = useNavigate();
  const isAuth = localStorage.getItem("token");

  useEffect(() => {
    if (isAuth) {
      navigate("/create-notes");
    }
  }, [isAuth, navigate]);

  if (isAuth) return null;

  return (
    <div className="landing-container">
      <video autoPlay loop muted playsInline className="bg-video">
        <source src="/855005-hd_1280_720_30fps.mp4" type="video/mp4" />
      </video>

      <div className="overlay">
        <h1>Welcome to ThoughtPal</h1>
        <p>Your notes, your space</p>
        <div>
          <Link to="/login" className="btn btn-primary me-2">
            Login
          </Link>
          <Link to="/signup" className="btn btn-success">
            Signup
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
