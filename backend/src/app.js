import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";

// Route Imports
import authRoutes from "./routes/auth.routes.js";
import mainRoutes from "./routes/index.js";

const app = express();

// 1. Permissive CORS Configuration
const allowedOrigins = [
  "http://localhost:3000",
  "http://localhost:5173",
  "https://ai-academy-29p9.vercel.app",
  "https://ai-academey-29p9.vercel.app" // Added in case of typo
];

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl)
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With", "Accept"],
  optionsSuccessStatus: 200 
}));

// 2. Global Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// 3. Health Check (Crucial for Railway)
app.get("/api/health", (req, res) => {
  res.status(200).json({
    status: "online",
    dbState: mongoose.connection.readyState === 1 ? "connected" : "disconnected"
  });
});

// 4. API Routes
app.use("/api/auth", authRoutes);
app.use("/api", mainRoutes);

// 5. 404 Handler
app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});

export default app;
