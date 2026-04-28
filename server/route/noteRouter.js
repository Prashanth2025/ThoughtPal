const express = require("express");
const verifyToken = require("../middlewares/verifyToken");
const {
  handleCreateNote,
  getNotes,
  handleDeleteNote,
  handleUpdateNote,
} = require("../controller/noteController");
const isAdmin = require("../middlewares/isAdmin");

const noteRouter = express.Router();

noteRouter.post("/create", verifyToken, handleCreateNote);
noteRouter.get("/", verifyToken, getNotes);
noteRouter.get("/admin/all-posts", verifyToken, isAdmin, async (req, res) => {
  try {
    const notes = await Note.find().populate("user", "username email");
    res.json(notes);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
noteRouter.delete("/delete/:_id", verifyToken, handleDeleteNote);
noteRouter.put("/update/:id", verifyToken, handleUpdateNote);
module.exports = noteRouter;
