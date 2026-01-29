import React, { useState, useEffect, useCallback } from "react";
import { useUser } from "../contex/UserContex";
import { useNavigate } from "react-router-dom";
import { getUserDetails } from "../utils/getUserDetailds";
import toast from "react-hot-toast";
import axios from "axios";

const API_URL = import.meta.env.VITE_BACKEND_URL;

const Createnotes = () => {
  const [title, setTitle] = useState("");
  const [inp, setInp] = useState("");
  const [notes, setNotes] = useState([]);

  const { setUser } = useUser();
  const navigate = useNavigate();

  const fetchNotes = useCallback(async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setUser(null);
        return navigate("/login");
      }

      const { data } = await axios.get(`http://localhost:2000/api/v1/note`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setNotes(data.notes);
    } catch (error) {
      console.log(error);
      toast.error("Failed to fetch notes");
    }
  }, [navigate, setUser]);

  useEffect(() => {
    getUserDetails(setUser);
    fetchNotes();
  }, [fetchNotes, setUser]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !inp) {
      return toast.error("Title and note cannot be empty");
    }

    try {
      const token = localStorage.getItem("token");
      const { data } = await axios.post(
        `http://localhost:2000/api/v1/note/create`,
        { title, note: inp },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        },
      );

      toast.success(data.message);
      setTitle("");
      setInp("");
      fetchNotes();
    } catch (error) {
      toast.error(error?.response?.data?.message);
    }
  };

  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem("token");
      const { data } = await axios.delete(
        `http://localhost:2000/api/v1/note/delete/${id}`,
        { headers: { Authorization: `Bearer ${token}` } },
      );

      toast.success(data.message);
      fetchNotes();
    } catch (error) {
      console.log(error);
      toast.error("Failed to delete note");
    }
  };

  return (
    <div className="container mt-4">
      <h1 className="text-center mb-4">📒 My Notes</h1>

      <form onSubmit={handleSubmit} className="card p-3 shadow-sm mb-4">
        <div className="mb-3">
          <label className="form-label">Title</label>
          <input
            type="text"
            className="form-control"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Content</label>
          <textarea
            className="form-control"
            value={inp}
            onChange={(e) => setInp(e.target.value)}
            rows="4"
          />
        </div>

        <button className="btn btn-primary w-100">Add Note</button>
      </form>

      <h2 className="mb-3">Your Notes</h2>

      <div className="row">
        {notes.map((note) => (
          <div key={note._id} className="col-md-6 mb-3">
            <div className="card shadow-sm h-100">
              <div className="card-body">
                <h5>{note.title}</h5>
                <p>{note.content}</p>
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

        {notes.length === 0 && (
          <p className="text-muted">No notes yet. Start by adding one!</p>
        )}
      </div>
    </div>
  );
};

export default Createnotes;
