import { useState } from "react";
import { toast } from 'react-toastify';
import { useNavigate } from "react-router-dom";

import { createNote } from "../services/api.js";

export default function CreateNote() {
   const [title, setTitle] = useState("");
   const [content, setContent] = useState("");
   const navigate = useNavigate();

   // const handleCreate = () => {
   //    const newNote = {
   //       id: Date.now().toString(),
   //       title,
   //       content,
   //       date: new Date().toLocaleDateString(),
   //    };

   //    const notes = JSON.parse(localStorage.getItem("notes")) || [];
   //    notes.push(newNote);
   //    localStorage.setItem("notes", JSON.stringify(notes));
   //    navigate("/");
   // };


   // ====== API CONNECTION =====
   const handleCreate = async () => {
      if (!title.trim() || !content.trim()) {
         toast.error('Please fill out both fields.');

         return;
      };

      await createNote({ 
         title, 
         content, 
         date: new Date().toLocaleDateString() 
      });

      toast.success('Note created!');
      navigate("/");
   };

   return (
      <div className="create-note">
         <button onClick={() => navigate("/")}>← Back to Notes</button>
         <h2>Create New Note</h2>

         <input
            type="text"
            placeholder="Note title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
         />

         <textarea
            placeholder="Write your note here..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
         />

         <button className="create-btn" onClick={handleCreate}>
            Create Note
         </button>
      </div>
   );
}
