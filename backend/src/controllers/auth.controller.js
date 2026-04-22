import { signupService, loginService } from "../services/auth.service.js";
import { validateSignup, validateLogin } from "../validators/auth.validator.js";

export async function signupController(req, res) {
  const err = validateSignup(req.body);
  if (err) return res.status(400).json({ ok: false, message: err });

  try {
    const data = await signupService(req.body);
    return res.status(201).json({ ok: true, message: "Signup successful", ...data });
  } catch (e) {
    return res.status(400).json({ ok: false, message: e.message });
  }
}

export async function loginController(req, res) {
  const err = validateLogin(req.body);
  if (err) return res.status(400).json({ ok: false, message: err });

  try {
    const data = await loginService(req.body);

    res.cookie("token", data.token, {
      httpOnly: true,
      secure: false,      // true only on HTTPS
      sameSite: "lax",    // use "none" + secure:true for cross-site HTTPS
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    return res.status(200).json({
      ok: true,
      message: "Login successful",
      user: data.user
    });
  } catch (e) {
    return res.status(401).json({ ok: false, message: e.message });
  }
}

export async function profileController(req, res) {
  try {
    // User data is already attached by authMiddleware
    const user = req.user;
    
    return res.status(200).json({
      ok: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role || "User",
        // Add other profile fields as needed
      }
    });
  } catch (e) {
    return res.status(500).json({ ok: false, message: "Failed to fetch profile" });
  }
}
