import jwt from "jsonwebtoken";
import { env } from "../config/env.js";

export function signToken(payload) {
  return jwt.sign(payload, env.jwt_Secret, { expiresIn: "7d" });
}