// backend/controllers/unitInventory.controller.js
import UnitInventory from "../models/UnitInventory.js";

export async function listUnits(req, res, next) {
  try {
    const {
      projectSlug, // tomorrow-166 / tomorrow-commercial
      status, // Available / Sold / Underwriting to NIP...
      type, // Retail / Office / 1-BR-A...
      floor,
      minPrice,
      maxPrice,
    } = req.query;

    const filter = {};

    if (projectSlug) filter.projectSlug = projectSlug;
    if (status) filter.unitStatus = status;
    if (type) filter.unitType = type;
    if (floor) filter.floor = floor;

    if (minPrice || maxPrice) {
      filter.unitPriceAED = {};
      if (minPrice) filter.unitPriceAED.$gte = Number(minPrice);
      if (maxPrice) filter.unitPriceAED.$lte = Number(maxPrice);
    }

    const units = await UnitInventory.find(filter)
      .sort({ floor: 1, unitName: 1 })
      .lean()
      .exec();

    res.json({ units });
  } catch (err) {
    next(err);
  }
}
