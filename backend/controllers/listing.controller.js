// backend/controllers/listing.controller.js
import mongoose from "mongoose";
import Listing from "../models/Listing.js";
import Project from "../models/Project.js";

/**
 * GET /api/listings
 * Query params:
 *  - q: text search
 *  - category: house|apartment|office|...
 *  - purpose: sale|rent
 *  - minPrice, maxPrice
 *  - minBeds, maxBeds
 *  - projectSlug
 *  - featured=true
 *  - limit, page
 */
export async function listListings(req, res, next) {
  try {
    const {
      q,
      category,
      purpose,
      minPrice,
      maxPrice,
      minBeds,
      maxBeds,
      projectSlug,
      featured,
      limit = 20,
      page = 1,
    } = req.query;

    // 🔹 Start with NO filters except what we add manually
    // (later, when everything works, you can add isPublished: true again)
    const filter = {};

    if (category) {
      filter.category = category;
    }

    if (purpose) {
      filter.purpose = purpose;
    }

    if (featured === "true") {
      filter.isFeatured = true;
    }

    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }

    if (minBeds || maxBeds) {
      filter.beds = {};
      if (minBeds) filter.beds.$gte = Number(minBeds);
      if (maxBeds) filter.beds.$lte = Number(maxBeds);
    }

    // Optional: filter by project slug
    if (projectSlug) {
      const project = await Project.findOne({ slug: projectSlug })
        .select("_id")
        .lean()
        .exec();
      if (project) {
        filter.project = project._id;
      } else {
        // no listings if project not found
        return res.json({
          listings: [],
          total: 0,
          page: 1,
          limit: Number(limit) || 20,
        });
      }
    }

    const numericLimit = Math.min(Number(limit) || 20, 100);
    const numericPage = Math.max(Number(page) || 1, 1);
    const skip = (numericPage - 1) * numericLimit;

    const baseQuery = Listing.find(filter);

    // Full text search
    if (q && q.trim()) {
      baseQuery.find({ $text: { $search: q.trim() } });
    }

    const [listings, total] = await Promise.all([
      baseQuery
        .sort({ isFeatured: -1, createdAt: -1 })
        .skip(skip)
        .limit(numericLimit)
        .lean()
        .exec(),
      Listing.countDocuments(filter).exec(),
    ]);

    res.json({
      listings,
      total,
      page: numericPage,
      limit: numericLimit,
    });
  } catch (err) {
    console.error("listListings error:", err);
    next(err);
  }
}

/**
 * GET /api/listings/:idOrSlug
 * Accepts either Mongo ObjectId OR slug
 */
export async function getListing(req, res, next) {
  try {
    const { idOrSlug } = req.params;

    let listing = null;

    if (mongoose.isValidObjectId(idOrSlug)) {
      listing = await Listing.findById(idOrSlug)
        .populate("project")
        .lean()
        .exec();
    } else {
      listing = await Listing.findOne({ slug: idOrSlug })
        .populate("project")
        .lean()
        .exec();
    }

    if (!listing) {
      return res.status(404).json({ message: "Listing not found" });
    }

    res.json({ listing });
  } catch (err) {
    console.error("getListing error:", err);
    next(err);
  }
}
