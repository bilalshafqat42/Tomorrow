// backend/routes/propertyTypes.js
import { Router } from "express";
import { listPropertyTypes } from "../controllers/propertyType.controller.js";

const router = Router();

// GET /api/property-types
router.get("/", listPropertyTypes);

export default router;
