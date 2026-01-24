// backend/controllers/propertyType.controller.js
import Listing from "../models/Listing.js";

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
    // no isPublished filter for now — we just want to see data
    const categories = await Listing.distinct("category").exec();

    const types = categories
      .map((cat) => CATEGORY_LABELS[cat] || cat)
      .filter(Boolean);

    const uniqueTypes = [...new Set(types)];

    res.json({ types: uniqueTypes });
  } catch (err) {
    console.error("listPropertyTypes error:", err);
    next(err);
  }
}
