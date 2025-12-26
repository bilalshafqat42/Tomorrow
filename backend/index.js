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

dotenv.config();

const app = express();

// ✅ Required on Render / behind proxy (secure cookies)
app.set("trust proxy", 1);

/**
 * ✅ Frontend URL (web app)
 * Example: https://tomorrow-app.onrender.com
 */
const FRONT_URL = process.env.FRONT_URL || "https://tomorrow-app.onrender.com";

/**
 * ✅ Allowed Origins
 * Add Expo dev URLs later if needed (while testing locally)
 */
const ALLOWED_ORIGINS = [
  FRONT_URL,
  FRONT_URL.replace("https://", "http://"),
  "https://www.tomorrow-app.onrender.com",
];

// ✅ CORS
app.use(
  cors({
    origin: (origin, cb) => {
      // allow Postman / server-to-server / some mobile requests (no origin)
      if (!origin) return cb(null, true);

      if (ALLOWED_ORIGINS.includes(origin)) return cb(null, true);

      return cb(new Error("Not allowed by CORS: " + origin));
    },
    credentials: true,
    methods: ["GET", "POST", "PATCH", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// ✅ Parsers
app.use(express.json({ limit: "10mb" }));
app.use(cookieParser());

// ✅ Upload folder create + static serve
const ROOT_DIR = path.resolve();
const UPLOAD_DIR = path.join(ROOT_DIR, "uploads");
if (!fs.existsSync(UPLOAD_DIR)) fs.mkdirSync(UPLOAD_DIR, { recursive: true });

// Public access:
// https://tomorrow-main.onrender.com/uploads/avatars/<file>
app.use("/uploads", express.static(UPLOAD_DIR));

// ✅ Health check
app.get("/", (req, res) => res.json({ message: "Backend is working ✅" }));

// ✅ Routes
app.use("/api/auth", authRoutes);
app.use("/api/upload", uploadRoutes);

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
