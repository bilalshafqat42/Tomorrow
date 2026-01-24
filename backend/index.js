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
import listingRoutes from "./routes/listings.js"; // ✅ single import
import propertyTypeRoutes from "./routes/propertyTypes.js";

dotenv.config();

const app = express();

// ✅ Required on Render / behind proxy (secure cookies)
app.set("trust proxy", 1);

/**
 * Upload directories (single source of truth)
 * IMPORTANT: process.cwd() is stable for your current setup
 */
const ROOT_DIR = process.cwd();
const UPLOAD_DIR = path.join(ROOT_DIR, "uploads");
const AVATAR_DIR = path.join(UPLOAD_DIR, "avatars");

// ✅ Ensure upload folders exist
fs.mkdirSync(AVATAR_DIR, { recursive: true });

/**
 * ✅ Frontend URL (web app)
 */
const FRONT_URL = process.env.FRONT_URL || "https://tomorrow-app.onrender.com";

/**
 * ✅ Extra origins (optional)
 * Add comma-separated origins in env if needed:
 * EXTRA_ORIGINS=https://example.com,http://localhost:19006
 */
const EXTRA_ORIGINS = (process.env.EXTRA_ORIGINS || "")
  .split(",")
  .map((s) => s.trim())
  .filter(Boolean);

/**
 * ✅ Allowed Origins
 * - Web app
 * - Optional extras
 * - Expo dev URLs (common)
 */
const ALLOWED_ORIGINS = [
  FRONT_URL,
  FRONT_URL.replace("https://", "http://"),
  "https://www.tomorrow-app.onrender.com",

  // Expo dev / localhost (safe for development)
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
      // ✅ allow Postman / server-to-server / many mobile requests (no Origin header)
      if (!origin) return cb(null, true);

      if (ALLOWED_ORIGINS.includes(origin)) return cb(null, true);

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
// Public access:
// https://tomorrow-main.onrender.com/uploads/avatars/<file>
app.use("/uploads", express.static(UPLOAD_DIR));

// ✅ Health check
app.get("/", (req, res) => res.json({ message: "Backend is working ✅" }));

// ✅ Routes
app.use("/api/auth", authRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/projects", projectsRouter);
app.use("/api/units", unitInventoryRoutes);
app.use("/api/listings", listingRoutes); // ✅ uses the same name
app.use("/api/property-types", propertyTypeRoutes);

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
