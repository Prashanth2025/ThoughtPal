const express = require("express");
const verifyToken = require("../middlewares/verifyToken");
const {
  handleCreateNote,
  getNotes,
  handleDeleteNote,
  handleUpdateNote,
} = require("../controller/noteController");

const noteRouter = express.Router();

noteRouter.post("/create", verifyToken, handleCreateNote);
noteRouter.get("/", verifyToken, getNotes);
noteRouter.delete("/delete/:_id", verifyToken, handleDeleteNote);
noteRouter.put("/update/:id", verifyToken, handleUpdateNote);
module.exports = noteRouter;
