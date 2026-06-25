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
  Add your Vercel URL in Render environment variables:
  CORS_ORIGIN=https://your-project.vercel.app
*/
const allowedOrigins = [
  "http://localhost:4028",
  process.env.CORS_ORIGIN,
].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      // Allows Postman, curl, Render health checks, etc.
      if (!origin) {
        return callback(null, true);
      }

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

app.use(express.json({ limit: "10mb" }));

// Root route — opens when you visit your Render backend URL
app.get("/", (_req, res) => {
  res.status(200).json({
    ok: true,
    message: "PortAID API is running successfully",
    healthCheck: "/health",
  });
});

// Health route — use this in Render health check path
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
    ok: false,
    message: `Route not found: ${req.method} ${req.originalUrl}`,
  });
});

// Global error handler
app.use((err, _req, res, _next) => {
  console.error("Server error:", err.message);

  res.status(err.status || 500).json({
    ok: false,
    message: err.message || "Internal server error",
  });
});

// Connect MongoDB and start server
const startServer = async () => {
  try {
    if (!process.env.MONGO_URI) {
      throw new Error(
        "MONGO_URI is missing. Add it in .env locally or Render environment variables."
      );
    }

    await mongoose.connect(process.env.MONGO_URI);

    console.log("MongoDB connected successfully");

    const port = process.env.PORT || 5000;

    app.listen(port, "0.0.0.0", () => {
      console.log(`Server running on port ${port}`);
      console.log(`Local health check: http://localhost:${port}/health`);
    });
  } catch (error) {
    console.error("Server startup failed:", error.message);
    process.exit(1);
  }
};

startServer();
