import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import authRoutes from "./routes/auth.routes.js";
import mainRoutes from "./routes/index.js";
import cookieParser from "cookie-parser";


const app = express();



app.use(cors({
  origin: [
    "http://localhost:3000",
    "https://your-frontend-domain.vercel.app"
  ],
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

app.options("*", cors());

app.use(cookieParser());
app.use(express.json());
// ✅ Auth routes
app.use("/api/auth", authRoutes);

// ✅ All other routes
app.use("/api", mainRoutes);
// Health check
app.get("/api/health", (_req, res) => {
  const states = ["disconnected", "connected", "connecting", "disconnecting"];
  res.status(200).json({
    ok: true,
    message: "Backend running",
    dbState: states[mongoose.connection.readyState] || "unknown"
  });
});

export default app;