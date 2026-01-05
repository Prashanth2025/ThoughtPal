import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "../component/pages/Login";
import Dashboard from "../component/pages/Dashboard";
import { Toaster } from "react-hot-toast";
import Signup from "../component/pages/Signup";
import Navbar from "../component/Constants/Navbar";
import CreateNotes from "../component/pages/Notes";
import Profile from "../component/pages/Profile";
import LandingPage from "../component/pages/LandingPage";
import PassUpdate from "../component/pages/PassUpdate";

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  return token ? children : <Navigate to="/login" />;
};

let App = () => {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/forgot-password" element={<PassUpdate />} />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/create-notes"
          element={
            <ProtectedRoute>
              <CreateNotes />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
      </Routes>
      <Toaster />
    </BrowserRouter>
  );
};

export default App;
