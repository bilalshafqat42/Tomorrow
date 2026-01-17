// backend/routes/projects.js
import express from "express";
import { listProjects, getProject } from "../controllers/project.controller.js";

const router = express.Router();

// Public read endpoints for now
router.get("/", listProjects);
router.get("/:idOrSlug", getProject);

export default router;
