// /pages/Login.jsx
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { toast } from "react-toastify";

export default function Login() {
   const { login } = useAuth();
   const [email, setEmail] = useState("");
   const [password, setPassword] = useState("");
   const navigate = useNavigate();

   const handleLogin = async (e) => {
      e.preventDefault();

      try {
         await login(email, password);
         toast.success("Logged in!");
         navigate("/");
      } catch (err) {
         toast.error(err.message);
      }
   };

   return (
      <div className="auth-container">
         <h2>Login</h2>

         <form onSubmit={handleLogin}>
            <input
               type="email"
               placeholder="Email"
               value={email}
               onChange={(e) => setEmail(e.target.value)}
            />

            <input
               type="password"
               placeholder="Password"
               value={password}
               onChange={(e) => setPassword(e.target.value)}
            />

            <button type="submit" className="create-btn">Login</button>
         </form>

         <p>
            Don’t have an account? <Link to="/register">Register</Link>
         </p>
      </div>
   );
}
