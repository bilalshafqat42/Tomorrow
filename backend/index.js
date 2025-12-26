// index.js
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
 * ✅ Frontend URL (your web app domain)
 * Example: https://tomorrow-app.onrender.com
 */
const FRONT_URL = process.env.FRONT_URL || "https://tomorrow-app.onrender.com";

/**
 * ✅ CORS origins
 * - Keep this strict for production
 * - Add your Expo dev URL if needed while testing
 */
const ALLOWED_ORIGINS = [
  FRONT_URL,
  FRONT_URL.replace("https://", "http://"),
  "https://www.tomorrow-app.onrender.com",
];

// ✅ Middleware: CORS (supports cookies + bearer token)
app.use(
  cors({
    origin: (origin, cb) => {
      // allow Postman / server-to-server / mobile apps (no origin header sometimes)
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

// ✅ Ensure uploads folder exists
const __dirnameFull = path.resolve();
const UPLOAD_DIR = path.join(__dirnameFull, "uploads");
if (!fs.existsSync(UPLOAD_DIR)) fs.mkdirSync(UPLOAD_DIR, { recursive: true });

/**
 * ✅ Serve uploaded files publicly
 * Your uploaded image URL will look like:
 * https://tomorrow-main.onrender.com/uploads/<filename>
 */
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
