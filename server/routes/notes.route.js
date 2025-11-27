const express = require("express");
const router = express.Router();
const notesController = require("../controllers/notes.controller");

// GET /api/notes - get all notes
router.get("/", notesController.getAllNotes);

// GET /api/notes/:id - get single note
router.get("/:id", notesController.getNoteById);

// POST /api/notes - create note
router.post("/", notesController.createNote);

// PUT /api/notes/:id - update note
router.put("/:id", notesController.updateNote);

// DELETE /api/notes/:id - delete note
router.delete("/:id", notesController.deleteNote);

module.exports = router;
