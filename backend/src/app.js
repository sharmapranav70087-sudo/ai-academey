import dotenv from "dotenv";
import express from "express";
import mongoose from "mongoose";
import cors from "cors";

dotenv.config();

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

const PORT = process.env.PORT || 8080;

mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("Mongo connected");

    app.listen(PORT, () => {
      console.log(`Server running on ${PORT}`);
    });
  })
  .catch((err) => {
    console.error(err);
  });
export default app;
