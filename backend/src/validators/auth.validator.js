export function validateSignup(body) {
  const { fullName, email, password } = body || {};
  if (!fullName?.trim()) return "Full Name is required";
  if (!email?.trim()) return "Email Address is required";
  if (!password?.trim()) return "Password is required";
  if (password.length < 6) return "Password must be at least 6 characters";
  return null;
}

export function validateLogin(body) {
  const { email, password } = body || {};
  if (!email?.trim()) return "Email is required";
  if (!password?.trim()) return "Password is required";
  return null;
}
