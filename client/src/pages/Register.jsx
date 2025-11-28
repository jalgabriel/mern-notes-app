// /pages/Register.jsx
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { toast } from "react-toastify";

export default function Register() {
   const { register } = useAuth();
   const [email, setEmail] = useState("");
   const [password, setPassword] = useState("");
   const navigate = useNavigate();

   const handleRegister = async (e) => {
      e.preventDefault();

      try {
         await register(email, password);
         toast.success("Registration successful!");
         navigate("/login");
      } catch (err) {
         toast.error(err.message);
      }
   };

   return (
      <div className="auth-container">
         <h2>Create Account</h2>

         <form onSubmit={handleRegister}>
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

            <button type="submit" className="create-btn">Register</button>
         </form>

         <p>
            Already have an account? <Link to="/login">Login</Link>
         </p>
      </div>
   );
}
