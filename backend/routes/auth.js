import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

const router = express.Router();

/**
 * Helpers
 */
function normalizeEmail(email) {
  return String(email || "")
    .trim()
    .toLowerCase();
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function signToken(user) {
  return jwt.sign(
    { id: user._id.toString(), role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );
}

function setAuthCookie(res, token) {
  // Web: cross-domain cookie for Render (HTTPS)
  res.cookie("token", token, {
    httpOnly: true,
    secure: true, // must be true on Render (https)
    sameSite: "none", // allow cross-site cookie
    path: "/",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
}

function clearAuthCookie(res) {
  res.cookie("token", "", {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    path: "/",
    expires: new Date(0),
  });
}

function getTokenFromRequest(req) {
  // Mobile (Bearer) OR Web (cookie)
  const auth = req.headers.authorization || "";
  const bearer = auth.startsWith("Bearer ") ? auth.slice(7) : null;
  const cookieToken = req.cookies?.token || null;
  return bearer || cookieToken || null;
}

/**
 * ✅ POST /api/auth/register
 * Works for BOTH:
 * - Web: sets cookie
 * - Mobile: returns token
 */
router.post("/register", async (req, res) => {
  try {
    const name = String(req.body?.name || "").trim();
    const email = normalizeEmail(req.body?.email);
    const phone = String(req.body?.phone || "").trim();
    const password = String(req.body?.password || "");

    if (!name || !email || !password) {
      return res.status(400).json({
        message: "name, email, password are required",
      });
    }

    if (!isValidEmail(email)) {
      return res.status(400).json({ message: "Please enter a valid email" });
    }

    if (password.length < 6) {
      return res
        .status(400)
        .json({ message: "Password must be at least 6 characters" });
    }

    const exists = await User.findOne({ email });
    if (exists)
      return res.status(409).json({ message: "Email already exists" });

    const passwordHash = await bcrypt.hash(password, 10);

    // Default role: client (you can change later)
    const user = await User.create({
      name,
      email,
      phone,
      passwordHash,
      role: "client",
    });

    const token = signToken(user);
    setAuthCookie(res, token);

    return res.json({
      message: "Registered ✅",
      token, // ✅ mobile will store this
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
      },
    });
  } catch (err) {
    return res.status(500).json({
      message: err.message || "Registration failed",
    });
  }
});

/**
 * ✅ POST /api/auth/login
 * Works for BOTH:
 * - Web: sets cookie
 * - Mobile: returns token
 */
router.post("/login", async (req, res) => {
  try {
    const email = normalizeEmail(req.body?.email);
    const password = String(req.body?.password || "");

    if (!email || !password) {
      return res.status(400).json({
        message: "email and password are required",
      });
    }

    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ message: "Invalid credentials" });

    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) return res.status(401).json({ message: "Invalid credentials" });

    const token = signToken(user);
    setAuthCookie(res, token);

    return res.json({
      message: "Logged in ✅",
      token, // ✅ mobile will store this
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
      },
    });
  } catch (err) {
    return res.status(500).json({
      message: err.message || "Login failed",
    });
  }
});

/**
 * ✅ GET /api/auth/me
 * Works for BOTH:
 * - Web: reads cookie
 * - Mobile: reads Bearer token
 */
router.get("/me", async (req, res) => {
  try {
    const token = getTokenFromRequest(req);
    if (!token) return res.status(401).json({ message: "Not authenticated" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id).select(
      "name email phone role"
    );
    if (!user) return res.status(401).json({ message: "Not authenticated" });

    return res.json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
      },
    });
  } catch (err) {
    return res.status(401).json({ message: "Not authenticated" });
  }
});

/**
 * ✅ POST /api/auth/logout
 * Web: clears cookie
 * Mobile: you just delete token locally
 */
router.post("/logout", (req, res) => {
  clearAuthCookie(res);
  return res.json({ message: "Logged out ✅" });
});

export default router;
