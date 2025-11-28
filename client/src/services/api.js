// // CONNECTING TO API
// const API_URL = import.meta.env.VITE_API_URL || "/api";

// export async function getNotes() {
//    const res = await fetch(`${API_URL}/notes`);
//    return res.json();
// }

// export async function getNote(id) {
//    const res = await fetch(`${API_URL}/notes/${id}`);
//    return res.json();
// }

// export async function createNote(data) {
//    const res = await fetch(`${API_URL}/notes`, {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify(data),
//    });
//    return res.json();
// }

// export async function updateNote(id, data) {
//    const res = await fetch(`${API_URL}/notes/${id}`, {
//       method: "PUT",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify(data),
//    });
//    return res.json();
// }

// export async function deleteNote(id) {
//    await fetch(`${API_URL}/notes/${id}`, { method: "DELETE" });
// }


// CONNECTING TO API
// /services/api.js
const API_URL = import.meta.env.VITE_API_URL || "/api";

let refreshPromise = null; // single-flight refresh

function getAccessToken() {
   return localStorage.getItem("accessToken");
}

function setAccessToken(token) {
   if (token) localStorage.setItem("accessToken", token);
   else localStorage.removeItem("accessToken");
}

function authHeader() {
   const token = getAccessToken();
   return token ? { Authorization: `Bearer ${token}` } : {};
}

async function refreshAccessToken() {
   // single in-flight refresh to avoid multiple calls
   if (refreshPromise) return refreshPromise;

   refreshPromise = (async () => {
      const res = await fetch(`${API_URL}/auth/refresh`, {
         method: "POST",
         credentials: "include", // send refresh cookie
      });

      if (!res.ok) {
         // failed refresh: clear tokens
         setAccessToken(null);
         localStorage.removeItem("user");
         refreshPromise = null;
         throw new Error("Refresh failed");
      }

      const data = await res.json();
      if (!data?.accessToken) {
         setAccessToken(null);
         localStorage.removeItem("user");
         refreshPromise = null;
         throw new Error("No access token returned");
      }

      setAccessToken(data.accessToken);
      // optionally update user info returned by refresh
      if (data.user) localStorage.setItem("user", JSON.stringify(data.user));

      refreshPromise = null;
      return data.accessToken;
   })();

   return refreshPromise;
}

async function request(path, opts = {}, retry = true) {
   const url = `${API_URL}${path.startsWith("/") ? path : `/${path}`}`;
   const options = {
      credentials: "include",
      headers: {
         "Content-Type": "application/json",
         ...authHeader(),
         ...(opts.headers || {}),
      },
      ...opts,
   };

   const res = await fetch(url, options);

   // If unauthorized, try refresh once
   if (res.status === 401 && retry) {
      try {
         await refreshAccessToken();
         // retry original request once with new token
         return request(path, opts, false);
      } catch (err) {
         // refresh failed — rethrow original auth error
         throw new Error("Unauthorized");
      }
   }

   // try to parse JSON safely
   const text = await res.text();
   const data = text ? JSON.parse(text) : null;

   if (!res.ok) {
      const message = (data && data.message) || res.statusText || "Request failed";
      const err = new Error(message);
      err.status = res.status;
      err.data = data;
      throw err;
   }

   return data;
}

/* Exported API convenience functions */

// Notes
export function getNotes() {
   return request("/notes", { method: "GET" });
}

export function getNote(id) {
   return request(`/notes/${id}`, { method: "GET" });
}

export function createNote(data) {
   return request("/notes", {
      method: "POST",
      body: JSON.stringify(data),
   });
}

export function updateNote(id, data) {
   return request(`/notes/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
   });
}

export function deleteNote(id) {
   return request(`/notes/${id}`, { method: "DELETE" });
}

// Expose auth endpoints if you want to call them from other places:
export function apiLogin(email, password) {
   return request("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
   });
}
export function apiRegister(email, password) {
   return request("/auth/register", {
      method: "POST",
      body: JSON.stringify({ email, password }),
   });
}
export function apiLogout() {
   return request("/auth/logout", { method: "POST" });
}
export function apiRefresh() {
   return request("/auth/refresh", { method: "POST" });
}
