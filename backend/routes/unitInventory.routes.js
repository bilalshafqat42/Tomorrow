// backend/routes/unitInventory.routes.js
import express from "express";
import { listUnits } from "../controllers/unitInventory.controller.js";

const router = express.Router();

// GET /api/units?projectSlug=tomorrow-166&status=Available
router.get("/units", listUnits);

export default router;
