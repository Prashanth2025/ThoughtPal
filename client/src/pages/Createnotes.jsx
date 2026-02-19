// Createnotes.jsx
import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

const API_URL = import.meta.env.VITE_BACKEND_URL;

const Createnotes = () => {
  const [notes, setNotes] = useState([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [search, setSearch] = useState("");

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

  /* ================= FILTER ================= */
  const filteredNotes = useMemo(() => {
    return notes.filter(
      (n) =>
        n.title.toLowerCase().includes(search.toLowerCase()) ||
        n.content.toLowerCase().includes(search.toLowerCase()),
    );
  }, [notes, search]);

  /* ================= CREATE ================= */
  const handleCreate = async (e) => {
    e.preventDefault();

    if (!title || !content) return toast.error("All fields required");

    try {
      const { data } = await axios.post(
        `${API_URL}/api/v1/note/create`,
        { title, content },
        { headers: { Authorization: `Bearer ${token}` } },
      );

      setNotes([data.note, ...notes]);
      setTitle("");
      setContent("");
      toast.success("Note created");
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
    if (!editTitle || !editContent) return toast.error("All fields required");

    const prev = [...notes];
    setNotes(
      notes.map((n) =>
        n._id === editId ? { ...n, title: editTitle, content: editContent } : n,
      ),
    );

    try {
      await axios.put(
        `${API_URL}/api/v1/note/update/${editId}`,
        { title: editTitle, content: editContent },
        { headers: { Authorization: `Bearer ${token}` } },
      );

      toast.success("Note updated");
      setEditId(null);
    } catch {
      setNotes(prev);
      toast.error("Update failed");
    }
  };

  /* ================= DELETE ================= */
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this note?")) return;

    const prev = [...notes];
    setNotes(notes.filter((n) => n._id !== id));

    try {
      await axios.delete(`${API_URL}/api/v1/note/delete/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Deleted");
    } catch {
      setNotes(prev);
      toast.error("Delete failed");
    }
  };

  /* ================= UI ================= */
  return (
    <div className="container py-4 create-notes-page">
      <div className="header-box mb-4">
        <h3 className="fw-bold mb-1">
          <i className="bi bi-journal-text me-2" /> My Notes
        </h3>
        <p className="text-muted mb-0 small">Capture your thoughts instantly</p>
      </div>

      {/* CREATE */}
      <form
        onSubmit={handleCreate}
        className="card border-0 shadow-sm rounded-4 p-3 mb-4 create-card"
      >
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
        <button className="btn btn-primary w-100">
          <i className="bi bi-plus-lg me-1" /> Add Note
        </button>
      </form>

      {/* SEARCH */}
      <div className="input-group mb-4">
        <span className="input-group-text bg-white">
          <i className="bi bi-search" />
        </span>
        <input
          className="form-control"
          placeholder="Search notes..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* EMPTY */}
      {filteredNotes.length === 0 && (
        <div className="text-center py-5">
          <i className="bi bi-journal-x fs-1 text-muted" />
          <p className="text-muted">No notes found</p>
        </div>
      )}

      {/* NOTES GRID */}
      <div className="row g-4">
        {filteredNotes.map((note) => (
          <div key={note._id} className="col-md-6 col-lg-4">
            <div className="card border-0 shadow-sm rounded-4 note-card h-100">
              <div className="card-body d-flex flex-column">
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
                    <h6 className="fw-bold text-primary">{note.title}</h6>
                    <p className="text-secondary small flex-grow-1">
                      {note.content}
                    </p>
                    <div className="d-flex justify-content-end gap-2">
                      <button
                        className="btn btn-sm btn-light border"
                        onClick={() => startEdit(note)}
                      >
                        <i className="bi bi-pencil" />
                      </button>
                      <button
                        className="btn btn-sm btn-light border text-danger"
                        onClick={() => handleDelete(note._id)}
                      >
                        <i className="bi bi-trash" />
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Createnotes;
