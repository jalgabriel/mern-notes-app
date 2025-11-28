import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";

import Navbar from "./components/Navbar.jsx";
import Home from "./pages/Home.jsx";
import NoteDetail from "./pages/NoteDetail.jsx";
import CreateNote from "./pages/CreateNote.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import "./App.css";
import "./styles/responsive.css";

export default function App() {
   return (
      <AuthProvider>
         <Router>
            <div className="app-container">
               <Navbar />

               <ToastContainer position="top-center" autoClose={2000} />

               <Routes>
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />

                  <Route
                     path="/"
                     element={
                        <ProtectedRoute>
                           <Home />
                        </ProtectedRoute>
                     }
                  />

                  <Route
                     path="/note/:id"
                     element={
                        <ProtectedRoute>
                           <NoteDetail />
                        </ProtectedRoute>
                     }
                  />

                  <Route
                     path="/create"
                     element={
                        <ProtectedRoute>
                           <CreateNote />
                        </ProtectedRoute>
                     }
                  />
               </Routes>
            </div>
            
            
         </Router>
      </AuthProvider>
   );
}
