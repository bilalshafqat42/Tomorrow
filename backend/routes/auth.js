import express from "express";
import bcrypt from "bcryptjs";
import User from "../models/User.js";
import { signToken } from "../utils/jwt.js";
import { requireAuth } from "../middleware/auth.js";

const router = express.Router();

// helper: cookie options
function cookieOptions() {
  const isProd = process.env.NODE_ENV === "production";
  return {
    httpOnly: true,
    secure: isProd, // true on https
    sameSite: isProd ? "none" : "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  };
}

// POST /api/auth/register
router.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password)
      return res.status(400).json({ message: "All fields are required" });

    const exists = await User.findOne({ email: email.toLowerCase() });
    if (exists)
      return res.status(409).json({ message: "Email already exists" });

    const passwordHash = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, passwordHash });

    const token = signToken(user._id.toString());
    res.cookie("token", token, cookieOptions());

    return res.json({
      user: { id: user._id, name: user.name, email: user.email },
    });
  } catch (e) {
    return res.status(500).json({ message: "Server error", error: e.message });
  }
});

// POST /api/auth/login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password)
      return res.status(400).json({ message: "Email and password required" });

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) return res.status(401).json({ message: "Invalid credentials" });

    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) return res.status(401).json({ message: "Invalid credentials" });

    const token = signToken(user._id.toString());
    res.cookie("token", token, cookieOptions());

    return res.json({
      user: { id: user._id, name: user.name, email: user.email },
    });
  } catch (e) {
    return res.status(500).json({ message: "Server error", error: e.message });
  }
});

// GET /api/auth/me (token check)
router.get("/me", requireAuth, async (req, res) => {
  const user = await User.findById(req.userId).select("_id name email");
  return res.json({ user });
});

// POST /api/auth/logout
router.post("/logout", (req, res) => {
  res.clearCookie("token", cookieOptions());
  return res.json({ message: "Logged out" });
});

export default router;
