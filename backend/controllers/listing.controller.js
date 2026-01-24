// backend/controllers/listing.controller.js
import mongoose from "mongoose";
import Listing from "../models/Listing.js";
import Project from "../models/Project.js";

/**
 * GET /api/listings
 *
 * TEMP SIMPLE VERSION:
 * - Ignores all filters for now
 * - Returns up to 50 listings from the DB
 * Once you confirm data is coming through, we can re-add filters.
 */
export async function listListings(req, res, next) {
  try {
    const listings = await Listing.find({})
      .sort({ createdAt: -1 })
      .limit(50)
      .lean()
      .exec();

    const total = await Listing.countDocuments({}).exec();

    return res.json({
      listings,
      total,
      page: 1,
      limit: 50,
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
