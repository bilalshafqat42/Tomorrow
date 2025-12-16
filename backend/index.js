import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/auth.js";

dotenv.config();

const app = express();

// Required for secure cookies behind Render proxy
app.set("trust proxy", 1);

const ALLOWED = [
  process.env.FRONT_URL || "https://tomorrow-app.onrender.com",
  "https://tomorrow-app.onrender.com",
  "http://localhost:3000",
];

// CORS (allow cookies)
app.use(
  cors({
    origin: (origin, cb) => {
      if (!origin) return cb(null, true); // Postman/server-to-server
      if (ALLOWED.includes(origin)) return cb(null, true);
      return cb(new Error("Not allowed by CORS: " + origin));
    },
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());

// Health
app.get("/", (req, res) => {
  res.json({ message: "Backend is working ✅" });
});

// Routes
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
