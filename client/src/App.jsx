import React, { useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Signup from "./pages/Signup";
import Navbar from "./pages/Navbar";
import Createnotes from "./pages/Createnotes";
import Profile from "./pages/Profile";
import ForgetPassword from "./pages/ForgetPassword";
import LandingPage from "./pages/LandingPage";
import Footer from "./pages/Footer";
import { Toaster } from "react-hot-toast";

import { useUser } from "./contex/UserContex";
import { getUserDetails } from "./utils/getUserDetailds";

const App = () => {
  const { user, setUser } = useUser();

  /* ✅ LOAD USER ON APP START */
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      getUserDetails(setUser);
    }
  }, [setUser]);

  return (
    <BrowserRouter>
      <div className="d-flex flex-column min-vh-100">
        {/* ✅ Navbar shows when token exists */}
        {user && <Navbar />}

        <div className="flex-grow-1">
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/createnotes" element={<Createnotes />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/forgetPassword" element={<ForgetPassword />} />
            <Route path="/check" element={<Check />} />
          </Routes>
        </div>

        <Toaster />
        {user && <Footer />}
      </div>
    </BrowserRouter>
  );
};

const Check = () => {
  const isAuth = localStorage.getItem("token");
  return isAuth ? <Navigate to="/dashboard" /> : <Navigate to="/login" />;
};

export default App;
