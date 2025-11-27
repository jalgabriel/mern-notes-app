import { Link } from "react-router-dom";
import { useState } from "react";

export default function SearchBar({ onSearch }) {
   const [query, setQuery] = useState("");

   const handleChange = (e) => {
      const value = e.target.value;
      setQuery(value);
      onSearch(value);
   };

   return (
      <div className="searchbar">
         <input
         type="text"
         placeholder="Search notes..."
         value={query}
         onChange={handleChange}
         />

         <Link to="/create" className="new-note-btn">
            + New Note
         </Link>
      </div>
   );
}
