// import { Link } from "react-router-dom";
import { useState, useEffect } from "react";

import NoteCard from "../components/NotesCard.jsx";
import SearchBar from "../components/SearchBar.jsx";
import { getNotes } from "../services/api.js";

export default function Home() {
   const [notes, setNotes] = useState([]);
   const [filtered, setFiltered] = useState([]);
   const [loading, setLoading] = useState(true);

   useEffect(() => {
      getNotes()
         .then(data => {
            setNotes(data);
            setFiltered(data);
         })
         .finally(() => setLoading(false)); // hide spinner when done
   }, []);

   const handleSearch = (query) => {
      if (!query) {
         setFiltered(notes);
         return;
      }
      const lower = query.toLowerCase();
      const results = notes.filter(
         (n) =>
            n.title.toLowerCase().includes(lower) ||
            n.content.toLowerCase().includes(lower)
      );
      setFiltered(results);
   };

   return (
      <div className="home">
         <header>
            <h1>Notes</h1>
            {/* <Link to="/create" className="new-note-btn">
               + New Note
            </Link> */}
         </header>

         <SearchBar onSearch={handleSearch} />

         {/* Show spinner while loading */}
         {loading ? (
            <div className="spinner-container">
               <div className="spinner"></div>
            </div>
         ) : (
            <div className="notes-grid">
               {filtered.length ? (
                  filtered.map((note) => <NoteCard key={note.id} note={note} />)
               ) : (
                  <p className="no-notes">No notes found.</p>
               )}
            </div>
         )}
      </div>
   );
}
