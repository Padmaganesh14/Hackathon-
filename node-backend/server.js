require("dotenv").config({ path: __dirname + "/.env" });

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");

const app = express();

/*
  Allowed frontend URLs

  Local development:
  http://localhost:4028

  Production:
  Your Vercel URL from Render environment variable CORS_ORIGIN
*/
const allowedOrigins = [
  "http://localhost:4028",
  process.env.CORS_ORIGIN,
].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests without Origin header:
      // Postman, curl, Render health check, server-to-server requests
      if (!origin) {
        return callback(null, true);
      }

      // Allow local frontend and deployed Vercel frontend
      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      console.log("CORS blocked:", origin);

      return callback(new Error(`CORS blocked for origin: ${origin}`));
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Allows JSON request body up to 10 MB
app.use(express.json({ limit: "10mb" }));

// Health endpoint for Render deployment test
app.get("/health", (_req, res) => {
  res.status(200).json({
    ok: true,
    message: "PortAID API is running",
  });
});

// API routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);

// Route not found handler
app.use((req, res) => {
  res.status(404).json({
    message: `Route not found: ${req.method} ${req.originalUrl}`,
  });
});

// Error handler
app.use((err, _req, res, _next) => {
  console.error("Server error:", err.message);

  res.status(500).json({
    message: err.message || "Internal server error",
  });
});

// Start server and connect MongoDB
const startServer = async () => {
  try {
    if (!process.env.MONGO_URI) {
      throw new Error("MONGO_URI is missing in .env or Render environment variables");
    }

    await mongoose.connect(process.env.MONGO_URI);

    console.log("MongoDB connected successfully");

    // Render automatically provides PORT
    const port = process.env.PORT || 5000;

    app.listen(port, "0.0.0.0", () => {
      console.log(`Server running on port ${port}`);
      console.log(`Health check: http://localhost:${port}/health`);
    });
  } catch (error) {
    console.error("Server startup failed:", error.message);
    process.exit(1);
  }
};

startServer();
