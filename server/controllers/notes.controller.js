// controllers/notes.controller.js
const Note = require("../models/Note.model.js");

// GET /api/notes - get all notes (only for current user)
const getAllNotes = async (req, res) => {
   try {
      const owner = req.user && req.user.id;
      if (!owner) return res.status(401).json({ message: "Unauthorized" });

      const notes = await Note.find({ owner }).sort({ updatedAt: -1 });
      res.json(notes);
   } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Server error" });
   }
};

// GET /api/notes/:id - get single note (only if owned by current user)
const getNoteById = async (req, res) => {
   try {
      const owner = req.user && req.user.id;
      if (!owner) return res.status(401).json({ message: "Unauthorized" });

      const note = await Note.findOne({ _id: req.params.id, owner });
      if (!note) return res.status(404).json({ message: "Note not found" });
      res.json(note);
   } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Server error" });
   }
};

// POST /api/notes - create note (owner set to current user)
const createNote = async (req, res) => {
   try {
      const owner = req.user && req.user.id;
      if (!owner) return res.status(401).json({ message: "Unauthorized" });

      const { title, content, date } = req.body;

      if (!title || !content) {
         return res.status(400).json({ message: "Title and content are required" });
      }

      const newNote = new Note({ title, content, date, owner });
      await newNote.save();
      res.status(201).json(newNote);
   } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Server error" });
   }
};

// PUT /api/notes/:id - update note (only if owned by current user)
const updateNote = async (req, res) => {
   try {
      const owner = req.user && req.user.id;
      if (!owner) return res.status(401).json({ message: "Unauthorized" });

      const { title, content, date } = req.body;

      const updated = await Note.findOneAndUpdate(
         { _id: req.params.id, owner },
         { title, content, date },
         { new: true, runValidators: true }
      );

      if (!updated) return res.status(404).json({ message: "Note not found" });
      res.json(updated);
   } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Server error" });
   }
};

// DELETE /api/notes/:id - delete note (only if owned by current user)
const deleteNote = async (req, res) => {
   try {
      const owner = req.user && req.user.id;
      if (!owner) return res.status(401).json({ message: "Unauthorized" });

      const deleted = await Note.findOneAndDelete({ _id: req.params.id, owner });
      if (!deleted) return res.status(404).json({ message: "Note not found" });
      res.json({ message: "Note deleted" });
   } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Server error" });
   }
};

module.exports = {
   getAllNotes,
   getNoteById,
   createNote,
   updateNote,
   deleteNote,
};


// const Note = require("../models/Note.model.js");

// // GET /api/notes - get all notes
// const getAllNotes = async (req, res) => {
//    try {
//       const notes = await Note.find().sort({ updatedAt: -1 });
//       res.json(notes);
//    } catch (err) {
//       console.error(err);
//       res.status(500).json({ message: "Server error" });
//    }
// };

// // GET /api/notes/:id - get single note
// const getNoteById = async (req, res) => {
//    try {
//       const note = await Note.findById(req.params.id);
//       if (!note) return res.status(404).json({ message: "Note not found" });
//       res.json(note);
//    } catch (err) {
//       console.error(err);
//       res.status(500).json({ message: "Server error" });
//    }
// };

// // POST /api/notes - create note
// const createNote = async (req, res) => {
//    try {
//       const { title, content, date } = req.body;

//       if (!title || !content) {
//          return res
//             .status(400)
//             .json({ message: "Title and content are required" });
//       }

//       const newNote = new Note({ title, content, date });
//       await newNote.save();
//       res.status(201).json(newNote);

//    } catch (err) {
//       console.error(err);
//       res.status(500).json({ message: "Server error" });
//    }
// };

// // PUT /api/notes/:id - update note
// const updateNote = async (req, res) => {
//    try {
//       const { title, content, date } = req.body;

//       const updated = await Note.findByIdAndUpdate(
//          req.params.id,
//          { title, content, date },
//          { new: true, runValidators: true }
//       );

//       if (!updated) return res.status(404).json({ message: "Note not found" });
//       res.json(updated);

//    } catch (err) {
//       console.error(err);
//       res.status(500).json({ message: "Server error" });
//    }
// };

// // DELETE /api/notes/:id - delete note
// const deleteNote = async (req, res) => {
//    try {
//       const deleted = await Note.findByIdAndDelete(req.params.id);
//       if (!deleted) return res.status(404).json({ message: "Note not found" });
//       res.json({ message: "Note deleted" });

//    } catch (err) {
//       console.error(err);
//       res.status(500).json({ message: "Server error" });
//    }
// };


// module.exports = {
//    getAllNotes,
//    getNoteById,
//    createNote,
//    updateNote,
//    deleteNote
// }
