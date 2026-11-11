const express = require("express");
const path = require("path");
const cors = require("cors");
const exportRoutes = require("./routes/exportRoutes");
const authRoutes = require("./routes/authRoutes");
const session = require("express-session");

const app = express();

app.use(express.json());
app.use(cors());

// Memory session store
app.use(
  session({
    secret: process.env.SESSION_SECRET || "ocp_session_secret_2026",
    resave: false,
    saveUninitialized: false,
  })
);

// API Routes
app.use("/api/exports", exportRoutes);
app.use("/api", exportRoutes);
app.use("/api/auth", authRoutes);

// Health check endpoint for deployment platforms (Render, Railway, AWS, Docker, etc.)
app.get("/health", (req, res) => {
  res.status(200).json({ status: "OK", uptime: process.uptime(), timestamp: new Date() });
});

// Serve frontend static build in production if dist exists
const frontendDistPath = path.join(__dirname, "../frontend/dist");
app.use(express.static(frontendDistPath));

// SPA Fallback for Express 5
app.use((req, res, next) => {
  if (req.method === "GET" && !req.path.startsWith("/api")) {
    return res.sendFile(path.join(frontendDistPath, "index.html"), (err) => {
      if (err) next();
    });
  }
  next();
});

module.exports = app;
