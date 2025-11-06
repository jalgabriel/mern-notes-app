import { Link } from "react-router-dom";

export default function NoteCard({ note }) {
   return (
      <div className="note-card">
         <div className="note-content">
            <h3>{note.title}</h3>
            <small className="note-date">{note.date}</small>
            <p>{note.content.slice(0, 80)}...</p>
         </div>

         <div className="card-actions">
            <Link to={`/note/${note.id}`} className="edit-btn">
               View
            </Link>
         </div>
      </div>
   );
}

