// /components/Navbar.jsx
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

export default function Navbar() {
   const { user, logout } = useAuth();

   return (
      <nav className="navbar home">
         <Link 
            to="/" 
            className="logo"
         >
            <h1>Notes</h1>
         </Link>

         <div className="nav-links">
            {user ? (
               <>
                  <span className="user-email">{user.email}</span>
                  <button onClick={logout} className="logout-btn">Logout</button>
               </>
            ) : (
               <Link to="/login" className="login-btn">Login</Link>
            )}
         </div>
      </nav>
   );
}
