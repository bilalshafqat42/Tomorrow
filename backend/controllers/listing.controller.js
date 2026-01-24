// backend/controllers/listing.controller.js
import mongoose from "mongoose";
import Listing from "../models/Listing.js";

// Files you added under backend/uploads/listings
const IMAGE_FILES = ["bed1.jpg", "bed2.jpg", "bed3.jpg"];

/**
 * GET /api/listings
 * Optional query:
 *  - q         : search text (title, buildingName, propertyRef)
 *  - category  : apartment | house | office | shop | villa | plot | warehouse
 *  - page      : page number (default 1)
 *  - limit     : page size (default 20)
 */
export async function listListings(req, res, next) {
  try {
    const { q, category } = req.query;

    const filter = {};

    if (category) {
      filter.category = category;
    }

    if (q) {
      const regex = new RegExp(q, "i");
      filter.$or = [
        { title: regex },
        { buildingName: regex },
        { propertyRef: regex },
      ];
    }

    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 20;
    const skip = (page - 1) * limit;

    // For building full URLs like https://tomorrow-main.onrender.com/uploads/...
    const baseUrl = `${req.protocol}://${req.get("host")}`;

    const docs = await Listing.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean()
      .exec();

    // Attach imageUrl using your bed1/bed2/bed3 files
    const listings = docs.map((doc, index) => {
      const imageFile = IMAGE_FILES[index % IMAGE_FILES.length];

      return {
        ...doc,
        imageUrl: `${baseUrl}/uploads/listings/${imageFile}`,
      };
    });

    const total = await Listing.countDocuments(filter).exec();

    res.json({
      listings,
      total,
      page,
      limit,
    });
  } catch (err) {
    console.error("listListings error:", err);
    next(err);
  }
}

/**
 * GET /api/listings/:idOrSlug
 * (kept so your routes file can safely import getListing)
 */
export async function getListing(req, res, next) {
  try {
    const { idOrSlug } = req.params;
    if (!idOrSlug) {
      return res.status(400).json({ message: "Listing idOrSlug is required" });
    }

    let listing = null;

    if (mongoose.isValidObjectId(idOrSlug)) {
      listing = await Listing.findById(idOrSlug).lean().exec();
    } else {
      listing = await Listing.findOne({ slug: idOrSlug }).lean().exec();
    }

    if (!listing) {
      return res.status(404).json({ message: "Listing not found" });
    }

    const baseUrl = `${req.protocol}://${req.get("host")}`;
    const imageFile = IMAGE_FILES[0];

    res.json({
      listing: {
        ...listing,
        imageUrl: `${baseUrl}/uploads/listings/${imageFile}`,
      },
    });
  } catch (err) {
    console.error("getListing error:", err);
    next(err);
  }
}

// Optional default export (safe for ESM imports)
export default { listListings, getListing };
