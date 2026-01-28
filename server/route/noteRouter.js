const express=require('express');
const verifyToken = require('../middlewares/verifyToken');
const { handleCreateNote, getNotes, handleDeleteNote } = require('../controller/noteController');

const noteRouter=express.Router();

noteRouter.post('/create',verifyToken,handleCreateNote);
noteRouter.get('/',verifyToken,getNotes);
noteRouter.delete('/delete/:_id',verifyToken,handleDeleteNote)
module.exports=noteRouter