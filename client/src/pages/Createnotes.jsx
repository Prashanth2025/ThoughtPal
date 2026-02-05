import React, { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

const API_URL = import.meta.env.VITE_BACKEND_URL;

const Createnotes = () => {
  const [notes, setNotes] = useState([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const [editId, setEditId] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editContent, setEditContent] = useState("");

  const token = localStorage.getItem("token");

  /* ================= FETCH ================= */
  const fetchNotes = async () => {
    try {
      const { data } = await axios.get(`${API_URL}/api/v1/note`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setNotes(data.notes);
    } catch {
      toast.error("Failed to load notes");
    }
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  /* ================= CREATE ================= */
  const handleCreate = async (e) => {
    e.preventDefault();

    if (!title || !content) {
      return toast.error("All fields required");
    }

    try {
      await axios.post(
        `${API_URL}/api/v1/note/create`,
        { title, content },
        { headers: { Authorization: `Bearer ${token}` } },
      );

      toast.success("Note created");
      setTitle("");
      setContent("");
      fetchNotes();
    } catch {
      toast.error("Create failed");
    }
  };

  /* ================= EDIT ================= */
  const startEdit = (note) => {
    setEditId(note._id);
    setEditTitle(note.title);
    setEditContent(note.content);
  };

  const handleUpdate = async () => {
    if (!editTitle || !editContent) {
      return toast.error("All fields required");
    }

    try {
      await axios.put(
        `${API_URL}/api/v1/note/update/${editId}`,
        { title: editTitle, content: editContent },
        { headers: { Authorization: `Bearer ${token}` } },
      );

      toast.success("Note updated");
      setEditId(null);
      fetchNotes();
    } catch {
      toast.error("Update failed");
    }
  };

  /* ================= DELETE ================= */
  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API_URL}/api/v1/note/delete/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      toast.success("Deleted");
      fetchNotes();
    } catch {
      toast.error("Delete failed");
    }
  };

  /* ================= UI ================= */
  return (
    <div className="container py-4" style={{ maxWidth: "700px" }}>
      <h3 className="text-center mb-4">📝 My Notes</h3>

      {/* CREATE */}
      <form onSubmit={handleCreate} className="card shadow-sm p-3 mb-4">
        <input
          className="form-control mb-2"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <textarea
          className="form-control mb-3"
          placeholder="Write your note..."
          rows="3"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
        <button className="btn btn-primary w-100">Add Note</button>
      </form>

      {/* NOTES */}
      {notes.length === 0 && (
        <p className="text-center text-muted">No notes yet</p>
      )}

      {notes.map((note) => (
        <div key={note._id} className="card shadow-sm p-3 mb-3">
          {editId === note._id ? (
            <>
              <input
                className="form-control mb-2"
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
              />
              <textarea
                className="form-control mb-3"
                rows="3"
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
              />
              <div className="d-flex gap-2">
                <button
                  className="btn btn-success btn-sm"
                  onClick={handleUpdate}
                >
                  Save
                </button>
                <button
                  className="btn btn-outline-secondary btn-sm"
                  onClick={() => setEditId(null)}
                >
                  Cancel
                </button>
              </div>
            </>
          ) : (
            <>
              <h5 className="mb-1">{note.title}</h5>
              <p className="text-muted">{note.content}</p>
              <div className="d-flex gap-2">
                <button
                  className="btn btn-warning btn-sm"
                  onClick={() => startEdit(note)}
                >
                  Edit
                </button>
                <button
                  className="btn btn-danger btn-sm"
                  onClick={() => handleDelete(note._id)}
                >
                  Delete
                </button>
              </div>
            </>
          )}
        </div>
      ))}
    </div>
  );
};

export default Createnotes;
