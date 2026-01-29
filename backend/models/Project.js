import mongoose from "mongoose";

const { Schema } = mongoose;

// Small sub-schema for distances (no own _id)
const distanceSchema = new Schema(
  {
    // e.g. "Gold Souk"
    place: { type: String, trim: true, required: true },

    // e.g. "4 min"
    time: { type: String, trim: true, required: true },

    // what we type into Google Maps as the starting point
    // e.g. "Gold Souk, Dubai"
    originQuery: { type: String, trim: true, required: true },
  },
  { _id: false },
);

// Gallery items (structured)
const galleryItemSchema = new Schema(
  {
    url: { type: String, trim: true, required: true },
    caption: { type: String, trim: true, default: "" },
    sortOrder: { type: Number, default: 0 }, // ✅ added
  },
  { _id: false },
);

// ✅ Payment plan block
const paymentPlanSchema = new Schema(
  {
    title: { type: String, trim: true, default: "PAYMENT PLAN" },
    shortText: { type: String, trim: true, default: "" }, // "30/70"
    description: { type: String, trim: true, default: "" },
  },
  { _id: false },
);

// ✅ Handover block
const handoverSchema = new Schema(
  {
    year: { type: Number },
    month: { type: String, trim: true, default: "" }, // "May"
    text: { type: String, trim: true, default: "" }, // "Handover in MAY"
  },
  { _id: false },
);

// ✅ Size block
const sizeSchema = new Schema(
  {
    text: { type: String, trim: true, default: "" }, // "871–1613 SQFT"
    minSqft: { type: Number },
    maxSqft: { type: Number },
  },
  { _id: false },
);

const projectSchema = new Schema(
  {
    // BASIC
    title: { type: String, required: true, trim: true, index: true },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      index: true,
    },

    // TYPE / CATEGORY
    projectType: {
      type: String,
      enum: ["Residential", "Commercial", "Mixed"],
      default: "Residential",
      index: true,
    },

    // LOCATION
    locationText: { type: String, trim: true },
    address: { type: String, trim: true },
    areaTag: { type: String, trim: true },
    coordinates: {
      lat: { type: Number },
      lng: { type: Number },
    },

    // Google Maps helpers
    googleMapsUrl: { type: String, trim: true },
    mapQuery: { type: String, trim: true },

    // MARKETING COPY
    tagline: { type: String, trim: true },
    shortDescription: { type: String, trim: true },
    description: { type: String, trim: true },

    // BUILDING INFO
    typology: { type: String, trim: true },
    height: { type: String, trim: true },

    // STATUS
    status: {
      type: String,
      enum: ["upcoming", "under_construction", "ready"],
      default: "upcoming",
      index: true,
    },
    statusLabel: { type: String, trim: true },

    // PRICING
    startingPriceAED: { type: Number },
    startingPriceText: { type: String, trim: true },

    // ✅ LAUNCH / HERO
    launchTitle: { type: String, trim: true, default: "NEW LAUNCH" }, // ✅ added

    // IMAGES / FILES
    heroImageUrl: { type: String, trim: true },
    brochureUrl: { type: String, trim: true }, // ✅ added (PDF path)
    gallery: { type: [galleryItemSchema], default: [] }, // ✅ default + schema

    // ✅ NEW "CARDS" DATA
    paymentPlan: { type: paymentPlanSchema, default: () => ({}) }, // ✅ added
    handover: { type: handoverSchema, default: () => ({}) }, // ✅ added
    size: { type: sizeSchema, default: () => ({}) }, // ✅ added

    // AMENITIES & DISTANCES
    amenities: [{ type: String, trim: true }],
    distances: { type: [distanceSchema], default: [] },

    // HIGHLIGHTS FOR CARDS (optional)
    highlights: [{ type: String, trim: true }],

    // FLAGS
    isFeatured: { type: Boolean, default: false, index: true },

    // ADMIN
    createdBy: { type: Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true },
);

export default mongoose.models.Project ||
  mongoose.model("Project", projectSchema);
