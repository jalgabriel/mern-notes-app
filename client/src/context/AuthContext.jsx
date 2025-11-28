// /context/AuthContext.jsx
import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();
const API = import.meta.env.VITE_API_URL || "/api";

export function AuthProvider({ children }) {
   const [user, setUser] = useState(null);
   const [loading, setLoading] = useState(true);

   useEffect(() => {
      const storedUser = localStorage.getItem("user");
      const token = localStorage.getItem("accessToken");
      if (storedUser) setUser(JSON.parse(storedUser));
      if (!storedUser && token) {
         // optional: you might attempt refresh here
      }
      setLoading(false);
   }, []);

   const login = async (email, password) => {
      const res = await fetch(`${API}/auth/login`, {
         method: "POST",
         credentials: "include",
         headers: { "Content-Type": "application/json" },
         body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Login failed");

      // store both user and access token
      localStorage.setItem("user", JSON.stringify(data.user));
      localStorage.setItem("accessToken", data.accessToken);

      setUser(data.user);
      return data;
   };

   const register = async (email, password) => {
      const res = await fetch(`${API}/auth/register`, {
         method: "POST",
         credentials: "include",
         headers: { "Content-Type": "application/json" },
         body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Registration failed");
      return data;
   };

   const logout = async () => {
      await fetch(`${API}/auth/logout`, {
         method: "POST",
         credentials: "include",
      }).catch(() => {}); // ignore errors
      localStorage.removeItem("user");
      localStorage.removeItem("accessToken");
      setUser(null);
   };

   return (
      <AuthContext.Provider value={{ user, setUser, login, register, logout, loading }}>
         {children}
      </AuthContext.Provider>
   );
}

export function useAuth() {
   return useContext(AuthContext);
}
