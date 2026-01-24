// backend/controllers/propertyType.controller.js
import Listing from "../models/Listing.js";

// Simple mapping from DB value -> UI label
const CATEGORY_LABELS = {
  house: "Houses",
  apartment: "Apartments",
  office: "Offices",
  shop: "Shops",
  villa: "Villas",
  plot: "Plots",
  warehouse: "Warehouses",
};

export async function listPropertyTypes(req, res, next) {
  try {
    // Only from published listings
    const categories = await Listing.distinct("category", {
      isPublished: true,
    }).exec();

    const types = categories
      .map((cat) => CATEGORY_LABELS[cat] || cat)
      .filter(Boolean);

    // unique + keep order
    const uniqueTypes = [...new Set(types)];

    res.json({ types: uniqueTypes });
  } catch (err) {
    console.error("listPropertyTypes error:", err);
    next(err);
  }
}
