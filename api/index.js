import serverless from "serverless-http";
import dotenv from "dotenv";
import app from "../backend/src/app.js";
import { connectDB } from "../backend/src/config/db.js";

dotenv.config();

await connectDB();

export default serverless(app);