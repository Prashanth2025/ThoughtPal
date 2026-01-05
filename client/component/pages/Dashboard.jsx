import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const Dashboard = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");

    if (storedUser && storedUser !== "undefined" && storedUser !== "null") {
      try {
        setUser(JSON.parse(storedUser));
      } catch (err) {
        console.error("Failed to parse user:", err);
      }
    }
  }, []);

  // Dynamic greeting based on time
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-card shadow">
        <h2 className="dashboard-title">Dashboard</h2>
        {user ? (
          <div className="dashboard-details">
            <p>
              {getGreeting()}, <strong>{user?.name}</strong> 👋
            </p>
            <p>Hope your day goes well!</p>
          </div>
        ) : (
          <div className="no-user">
            <p>No user details found</p>
            <Link to="/login" className="btn btn-primary mt-3">
              Go to Login
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
