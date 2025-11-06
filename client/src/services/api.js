// CONNECTING TO API
const API_URL = import.meta.env.VITE_API_URL || "/api";

export async function getNotes() {
   const res = await fetch(`${API_URL}/notes`);
   return res.json();
}

export async function getNote(id) {
   const res = await fetch(`${API_URL}/notes/${id}`);
   return res.json();
}

export async function createNote(data) {
   const res = await fetch(`${API_URL}/notes`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
   });
   return res.json();
}

export async function updateNote(id, data) {
   const res = await fetch(`${API_URL}/notes/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
   });
   return res.json();
}

export async function deleteNote(id) {
   await fetch(`${API_URL}/notes/${id}`, { method: "DELETE" });
}
