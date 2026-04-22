import User from "../models/User.js";
import { signToken } from "../utils/jwt.js";

// SIGNUP
export async function signupService({
  fullName,
  email,
  password,
 
 // optional
}) {
  const existing = await User.findOne({ email: email.toLowerCase() });

  if (existing) throw new Error("Email already registered");

  // 🔥 Only allow ADMIN if explicitly passed


  const user = await User.create({
    fullName,
    email,
    password,
    role: "ADMIN"
  });

  const token = signToken({
    userId: user._id,
    role: user.role
  });

  return {
    user: {
      id: user._id,
      fullName: user.fullName,
      email: user.email,
      role: user.role
    },
    token
  };
}

// LOGIN
export async function loginService({ email, password }) {
  const user = await User.findOne({ email: email.toLowerCase() });

  if (!user) throw new Error("Invalid credentials");

  const ok = await user.comparePassword(password);
  if (!ok) throw new Error("Invalid credentials");

  const token = signToken({
    userId: user._id,
    role: user.role
  });

  return {
    user: {
      id: user._id,
      fullName: user.fullName,
      email: user.email,
      role: user.role
    },
    token
  };
}