import axios from "axios";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import "bootstrap-icons/font/bootstrap-icons.css";

const API_URL = import.meta.env.VITE_BACKEND_URL;

const Dashboard = () => {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editNote, setEditNote] = useState(null);

  const navigate = useNavigate();

  /* ================= FETCH NOTES ================= */
  const getNotes = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(`${API_URL}/api/v1/note`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setNotes(res.data.notes);
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to load notes");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return navigate("/login");
    getNotes();
  }, [navigate]);

  /* ================= DELETE ================= */
  const handleDeleteNote = async (id) => {
    if (!window.confirm("Delete this note?")) return;

    const prev = [...notes];
    setNotes(notes.filter((n) => n._id !== id));

    try {
      const token = localStorage.getItem("token");
      await axios.delete(`${API_URL}/api/v1/note/delete/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Note deleted");
    } catch {
      setNotes(prev);
      toast.error("Delete failed");
    }
  };

  /* ================= UPDATE ================= */
  const handleUpdate = async () => {
    if (!editNote.title || !editNote.content) {
      return toast.error("Fields cannot be empty");
    }

    const prev = [...notes];
    setNotes(notes.map((n) => (n._id === editNote._id ? editNote : n)));

    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `${API_URL}/api/v1/note/update/${editNote._id}`,
        {
          title: editNote.title,
          content: editNote.content,
        },
        { headers: { Authorization: `Bearer ${token}` } },
      );

      toast.success("Note updated");
      setEditNote(null);
    } catch (error) {
      console.log(error);
      setNotes(prev);
      toast.error("Update failed");
    }
  };

  /* ================= UI ================= */
  return (
    <div className="container py-4">
      {/* 🔥 Premium Header */}
      <div className="bg-white rounded-4 shadow-sm p-4 mb-4 border">
        <div className="d-flex justify-content-between align-items-center flex-wrap gap-3">
          <div>
            <h3 className="fw-bold mb-1">
              <i className="bi bi-journal-text text-primary me-2"></i>
              My Notes
            </h3>
            <p className="text-muted mb-0 small">
              Capture your thoughts and keep them safe ✨
            </p>
          </div>

          <div className="text-end">
            <h4 className="fw-bold text-primary mb-0">{notes.length}</h4>
            <small className="text-muted">Total Notes</small>
          </div>
        </div>
      </div>

      {/* 🔄 Loading */}
      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-primary mb-3"></div>
          <p className="text-muted mb-0">Loading your notes...</p>
        </div>
      ) : notes.length === 0 ? (
        /* 📭 Empty State */
        <div className="text-center py-5">
          <i className="bi bi-journal-x fs-1 text-muted"></i>
          <h5 className="mt-3">No notes yet</h5>
          <p className="text-muted">Start by creating your first note ✨</p>
        </div>
      ) : (
        /* 🧾 Notes Grid */
        <div className="row g-4">
          {notes.map((n) => (
            <div key={n._id} className="col-md-6 col-lg-4">
              <div className="card h-100 border-0 shadow-sm rounded-4">
                <div className="card-body d-flex flex-column">
                  <h6 className="fw-semibold text-primary mb-2 text-truncate">
                    {n.title}
                  </h6>

                  <p className="text-muted small flex-grow-1">{n.content}</p>

                  <div className="d-flex justify-content-between align-items-center mt-3">
                    <small className="text-muted">
                      <i className="bi bi-stickies me-1"></i>
                      Note
                    </small>

                    <div className="d-flex gap-2">
                      <button
                        className="btn btn-light btn-sm rounded-circle border"
                        onClick={() => setEditNote({ ...n })}
                      >
                        <i className="bi bi-pencil text-primary"></i>
                      </button>

                      <button
                        className="btn btn-light btn-sm rounded-circle border"
                        onClick={() => handleDeleteNote(n._id)}
                      >
                        <i className="bi bi-trash text-danger"></i>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ✏️ Edit Modal */}
      {editNote && (
        <div className="modal show d-block bg-dark bg-opacity-50">
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content rounded-4 border-0 shadow">
              <div className="modal-header">
                <h5 className="modal-title">Edit Note</h5>
                <button
                  className="btn-close"
                  onClick={() => setEditNote(null)}
                />
              </div>

              <div className="modal-body">
                <input
                  className="form-control mb-3"
                  placeholder="Title"
                  value={editNote.title}
                  onChange={(e) =>
                    setEditNote({ ...editNote, title: e.target.value })
                  }
                />
                <textarea
                  className="form-control"
                  rows="4"
                  placeholder="Content"
                  value={editNote.content}
                  onChange={(e) =>
                    setEditNote({ ...editNote, content: e.target.value })
                  }
                />
              </div>

              <div className="modal-footer">
                <button
                  className="btn btn-outline-secondary"
                  onClick={() => setEditNote(null)}
                >
                  Cancel
                </button>
                <button className="btn btn-primary" onClick={handleUpdate}>
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
