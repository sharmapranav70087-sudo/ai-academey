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

    // ✅ FIXED: Updated for Cross-Origin (Local Frontend -> Railway Backend)
    res.cookie("token", data.token, {
      httpOnly: true,
      secure: true,      // Must be true for HTTPS (Railway)
      sameSite: "none",  // Must be "none" to allow cross-site cookies
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      path: "/",         // Available across all routes
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
    // req.user is attached by the authMiddleware (which reads the cookie)
    const user = req.user;
    
    if (!user) {
        return res.status(401).json({ ok: false, message: "Unauthorized" });
    }

    return res.status(200).json({
      ok: true,
      data: { // Wrapped in data to match your Dashboard frontend expectation
        user: {
          id: user.id,
          fullName: user.fullName || user.name, // Matches your frontend userName logic
          email: user.email,
          role: user.role || "User",
        }
      }
    });
  } catch (e) {
    return res.status(500).json({ ok: false, message: "Failed to fetch profile" });
  }
}
