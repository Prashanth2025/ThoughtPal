const Note = require("../model/noteModel");

/* ================= CREATE ================= */
const handleCreateNote = async (req, res) => {
  const { _id } = req.payload;
  const { title, content } = req.body; // ✅ FIXED

  if (!title || !content) {
    return res
      .status(400)
      .json({ status: false, message: "Provide both title and content" });
  }

  try {
    await Note.create({ title, content, user: _id });
    return res
      .status(201)
      .json({ status: true, message: "Note created successfully" });
  } catch (error) {
    return res
      .status(500)
      .json({ status: false, message: "Server side error" });
  }
};

/* ================= GET ================= */
const getNotes = async (req, res) => {
  const { _id } = req.payload;
  try {
    const notes = await Note.find({ user: _id }).sort({ createdAt: -1 });
    return res.status(200).json({ status: true, notes });
  } catch (error) {
    return res
      .status(500)
      .json({ status: false, message: "Server side error" });
  }
};

/* ================= UPDATE ================= */
const handleUpdateNote = async (req, res) => {
  const { id } = req.params;
  const { _id } = req.payload;
  const { title, content } = req.body;

  console.log(req.params);
  console.log(req.payload);
  console.log(req.body);
  
  if (!title || !content) {
    return res
      .status(400)
      .json({ status: false, message: "Title and content required" });
  }

  try {
    const note = await Note.findOneAndUpdate(
      { _id: id, user: _id }, // 🔐 ownership check
      { title, content },
      { new: true, runValidators: true },
    );

    if (!note) {
      return res.status(404).json({ status: false, message: "Note not found" });
    }

    return res
      .status(200)
      .json({ status: true, message: "Note updated successfully", note });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ status: false, message: "Update failed" });
  }
};

/* ================= DELETE ================= */
const handleDeleteNote = async (req, res) => {
  const { _id } = req.params;
  try {
    await Note.deleteOne({ _id });
    return res
      .status(200)
      .json({ status: true, message: "Note deleted successfully" });
  } catch (error) {
    return res
      .status(500)
      .json({ status: false, message: "Server side error" });
  }
};

module.exports = {
  handleCreateNote,
  getNotes,
  handleDeleteNote,
  handleUpdateNote, // ✅ EXPORT
};
