import axios from "axios";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useUser } from "../contex/UserContex";
import { getUserDetails } from "../utils/getUserDetailds";
import { useNavigate } from "react-router-dom";
import "bootstrap-icons/font/bootstrap-icons.css";

const API_URL = import.meta.env.VITE_BACKEND_URL;

const Dashboard = () => {
  const { setUser } = useUser();
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
    getUserDetails(setUser);
    const token = localStorage.getItem("token");
    if (!token) return navigate("/login");
    getNotes();
  }, [navigate, setUser]);

  /* ================= DELETE ================= */
  const handleDeleteNote = async (id) => {
    if (!window.confirm("Delete this note?")) return;

    const prevNotes = [...notes];
    setNotes(notes.filter((n) => n._id !== id));

    try {
      const token = localStorage.getItem("token");
      await axios.delete(`${API_URL}/api/v1/note/delete/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Note deleted");
    } catch {
      setNotes(prevNotes);
      toast.error("Delete failed");
    }
  };

  /* ================= UPDATE ================= */
  const handleUpdate = async () => {
    if (!editNote.title || !editNote.content) {
      return toast.error("Fields cannot be empty");
    }

    const prevNotes = [...notes];
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
    } catch {
      setNotes(prevNotes);
      toast.error("Update failed");
    }
  };

  /* ================= UI ================= */
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
              <div className="card h-100 shadow-sm border-0 rounded-3">
                <div className="card-body d-flex flex-column">
                  <h5 className="fw-bold text-primary">
                    <i className="bi bi-sticky me-2"></i>
                    {n.title}
                  </h5>

                  <p className="text-secondary flex-grow-1">{n.content}</p>

                  <div className="d-flex justify-content-end gap-2">
                    <button
                      className="btn btn-sm btn-outline-primary"
                      onClick={() => setEditNote({ ...n })}
                    >
                      <i className="bi bi-pencil"></i>
                    </button>

                    <button
                      className="btn btn-sm btn-outline-danger"
                      onClick={() => handleDeleteNote(n._id)}
                    >
                      <i className="bi bi-trash"></i>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ================= EDIT MODAL ================= */}
      {editNote && (
        <div className="modal show d-block bg-dark bg-opacity-50">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5>Edit Note</h5>
                <button
                  className="btn-close"
                  onClick={() => setEditNote(null)}
                />
              </div>

              <div className="modal-body">
                <input
                  className="form-control mb-2"
                  value={editNote.title}
                  onChange={(e) =>
                    setEditNote({ ...editNote, title: e.target.value })
                  }
                />
                <textarea
                  className="form-control"
                  rows="4"
                  value={editNote.content}
                  onChange={(e) =>
                    setEditNote({ ...editNote, content: e.target.value })
                  }
                />
              </div>

              <div className="modal-footer">
                <button
                  className="btn btn-secondary"
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
