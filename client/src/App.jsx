import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Home from "./pages/Home.jsx";
import NoteDetail from "./pages/NoteDetail.jsx";
import CreateNote from "./pages/CreateNote.jsx";
import "./App.css";
import "./styles/responsive.css";

export default function App() {
   return (
      <Router>
         <div className="app-container">
            <ToastContainer position="top-center" autoClose={2000} />
            <Routes>
               <Route path="/" element={<Home />} />
               <Route path="/note/:id" element={<NoteDetail />} />
               <Route path="/create" element={<CreateNote />} />
            </Routes>
         </div>
      </Router>
   );
}
