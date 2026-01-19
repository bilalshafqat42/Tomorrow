// backend/models/UnitInventory.js
import mongoose from "mongoose";

const { Schema } = mongoose;

const unitInventorySchema = new Schema(
  {
    unitName: { type: String, required: true, trim: true, index: true }, // "T166-101"

    projectSlug: {
      type: String,
      required: true,
      trim: true,
      index: true, // "tomorrow-166" / "tomorrow-commercial"
    },

    totalAreaSqm: { type: Number },
    parkingCount: { type: Number },
    unitPriceAED: { type: Number },

    unitStatus: { type: String, trim: true, index: true }, // "Available", "Sold"
    unitType: { type: String, trim: true, index: true }, // "2-BR-A", "Office", "Retail", ...

    suiteArea: { type: Number },
    balconyArea: { type: Number },
    totalAreaSqft: { type: Number },
    ratePerSqft: { type: Number },

    view: { type: String, trim: true },
    floor: { type: String, trim: true }, // "G", "1", "2", ...

    rsId: { type: String, trim: true }, // RS - ID (optional)
  },
  {
    timestamps: true,
    collection: "units", // 🔴 force Mongo collection name to "units"
  },
);

export default mongoose.models.UnitInventory ||
  mongoose.model("UnitInventory", unitInventorySchema);
