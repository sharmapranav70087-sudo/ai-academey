import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import authRoutes from "./routes/auth.routes.js";
import mainRoutes from "./routes/index.js";
import cookieParser from "cookie-parser";

const app = express();

const corsOptions = {
  origin: [
    "http://localhost:3000",
    "http://localhost:5173",
    "https://your-frontend-domain.vercel.app"
  ],
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
};

app.use(cors(corsOptions));

app.options("*", cors(corsOptions));

app.use(cookieParser());
app.use(express.json());

app.use("/api/auth", authRoutes);

app.use("/api", mainRoutes);

app.get("/api/health", (_req, res) => {
  const states = ["disconnected", "connected", "connecting", "disconnecting"];

  res.status(200).json({
    ok: true,
    message: "Backend running",
    dbState: states[mongoose.connection.readyState] || "unknown"
  });
});

export default app;