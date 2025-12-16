import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

const router = express.Router();

function signToken(user) {
  return jwt.sign(
    { id: user._id.toString(), role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );
}

function setAuthCookie(res, token) {
  // Works cross-domain with HTTPS (Render)
  res.cookie("token", token, {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    path: "/",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
}

// POST /api/auth/register
router.post("/register", async (req, res) => {
  try {
    const { name, email, phone, password } = req.body || {};

    if (!name || !email || !password) {
      return res
        .status(400)
        .json({ message: "name, email, password are required" });
    }

    const emailLower = email.toLowerCase().trim();

    const exists = await User.findOne({ email: emailLower });
    if (exists)
      return res.status(409).json({ message: "Email already exists" });

    const passwordHash = await bcrypt.hash(password, 10);

    const user = await User.create({
      name: name.trim(),
      email: emailLower,
      phone: (phone || "").trim(),
      passwordHash,
      role: "client",
    });

    const token = signToken(user);
    setAuthCookie(res, token);

    return res.json({
      message: "Registered ✅",
      token, // good for React Native
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    return res
      .status(500)
      .json({ message: err.message || "Registration failed" });
  }
});

// POST /api/auth/login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body || {};

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "email and password are required" });
    }

    const emailLower = email.toLowerCase().trim();

    const user = await User.findOne({ email: emailLower });
    if (!user) return res.status(401).json({ message: "Invalid credentials" });

    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) return res.status(401).json({ message: "Invalid credentials" });

    const token = signToken(user);
    setAuthCookie(res, token);

    return res.json({
      message: "Logged in ✅",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    return res.status(500).json({ message: err.message || "Login failed" });
  }
});

// GET /api/auth/me (COOKIE OR BEARER TOKEN)
router.get("/me", async (req, res) => {
  try {
    const authHeader = req.headers.authorization || "";
    const bearerToken = authHeader.startsWith("Bearer ")
      ? authHeader.slice(7)
      : null;

    const cookieToken = req.cookies?.token || null;

    const token = bearerToken || cookieToken;
    if (!token) return res.status(401).json({ message: "Not authenticated" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id).select("name email role");
    if (!user) return res.status(401).json({ message: "Not authenticated" });

    return res.json({ user });
  } catch (err) {
    return res.status(401).json({ message: "Not authenticated" });
  }
});

// POST /api/auth/logout
router.post("/logout", (req, res) => {
  res.cookie("token", "", {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    path: "/",
    expires: new Date(0),
  });

  res.json({ message: "Logged out ✅" });
});

export default router;
