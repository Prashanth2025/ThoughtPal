import React, { useState, useEffect } from "react";
import { toast } from "react-hot-toast";

const CreateNotes = () => {
  const [notes, setNotes] = useState(() => {
    const saved = localStorage.getItem("notes");
    return saved ? JSON.parse(saved) : [];
  });
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    localStorage.setItem("notes", JSON.stringify(notes));
  }, [notes]);

  const handleAddOrUpdate = (e) => {
    e.preventDefault();
    if (!title || !content) {
      toast.error("Both fields are required!");
      return;
    }

    if (editingId) {
      const updatedNotes = notes.map((note) =>
        note.id === editingId
          ? { ...note, title, content, updatedAt: new Date() }
          : note
      );
      setNotes(updatedNotes);
      setEditingId(null);
      toast.success("Note updated successfully!");
    } else {
      const newNote = { id: Date.now(), title, content, createdAt: new Date() };
      setNotes([...notes, newNote]);
      toast.success("Note added successfully!");
    }

    setTitle("");
    setContent("");
  };

  const handleDelete = (id) => {
    setNotes(notes.filter((note) => note.id !== id));
    toast.success("Note deleted!");
  };

  const handleEdit = (note) => {
    setTitle(note.title);
    setContent(note.content);
    setEditingId(note.id);
  };

  return (
    <div className="container mt-4">
      <h3 className="mb-3">{editingId ? "Update Note" : "Create New Note"}</h3>
      <form onSubmit={handleAddOrUpdate}>
        <div className="mb-3">
          <input
            type="text"
            className="form-control w-50"
            placeholder="Note Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>
        <div className="mb-3">
          <textarea
            className="form-control w-50"
            placeholder="Note Content"
            rows="3"
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
        </div>
        <button type="submit" className="btn btn-primary w-25">
          {editingId ? "Update Note" : "Save Note"}
        </button>
        {editingId && (
          <button
            type="button"
            className="btn btn-secondary ms-2"
            onClick={() => {
              setEditingId(null);
              setTitle("");
              setContent("");
            }}
          >
            Cancel
          </button>
        )}
      </form>

      <div className="mt-4">
        {notes.map((note) => (
          <div key={note.id} className="card mb-2 p-3 shadow-sm">
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <h5>{note.title}</h5>
                <p>{note.content}</p>
                <small className="text-muted">
                  {note.updatedAt
                    ? `Updated: ${new Date(note.updatedAt).toLocaleString()}`
                    : `Created: ${new Date(note.createdAt).toLocaleString()}`}
                </small>
              </div>
              <div>
                <button
                  className="btn btn-sm btn-warning me-2"
                  onClick={() => handleEdit(note)}
                  aria-label="Edit note"
                >
                  Edit
                </button>
                <button
                  className="btn btn-sm btn-danger"
                  onClick={() => handleDelete(note.id)}
                  aria-label="Delete note"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CreateNotes;
