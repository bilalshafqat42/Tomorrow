// backend/index.js
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import path from "path";
import fs from "fs";

import authRoutes from "./routes/auth.js";
import uploadRoutes from "./routes/upload.js";
import projectsRouter from "./routes/projects.js";
import unitInventoryRoutes from "./routes/unitInventory.routes.js";
import listingRoutes from "./routes/listings.js";
import propertyTypeRoutes from "./routes/propertyTypes.js";

dotenv.config();

const app = express();

// ✅ Required on Render / behind proxy (secure cookies)
app.set("trust proxy", 1);

/**
 * Upload directories (single source of truth)
 * process.cwd() works well for your repo structure on local + Render
 */
const ROOT_DIR = process.cwd();
const UPLOAD_DIR = path.join(ROOT_DIR, "uploads");
const AVATAR_DIR = path.join(UPLOAD_DIR, "avatars");
const PROJECTS_DIR = path.join(UPLOAD_DIR, "projects");

// ✅ Ensure upload folders exist (avoid runtime crashes)
fs.mkdirSync(AVATAR_DIR, { recursive: true });
fs.mkdirSync(PROJECTS_DIR, { recursive: true });

/**
 * ✅ Frontend URL (web app)
 * Put your Vercel URL or web URL here in env if needed
 */
const FRONT_URL = process.env.FRONT_URL || "https://tomorrow-app.onrender.com";

/**
 * ✅ Extra origins (optional)
 * EXTRA_ORIGINS=https://example.com,http://localhost:19006
 */
const EXTRA_ORIGINS = (process.env.EXTRA_ORIGINS || "")
  .split(",")
  .map((s) => s.trim())
  .filter(Boolean);

/**
 * ✅ Allowed Origins
 * - Web app
 * - Expo dev / localhost
 * - Optional extras
 */
const ALLOWED_ORIGINS = [
  FRONT_URL,
  FRONT_URL.replace("https://", "http://"),

  // ✅ Remove wrong "www." host (Render normally doesn't use www subdomain)
  // "https://www.tomorrow-app.onrender.com",

  // Expo dev / localhost
  "http://localhost:19000",
  "http://localhost:19006",
  "http://localhost:8081",
  "http://127.0.0.1:19000",
  "http://127.0.0.1:19006",
  "http://127.0.0.1:8081",

  ...EXTRA_ORIGINS,
];

// ✅ CORS
app.use(
  cors({
    origin: (origin, cb) => {
      // ✅ Mobile apps / Postman / server-to-server can have NO Origin header
      if (!origin) return cb(null, true);

      if (ALLOWED_ORIGINS.includes(origin)) return cb(null, true);

      // ✅ Dev convenience: allow any Expo origin (optional)
      // If you want stricter, remove this block.
      if (origin.includes("exp://") || origin.includes("expo.dev")) {
        return cb(null, true);
      }

      return cb(new Error("Not allowed by CORS: " + origin));
    },
    credentials: true,
    methods: ["GET", "POST", "PATCH", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

// ✅ Parsers
app.use(express.json({ limit: "10mb" }));
app.use(cookieParser());

// ✅ Static serve uploads
// Example:
// https://YOUR_BACKEND_DOMAIN/uploads/projects/tomorrow-166/hero.jpg
app.use("/uploads", express.static(UPLOAD_DIR));

// ✅ Health check
app.get("/", (req, res) => res.json({ message: "Backend is working ✅" }));

// ✅ Routes
app.use("/api/auth", authRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/projects", projectsRouter);
app.use("/api/units", unitInventoryRoutes);
app.use("/api/listings", listingRoutes);
app.use("/api/property-types", propertyTypeRoutes);

// ✅ Helpful error handler for CORS (so it doesn't look like random crash)
app.use((err, req, res, next) => {
  if (err?.message?.startsWith("Not allowed by CORS")) {
    return res.status(403).json({ ok: false, message: err.message });
  }
  return next(err);
});

// ✅ Start server
const PORT = process.env.PORT || 4000;

async function start() {
  try {
    if (!process.env.MONGO_URI) {
      console.error("MongoDB error ❌ MONGO_URI missing");
      process.exit(1);
    }
    if (!process.env.JWT_SECRET) {
      console.error("JWT error ❌ JWT_SECRET missing");
      process.exit(1);
    }

    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB connected ✅");

    app.listen(PORT, () => console.log(`Server running on port ${PORT} ✅`));
  } catch (err) {
    console.error("MongoDB connection error ❌", err.message);
    process.exit(1);
  }
}

start();
