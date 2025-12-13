import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";

import authRoutes from "./routes/auth.js";

dotenv.config();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Health check (important for Render)
app.get("/", (req, res) => {
  res.status(200).json({ message: "Backend is working ✅" });
});

// Routes
app.use("/api/auth", authRoutes);

// Server + DB
const PORT = process.env.PORT || 4000;

(async () => {
  try {
    if (!process.env.MONGO_URI) {
      throw new Error("MONGO_URI missing");
    }

    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB connected ✅");

    app.listen(PORT, "0.0.0.0", () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("MongoDB error ❌", error.message);
    process.exit(1);
  }
})();
