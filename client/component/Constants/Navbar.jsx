import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

let Navbar = () => {
  let navigate = useNavigate();
  let isAuth = localStorage.getItem("token");

  let handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
    toast.error("You have been logged out");
  };

  if (!isAuth) return null;

  return (
    <nav className="navbar navbar-dark bg-dark px-3">
      <Link className="navbar-brand" to="/dashboard">
        MyApp
      </Link>
      <ul className="navbar-nav flex-row ms-auto">
        <li className="nav-item me-3">
          <Link className="nav-link" to="/dashboard">
            Dashboard
          </Link>
        </li>
        <li className="nav-item me-3">
          <Link className="nav-link" to="/create-notes">
            Create Notes
          </Link>
        </li>
        <li className="nav-item me-3">
          <Link className="nav-link" to="/profile">
            Profile
          </Link>
        </li>
        <li className="nav-item">
          <button className="btn btn-outline-light" onClick={handleLogout}>
            Logout
          </button>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
