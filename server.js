// Load environment variables
import dotenv from "dotenv";
dotenv.config();

// Import Express
import express from "express";
const app = express();

// Middleware to read JSON
app.use(express.json());

// Simple test route
app.get("/", (req, res) => {
  res.send("Server is running on port " + process.env.PORT);
});

// Get PORT from .env
const PORT = process.env.PORT || 4000;

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
