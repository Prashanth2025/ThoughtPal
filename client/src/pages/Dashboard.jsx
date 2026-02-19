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
    } catch(error) {
      console.log(error);
      
      setNotes(prev);
      toast.error("Update failed");
    }
  };

  /* ================= UI ================= */
  return (
    <div className="container py-4">
      <h3 className="mb-4 fw-bold">
        <i className="bi bi-journal-text me-2"></i> My Notes
      </h3>

      {loading ? (
        <p className="text-muted">Loading...</p>
      ) : notes.length === 0 ? (
        <p className="text-muted">No notes yet.</p>
      ) : (
        <div className="row g-3">
          {notes.map((n) => (
            <div key={n._id} className="col-md-6 col-lg-4">
              <div className="card h-100 shadow-sm border-0">
                <div className="card-body d-flex flex-column">
                  <h6 className="fw-bold text-primary mb-2">{n.title}</h6>
                  <p className="text-secondary flex-grow-1">{n.content}</p>

                  <div className="d-flex justify-content-end gap-2">
                    <button
                      className="btn btn-sm btn-outline-primary"
                      onClick={() => setEditNote({ ...n })}
                      title="Edit"
                    >
                      <i className="bi bi-pencil"></i>
                    </button>

                    <button
                      className="btn btn-sm btn-outline-danger"
                      onClick={() => handleDeleteNote(n._id)}
                      title="Delete"
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
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
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
                  Save
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
