import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Login from "../component/pages/Login";
import Dashboard from "../component/pages/Dashboard";
import { Toaster } from "react-hot-toast";
import Signup from "../component/pages/signup";
import Navbar from "../component/Constants/Navbar";
import CreateNotes from "../component/pages/Notes";
import Profile from "../component/pages/Profile";
import LandingPage from "../component/pages/LandingPage";
import ForgotPassword from "../component/pages/ForgotPassword";

const App = () => {
  const [isAuth, setIsAuth] = useState(!!localStorage.getItem("token"));

  useEffect(() => {
    const checkAuth = () => setIsAuth(!!localStorage.getItem("token"));
    window.addEventListener("storage", checkAuth);
    return () => window.removeEventListener("storage", checkAuth);
  }, []);

  return (
    <BrowserRouter>
      <Navbar setIsAuth={setIsAuth} />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login setIsAuth={setIsAuth} />} />
        <Route
          path="/dashboard"
          element={isAuth ? <Dashboard /> : <Navigate to="/login" />}
        />
        <Route path="/signup" element={<Signup />} />
        <Route
          path="/create-notes"
          element={isAuth ? <CreateNotes /> : <Navigate to="/login" />}
        />
        <Route
          path="/profile"
          element={isAuth ? <Profile /> : <Navigate to="/login" />}
        />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
      <Toaster />
    </BrowserRouter>
  );
};

export default App;
