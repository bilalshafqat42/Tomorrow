// backend/controllers/project.controller.js
import Project from "../models/Project.js";
import mongoose from "mongoose";

/**
 * GET /api/projects
 * Optional query:
 *  - status=upcoming|under_construction|ready
 *  - type=Residential|Commercial|Mixed
 *  - featured=true
 */
export async function listProjects(req, res, next) {
  try {
    const filter = {};

    if (req.query.status) {
      filter.status = req.query.status;
    }

    if (req.query.type) {
      filter.projectType = req.query.type;
    }

    if (req.query.featured === "true") {
      filter.isFeatured = true;
    }

    const projects = await Project.find(filter)
      .sort({ createdAt: -1 })
      .lean()
      .exec();

    res.json({ projects });
  } catch (err) {
    next(err);
  }
}

/**
 * GET /api/projects/:idOrSlug
 * Accepts either Mongo ObjectId OR slug
 */
export async function getProject(req, res, next) {
  try {
    const { idOrSlug } = req.params;

    let project = null;

    if (mongoose.isValidObjectId(idOrSlug)) {
      project = await Project.findById(idOrSlug).lean().exec();
    } else {
      project = await Project.findOne({ slug: idOrSlug }).lean().exec();
    }

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    res.json({ project });
  } catch (err) {
    next(err);
  }
}
