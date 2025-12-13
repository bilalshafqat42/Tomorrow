// backend/index.js
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";

import authRoutes from "./routes/auth.js";

dotenv.config();

const app = express();

// If you use secure cookies behind Render/Proxy
app.set("trust proxy", 1);

// ✅ Middlewares
app.use(express.json());
app.use(cookieParser());

// ✅ CORS (VERY IMPORTANT)
app.use(
  cors({
    origin: [
      "https://tomorrow-app.onrender.com", // frontend
      "http://localhost:3000", // local next
    ],
    credentials: true,
  })
);

// ✅ Health check
app.get("/", (req, res) => {
  res.json({ message: "Backend is working ✅" });
});

// ✅ Routes
app.use("/api/auth", authRoutes);

// ✅ Mongo connect + start server
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
