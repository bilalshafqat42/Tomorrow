import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";

import authRoutes from "./routes/auth.js";

dotenv.config();

const app = express();

// ✅ Required on Render so secure cookies work behind proxy
app.set("trust proxy", 1);

// ✅ Your Next.js domain (Render static web service)
const FRONT_URL = process.env.FRONT_URL || "https://tomorrow-app.onrender.com";

// ✅ Add extra allowed variants (optional but helpful)
const ALLOWED_ORIGINS = [
  FRONT_URL,
  FRONT_URL.replace("https://", "http://"),
  "https://www.tomorrow-app.onrender.com",
];

// ✅ CORS (cookies enabled)
app.use(
  cors({
    origin: (origin, cb) => {
      // allow Postman / server-to-server (no origin)
      if (!origin) return cb(null, true);

      if (ALLOWED_ORIGINS.includes(origin)) return cb(null, true);

      return cb(new Error("Not allowed by CORS: " + origin));
    },
    credentials: true,
  })
);

// ✅ Parsers
app.use(express.json());
app.use(cookieParser());

// ✅ Health check
app.get("/", (req, res) => res.json({ message: "Backend is working ✅" }));

// ✅ Routes
app.use("/api/auth", authRoutes);

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
