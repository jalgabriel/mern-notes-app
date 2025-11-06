import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useState, useEffect } from "react";

import { getNote, updateNote, deleteNote } from "../services/api.js";

export default function NoteDetail() {
   const { id } = useParams();
   const navigate = useNavigate();

   const [note, setNote] = useState(null);
   const [isEditing, setIsEditing] = useState(false);

   useEffect(() => {
      getNote(id).then(setNote);
   }, [id]);

   if (!note) return <p>Loading...</p>;

   // Save Note
   const handleSave = async () => {
      await updateNote(id, note);
      toast.success("Note saved!");
      setIsEditing(false);
   };

   // Delete Note
   const handleDelete = async () => {
      await deleteNote(id);
      toast.info("Note deleted.");
      navigate("/");
   };

   return (
      <div className="note-detail">

         {/* Back Button */}
         <button onClick={() => navigate("/")}>← Back to Notes</button>

         {/* Title */}
         {isEditing ? (
            <input
               type="text"
               value={note.title}
               onChange={(e) => setNote({ ...note, title: e.target.value })}
            />
         ) : (
            <h1>{note.title}</h1>
         )}

         <small className="note-date">{note.date}</small>

         {/* Content */}
         {isEditing ? (
            <textarea
               value={note.content}
               onChange={(e) => setNote({ ...note, content: e.target.value })}
               rows="10"
            />
         ) : (
            <p>{note.content}</p>
         )}

         <div className="actions">
            {/* Toggle Edit Mode */}
            {!isEditing ? (
               <button className="edit-btn" onClick={() => setIsEditing(true)}>
                  Edit
               </button>
            ) : (
               <button className="save-btn" onClick={handleSave}>
                  Save Changes
               </button>
            )}

            <button className="delete-btn" onClick={handleDelete}>Delete Note</button>
         </div>
      </div>
   );
}

