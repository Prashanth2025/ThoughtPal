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

  /* ================= FETCH NOTES ================= */
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
    if (!title || !content) return toast.error("All fields required");

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
    try {
      await axios.put(
        `${API_URL}/api/v1/note/update/${editId}`,
        {
          title: editTitle,
          content: editContent,
        },
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
    <div className="container mt-4">
      <h3>📝 My Notes</h3>

      {/* CREATE */}
      <form onSubmit={handleCreate} className="card p-3 mb-4">
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
        <button className="btn btn-primary">Add</button>
      </form>

      {/* NOTES */}
      {notes.map((note) => (
        <div key={note._id} className="card p-3 mb-2">
          {editId === note._id ? (
            <>
              <input
                className="form-control mb-2"
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
              />
              <textarea
                className="form-control mb-2"
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
              />
              <button className="btn btn-success me-2" onClick={handleUpdate}>
                Save
              </button>
              <button
                className="btn btn-secondary"
                onClick={() => setEditId(null)}
              >
                Cancel
              </button>
            </>
          ) : (
            <>
              <h5>{note.title}</h5>
              <p>{note.content}</p>
              <button
                className="btn btn-warning btn-sm me-2"
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
            </>
          )}
        </div>
      ))}
    </div>
  );
};

export default Createnotes;
