import mongoose from "mongoose";

const unitSchema = new mongoose.Schema(
  {
    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      required: true,
    },

    title: { type: String, required: true, trim: true }, // "2BR – Type B"
    slug: { type: String, required: true, unique: true, lowercase: true },

    type: {
      type: String,
      enum: ["Apartment", "Villa", "Townhouse", "Office", "Retail"],
      required: true,
      index: true,
    },

    beds: { type: Number, default: null },
    baths: { type: Number, default: null },
    area: { type: String, trim: true }, // "1,142–1,153 sq.ft" or 1153 numeric

    price: { type: Number, default: null }, // optional number for filtering
    priceText: { type: String, trim: true }, // e.g. "On Request"
    priceNote: { type: String, trim: true },

    highlights: [{ type: String }], // bullet points

    gallery: [{ url: String, caption: String }], // images per unit

    status: {
      type: String,
      enum: ["available", "sold", "reserved", "offplan"],
      default: "available",
    },

    isFeatured: { type: Boolean, default: false, index: true },
  },
  { timestamps: true }
);

export default mongoose.models.Unit || mongoose.model("Unit", unitSchema);
