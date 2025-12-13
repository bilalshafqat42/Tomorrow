import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";

import authRoutes from "./routes/auth.js";

dotenv.config();

const app = express();

/**
 * IMPORTANT:
 * - allow cookies from your frontend domain
 * - Render URL must match exactly
 */
const FRONTEND_URL = process.env.FRONTEND_URL; // https://tomorrow-app.onrender.com

app.use(
  cors({
    origin: FRONTEND_URL,
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());

// Health
app.get("/", (req, res) => {
  res.json({ message: "Backend is working ✅" });
});

app.use("/api/auth", authRoutes);

const PORT = process.env.PORT || 4000;

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected ✅");
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((err) => {
    console.log("MongoDB error ❌", err.message);
    process.exit(1);
  });
