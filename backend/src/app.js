import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";

import authRoutes from "./routes/auth.routes.js";
import mainRoutes from "./routes/index.js";

const app = express();

app.use(cors({
  origin: [
    "http://localhost:3000",
    "http://localhost:5173"
  ],
  credentials: true
}));

app.use(express.json());
app.use(cookieParser());

app.get("/", (req, res) => {
  res.send("Backend running");
});

app.get("/api/health", (_req, res) => {
  const states = [
    "disconnected",
    "connected",
    "connecting",
    "disconnecting"
  ];

  res.json({
    ok: true,
    dbState: states[mongoose.connection.readyState]
  });
});

app.use("/api/auth", authRoutes);
app.use("/api", mainRoutes);

export default app;
