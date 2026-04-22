import serverless from "serverless-http";
import app from "../backend/src/app.js";
import { connectDB } from "../backend/src/config/db.js";

let isConnected = false;

async function connect() {
  if (isConnected) return;

  await connectDB();
  isConnected = true;
}

export default async function handler(req, res) {
  await connect();
  return serverless(app)(req, res);
}
