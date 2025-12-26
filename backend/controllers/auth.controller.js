import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

/* ================= HELPERS ================= */

const normalizeEmail = (email) =>
  String(email || "")
    .trim()
    .toLowerCase();

const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

const normalizeLanguage = (lang) => String(lang || "").trim() || "English";

const isLikelyUrl = (str) => {
  const v = String(str || "").trim();
  if (!v) return true;
  return /^https?:\/\/.+/i.test(v);
};

const signToken = (user) =>
  jwt.sign(
    { id: user._id.toString(), role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );

const setAuthCookie = (res, token) => {
  res.cookie("token", token, {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    path: "/",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
};

const clearAuthCookie = (res) => {
  res.cookie("token", "", {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    path: "/",
    expires: new Date(0),
  });
};

const getTokenFromRequest = (req) => {
  const auth = req.headers.authorization || "";
  const bearer = auth.startsWith("Bearer ") ? auth.slice(7) : null;
  return bearer || req.cookies?.token || null;
};

/* ================= CONTROLLERS ================= */

// POST /api/auth/register
export const register = async (req, res) => {
  try {
    const name = String(req.body?.name || "").trim();
    const email = normalizeEmail(req.body?.email);
    const phone = String(req.body?.phone || "").trim();
    const address = String(req.body?.address || "").trim();
    const image = String(req.body?.image || "").trim();
    const language = normalizeLanguage(req.body?.language);
    const password = String(req.body?.password || "");

    if (!name || !email || !password) {
      return res
        .status(400)
        .json({ message: "name, email, password are required" });
    }

    if (!isValidEmail(email)) {
      return res.status(400).json({ message: "Invalid email format" });
    }

    if (password.length < 6) {
      return res
        .status(400)
        .json({ message: "Password must be at least 6 characters" });
    }

    if (!isLikelyUrl(image)) {
      return res.status(400).json({ message: "Image must be a valid URL" });
    }

    const exists = await User.findOne({ email });
    if (exists) {
      return res.status(409).json({ message: "Email already exists" });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      phone,
      address,
      image,
      language,
      passwordHash,
      role: "client", // 🔒 forced
    });

    const token = signToken(user);
    setAuthCookie(res, token);

    return res.json({
      message: "Registered ✅",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        address: user.address,
        image: user.image,
        language: user.language,
        role: user.role,
      },
    });
  } catch (err) {
    return res
      .status(500)
      .json({ message: err.message || "Registration failed" });
  }
};

// POST /api/auth/login
export const login = async (req, res) => {
  try {
    const email = normalizeEmail(req.body?.email);
    const password = String(req.body?.password || "");

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "email and password are required" });
    }

    // 🔴 IMPORTANT FIX HERE
    const user = await User.findOne({ email }).select("+passwordHash");
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = signToken(user);
    setAuthCookie(res, token);

    return res.json({
      message: "Logged in ✅",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        address: user.address,
        image: user.image,
        language: user.language,
        role: user.role,
      },
    });
  } catch (err) {
    return res.status(500).json({ message: err.message || "Login failed" });
  }
};

// GET /api/auth/me
export const me = async (req, res) => {
  try {
    const token = getTokenFromRequest(req);
    if (!token) return res.status(401).json({ message: "Not authenticated" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id).select(
      "name email phone address image language role"
    );

    if (!user) return res.status(401).json({ message: "Not authenticated" });

    return res.json({ user });
  } catch {
    return res.status(401).json({ message: "Not authenticated" });
  }
};

// POST /api/auth/logout
export const logout = async (req, res) => {
  clearAuthCookie(res);
  return res.json({ message: "Logged out ✅" });
};

// PATCH /api/auth/me
export const updateMe = async (req, res) => {
  try {
    const token = getTokenFromRequest(req);
    if (!token) return res.status(401).json({ message: "Not authenticated" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // only allow these fields from client
    const name = String(req.body?.name || "").trim();
    const phone = String(req.body?.phone || "").trim();
    const address = String(req.body?.address || "").trim();
    const language = normalizeLanguage(req.body?.language);
    const image = String(req.body?.image || "").trim();

    if (image && !isLikelyUrl(image)) {
      return res.status(400).json({ message: "Image must be a valid URL" });
    }

    const user = await User.findByIdAndUpdate(
      decoded.id,
      {
        ...(name ? { name } : {}),
        phone,
        address,
        language,
        image,
      },
      { new: true }
    ).select("name email phone address image language role");

    return res.json({ user });
  } catch (err) {
    return res.status(401).json({ message: "Not authenticated" });
  }
};
