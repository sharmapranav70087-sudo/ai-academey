export function requireAdmin(req, res, next) {
  if (!req.user || req.user.role !== "ADMIN") {
    return res.status(403).json({ ok: false, message: "Forbidden: ADMIN only" });
  }
  return next();
}
