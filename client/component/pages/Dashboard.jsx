import React, { useEffect, useState } from "react";

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

  return (
    <div className="dashboard-container">
      <div className="dashboard-card shadow">
        <h2 className="dashboard-title">Dashboard</h2>
        {user ? (
          <div className="dashboard-details">
            <p>
              Welcome, <strong>{user.name}</strong> 👋
            </p>
            <p>Hope Your Day Go Well</p>
          </div>
        ) : (
          <p className="no-user">No user details found</p>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
