import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "../component/pages/Login";
import Dashboard from "../component/pages/Dashboard";
import { Toaster } from "react-hot-toast";
import Signup from "../component/pages/signup";
import Navbar from "../component/Constants/Navbar";
import CreateNotes from "../component/pages/Notes";
import Profile from "../component/pages/profile";
import LandingPage from "../component/pages/Landingpage";
import PassUpdate from "../component/pages/passUpdate";

let App = () => {
  let isAuth = localStorage.getItem("token");
  return (
    <>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
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
          <Route path="/forgot-password" element={<PassUpdate/>}/>
        </Routes>
        <Toaster />
      </BrowserRouter>
    </>
  );
};

export default App;
