const Note = require("../model/noteModel");

const handleCreateNote = async (req, res) => {
  const { _id } = req.payload;
  const { title, note } = req.body;

  if (!title || !note) {
    return res
      .status(400)
      .json({ status: false, message: "Provide both title and content" });
  }

  try {
    await Note.create({ title, content: note, user: _id });
    return res
      .status(201)
      .json({ status: true, message: "Note created successfully" });
  } catch (error) {
    return res
      .status(500)
      .json({ status: false, message: "Server side error" });
  }
};

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

module.exports = { handleCreateNote, getNotes, handleDeleteNote };
