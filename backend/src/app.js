import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";

import authRoutes from "./routes/auth.routes.js";
import mainRoutes from "./routes/index.js";

const app = express();

// 1. UPDATED CORS CONFIGURATION
const allowedOrigins = [
  "http://localhost:3000",
  "http://localhost:5173",
  "https://ai-academy-29p9.vercel.app",
  "https://ai-academy-opal.vercel.app" // Added based on your screenshot
];

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps)
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error("CORS Error: Origin not allowed"));
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With", "Accept"],
  optionsSuccessStatus: 200 
}));

// 2. MIDDLEWARE
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// 3. API ROUTES
app.use("/api/auth", authRoutes);
app.use("/api", mainRoutes);

// Health Check
app.get("/api/health", (req, res) => {
  res.status(200).json({ status: "ok" });
});

export default app;
