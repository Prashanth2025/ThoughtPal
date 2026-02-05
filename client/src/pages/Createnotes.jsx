import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useUser } from "../contex/UserContex";
import { getUserDetails } from "../utils/getUserDetailds";

const API_URL = import.meta.env.VITE_BACKEND_URL;

const Createnotes = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [notes, setNotes] = useState([]);

  // edit states
  const [editingId, setEditingId] = useState(null);
  const [editModal, setEditModal] = useState(null);

  const { setUser } = useUser();
  const navigate = useNavigate();

  /* ================= FETCH NOTES ================= */
  const fetchNotes = useCallback(async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return navigate("/login");

      const { data } = await axios.get(`${API_URL}/api/v1/note`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setNotes(data.notes);
    } catch {
      toast.error("Failed to load notes");
    }
  }, [navigate]);

  useEffect(() => {
    getUserDetails(setUser);
    fetchNotes();
  }, [fetchNotes, setUser]);

  /* ================= CREATE NOTE ================= */
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !content) return toast.error("Fields cannot be empty");

    try {
      const token = localStorage.getItem("token");

      // Optimistic UI
      const tempNote = {
        _id: Date.now(),
        title,
        content,
      };
      setNotes([tempNote, ...notes]);

      const { data } = await axios.post(
        `${API_URL}/api/v1/note/create`,
        { title, note: content },
        { headers: { Authorization: `Bearer ${token}` } },
      );

      toast.success(data.message);
      fetchNotes();
      setTitle("");
      setContent("");
    } catch {
      toast.error("Create failed");
      fetchNotes();
    }
  };

  /* ================= DELETE ================= */
  const handleDelete = async (id) => {
    const prev = [...notes];
    setNotes(notes.filter((n) => n._id !== id));

    try {
      const token = localStorage.getItem("token");
      await axios.delete(`${API_URL}/api/v1/note/delete/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Deleted");
    } catch {
      setNotes(prev);
      toast.error("Delete failed");
    }
  };

  /* ================= INLINE EDIT ================= */
  const saveInline = async (note) => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(`${API_URL}/api/v1/note/update/${note._id}`, note, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setEditingId(null);
    } catch {
      toast.error("Update failed");
    }
  };

  /* ================= AUTO SAVE ================= */
  useEffect(() => {
    if (!editingId) return;

    const timer = setTimeout(() => {
      const note = notes.find((n) => n._id === editingId);
      note && saveInline(note);
    }, 1200);

    return () => clearTimeout(timer);
  }, [notes, editingId]);

  /* ================= MODAL SAVE ================= */
  const updateFromModal = async () => {
    const prev = [...notes];
    setNotes(notes.map((n) => (n._id === editModal._id ? editModal : n)));

    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `${API_URL}/api/v1/note/update/${editModal._id}`,
        editModal,
        { headers: { Authorization: `Bearer ${token}` } },
      );
      toast.success("Updated");
      setEditModal(null);
    } catch {
      setNotes(prev);
      toast.error("Update failed");
    }
  };

  /* ================= UI ================= */
  return (
    <div className="container mt-4">
      <h2 className="mb-3">📒 My Notes</h2>

      {/* CREATE */}
      <form onSubmit={handleSubmit} className="card p-3 mb-4">
        <input
          className="form-control mb-2"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <textarea
          className="form-control mb-2"
          placeholder="Content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
        <button className="btn btn-primary">Add Note</button>
      </form>

      {/* NOTES */}
      <div className="row">
        {notes.map((note) => (
          <div key={note._id} className="col-md-6 mb-3">
            <div className="card p-3 h-100">
              {editingId === note._id ? (
                <>
                  <input
                    className="form-control mb-2"
                    value={note.title}
                    onChange={(e) =>
                      setNotes(
                        notes.map((n) =>
                          n._id === note._id
                            ? { ...n, title: e.target.value }
                            : n,
                        ),
                      )
                    }
                  />
                  <textarea
                    className="form-control"
                    value={note.content}
                    onChange={(e) =>
                      setNotes(
                        notes.map((n) =>
                          n._id === note._id
                            ? { ...n, content: e.target.value }
                            : n,
                        ),
                      )
                    }
                  />
                </>
              ) : (
                <>
                  <h5>{note.title}</h5>
                  <p>{note.content}</p>
                </>
              )}

              <div className="mt-2">
                <button
                  className="btn btn-warning btn-sm me-2"
                  onClick={() => setEditingId(note._id)}
                >
                  Inline Edit
                </button>

                <button
                  className="btn btn-info btn-sm me-2"
                  onClick={() => setEditModal(note)}
                >
                  Modal Edit
                </button>

                <button
                  className="btn btn-danger btn-sm"
                  onClick={() => handleDelete(note._id)}
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* MODAL */}
      {editModal && (
        <div className="modal show d-block bg-dark bg-opacity-50">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5>Edit Note</h5>
                <button
                  className="btn-close"
                  onClick={() => setEditModal(null)}
                />
              </div>
              <div className="modal-body">
                <input
                  className="form-control mb-2"
                  value={editModal.title}
                  onChange={(e) =>
                    setEditModal({ ...editModal, title: e.target.value })
                  }
                />
                <textarea
                  className="form-control"
                  value={editModal.content}
                  onChange={(e) =>
                    setEditModal({ ...editModal, content: e.target.value })
                  }
                />
              </div>
              <div className="modal-footer">
                <button className="btn btn-primary" onClick={updateFromModal}>
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

export default Createnotes;
