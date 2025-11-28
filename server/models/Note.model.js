// models/Note.model.js
const mongoose = require("mongoose");

const NoteSchema = new mongoose.Schema(
   {
      title: {
         type: String,
         required: true,
         trim: true,
      },
      content: {
         type: String,
         required: true,
      },
      // store date as a string to keep parity with frontend's toLocaleDateString()
      date: {
         type: String,
         default: () => new Date().toLocaleDateString(),
      },
      owner: {
         type: mongoose.Schema.Types.ObjectId,
         ref: "User",
         required: true,
         index: true,
      },
   },
   {
      timestamps: true,
      toJSON: { virtuals: true },
      toObject: { virtuals: true },
   }
);

// expose `id` (string) so the frontend can continue to use note.id
NoteSchema.virtual("id").get(function () {
   return this._id.toString();
});

// Remove MongoDB specific fields when converting to JSON
NoteSchema.method("toJSON", function () {
   const { _id, __v, ...object } = this.toObject({ virtuals: true });
   return object;
});

module.exports = mongoose.model("Note", NoteSchema);



// const mongoose = require("mongoose");

// const NoteSchema = new mongoose.Schema(
//    {
//       title: {
//          type: String,
//          required: true,
//          trim: true,
//       },
//       content: {
//          type: String,
//          required: true,
//       },
//       // store date as a string to keep parity with frontend's toLocaleDateString()
//       date: {
//          type: String,
//          default: () => new Date().toLocaleDateString(),
//       },
//    },
//    {
//       timestamps: true,
//       toJSON: { virtuals: true },
//       toObject: { virtuals: true },
//    }
// );

// // expose `id` (string) so the frontend can continue to use note.id
// NoteSchema.virtual("id").get(function () {
//    return this._id.toString();
// });

// // Remove MongoDB specific fields when converting to JSON
// NoteSchema.method("toJSON", function () {
//    const { _id, __v, ...object } = this.toObject({ virtuals: true });
//    return object;
// });

// module.exports = mongoose.model("Note", NoteSchema);
