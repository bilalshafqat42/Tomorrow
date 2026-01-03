// backend/routes/upload.js
import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";

const router = express.Router();

const ROOT_DIR = process.cwd();
const UPLOAD_DIR = path.join(ROOT_DIR, "uploads");
const AVATAR_DIR = path.join(UPLOAD_DIR, "avatars");

// ✅ Ensure folder exists
fs.mkdirSync(AVATAR_DIR, { recursive: true });

// Multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, AVATAR_DIR),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname || "").toLowerCase() || ".jpg";
    const safeExt = [".jpg", ".jpeg", ".png", ".webp"].includes(ext)
      ? ext
      : ".jpg";

    const name = `avatar_${Date.now()}_${Math.round(
      Math.random() * 1e9
    )}${safeExt}`;
    cb(null, name);
  },
});

const fileFilter = (req, file, cb) => {
  const allowed = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
  if (!allowed.includes(file.mimetype)) {
    return cb(new Error("Only JPG, PNG, WEBP images are allowed"), false);
  }
  cb(null, true);
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
});

// POST /api/upload/avatar
// FormData key: "file"
router.post("/avatar", (req, res) => {
  upload.single("file")(req, res, (err) => {
    try {
      if (err) {
        // Multer-specific errors
        if (err.code === "LIMIT_FILE_SIZE") {
          return res.status(400).json({ message: "File too large (max 5MB)" });
        }
        return res
          .status(400)
          .json({ message: err.message || "Upload failed" });
      }

      if (!req.file) {
        return res.status(400).json({ message: "No file uploaded" });
      }

      // Public path that frontend/mobile can use:
      const publicPath = `/uploads/avatars/${req.file.filename}`;

      return res.json({
        message: "Uploaded ✅",
        image: publicPath,
      });
    } catch (e) {
      return res.status(500).json({ message: e.message || "Upload failed" });
    }
  });
});

export default router;
