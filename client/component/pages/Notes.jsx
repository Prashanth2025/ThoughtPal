import React, { useState } from "react";
import { toast } from "react-hot-toast";

const CreateNotes = () => {
  const [notes, setNotes] = useState([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [editingId, setEditingId] = useState(null); // track which note is being edited

  // Add or Update note
  const handleAddOrUpdate = (e) => {
    e.preventDefault();
    if (!title || !content) {
      toast.error("Both fields are required!");
      return;
    }

    if (editingId) {
      // Update existing note
      const updatedNotes = notes.map((note) =>
        note.id === editingId ? { ...note, title, content } : note
      );
      setNotes(updatedNotes);
      setEditingId(null);
      toast.success("Note updated successfully!");
    } else {
      // Add new note
      const newNote = { id: Date.now(), title, content };
      setNotes([...notes, newNote]);
      toast.success("Note added successfully!");
    }

    setTitle("");
    setContent("");
  };

  // Delete note
  const handleDelete = (id) => {
    setNotes(notes.filter((note) => note.id !== id));
    toast.success("Note deleted!");
  };

  // Edit note
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
      </form>

      <div className="mt-4">
        {notes.map((note) => (
          <div key={note.id} className="card mb-2 p-3 shadow-sm">
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <h5>{note.title}</h5>
                <p>{note.content}</p>
              </div>
              <div>
                <button
                  className="btn btn-sm btn-warning me-2"
                  onClick={() => handleEdit(note)}
                >
                  Edit
                </button>
                <button
                  className="btn btn-sm btn-danger"
                  onClick={() => handleDelete(note.id)}
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
