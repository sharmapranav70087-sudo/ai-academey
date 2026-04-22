import express from "express";
import cors from "cors";

const app = express();

app.use(cors());

app.get("/", (req, res) => {
  res.send("working");
});

app.get("/api/health", (req, res) => {
  res.json({
    ok: true
  });
});

export default app;
