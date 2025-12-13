import { verifyToken } from "../utils/jwt.js";

export function requireAuth(req, res, next) {
  const token = req.cookies?.token; // web cookie auth

  if (!token) return res.status(401).json({ message: "Not authenticated" });

  try {
    const decoded = verifyToken(token);
    req.userId = decoded.id;
    next();
  } catch (e) {
    return res.status(401).json({ message: "Invalid token" });
  }
}
