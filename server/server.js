require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 8000;

// CONNECT DB
connectDB(process.env.MONGODB_URI || "mongodb://localhost:27017/notes_app");

// MIDDLEWARES
app.use(express.json());
app.use(cors({
   origin: [
      "http://localhost:3000", // CRA
      "http://localhost:5173"  // Vite (current dev frontend)
   ],
   methods: ["GET", "POST", "PUT", "DELETE"]
}));

// ROUTES
app.use("/api/notes", require("./routes/notes.route"));

// (Optional) Test route
app.get("/api", (req, res) => res.send("Notes API is running"));


// SERVE REACT FRONTEND IN PRODUCTION
if (process.env.NODE_ENV === "production") {
   const frontendPath = path.join(__dirname, "../client/dist");
   app.use(express.static(frontendPath));

   // For any non-API route, serve the React index.html
   app.get("*", (req, res) => {
      res.sendFile(path.join(frontendPath, "index.html"));
   });
}


// ERROR HANDLING
app.use((err, req, res, next) => {
   console.error(err.stack);
   res.status(500).json({ message: "Something went wrong" });
});

app.listen(PORT, () => console.log(`🚀 Server started on port ${PORT}`));

