import axios from "axios";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useUser } from "../contex/UserContex";
import { getUserDetails } from "../utils/getUserDetailds";
import { useNavigate } from "react-router-dom";
import "bootstrap-icons/font/bootstrap-icons.css";

const API_URL = import.meta.env.VITE_BACKEND_URL;

const Dashboard = () => {
  const { setUser, user } = useUser();
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const getNotes = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(`http://localhost:2000/api/v1/note`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setNotes(res.data.notes);
    } catch (error) {
      toast.error(error?.response?.data?.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getUserDetails(setUser);
    const token = localStorage.getItem("token");
    if (!token) {
      return navigate("/login");
    }
    getNotes();
  }, []);

  const handleDeleteNote = async (_id) => {
    if (!window.confirm("Are you sure you want to delete this note?")) return;
    try {
      const token = localStorage.getItem("token");
      const res = await axios.delete(
        `http://localhost:2000/api/v1/note/delete/${_id}`,
        { headers: { Authorization: `Bearer ${token}` } },
      );
      toast.success(res.data.message);
      getNotes();
    } catch (error) {
      toast.error(error?.response?.data?.message);
    }
  };

  return (
    <div className="container mt-4">
      <h2 className="mb-4">
        <i className="bi bi-journal-text me-2"></i> Dashboard
      </h2>

      {loading ? (
        <p className="text-muted">Loading notes...</p>
      ) : notes.length === 0 ? (
        <p className="text-muted">No notes yet. Create one!</p>
      ) : (
        <div className="row">
          {notes.map((n) => (
            <div key={n._id} className="col-md-6 col-lg-4 mb-4">
              <div
                className="card h-100 shadow-sm border-0"
                style={{ backgroundColor: "#fdfdfd", borderRadius: "12px" }}
              >
                <div className="card-body d-flex flex-column">
                  <h5 className="card-title fw-bold text-primary">
                    <i className="bi bi-sticky me-2"></i>
                    {n.title}
                  </h5>
                  <p className="card-text text-secondary flex-grow-1">
                    {n.content}
                  </p>
                  <div className="d-flex justify-content-end">
                    <button
                      className="btn btn-sm btn-outline-danger"
                      onClick={() => handleDeleteNote(n._id)}
                    >
                      <i className="bi bi-trash-fill me-1"></i> Delete
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
