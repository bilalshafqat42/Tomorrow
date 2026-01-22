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

// Optional: keep gallery items structured
const galleryItemSchema = new Schema(
  {
    url: { type: String, trim: true, required: true },
    caption: { type: String, trim: true },
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
    // Used later for filters: Residential / Commercial / Mixed
    projectType: {
      type: String,
      enum: ["Residential", "Commercial", "Mixed"],
      default: "Residential",
      index: true,
    },

    // LOCATION
    locationText: { type: String, trim: true }, // e.g. "Dubai Islands – Island A"
    address: { type: String, trim: true },
    areaTag: { type: String, trim: true }, // e.g. "Dubai Islands", "Business Hub"
    coordinates: {
      lat: { type: Number },
      lng: { type: Number },
    },

    // Google Maps helpers
    googleMapsUrl: { type: String, trim: true }, // for "Open in Google Maps" button
    mapQuery: { type: String, trim: true }, // used for embedded map + destination

    // MARKETING COPY
    tagline: { type: String, trim: true }, // short line under title (detail page)
    shortDescription: { type: String, trim: true }, // short text for cards
    description: { type: String, trim: true }, // long description / about

    // BUILDING INFO (for Tomorrow 166 / Commercial Tower screens)
    typology: { type: String, trim: true }, // e.g. "1–3 BR Apartments"
    height: { type: String, trim: true }, // e.g. "G+P+7"

    // STATUS
    status: {
      type: String,
      enum: ["upcoming", "under_construction", "ready"],
      default: "upcoming",
      index: true,
    },
    statusLabel: { type: String, trim: true }, // optional custom label, e.g. "In progress"

    // PRICING
    startingPriceAED: { type: Number }, // e.g. 1850000
    startingPriceText: { type: String, trim: true }, // e.g. "From AED 1.85M"

    // IMAGES
    heroImageUrl: { type: String, trim: true },
    gallery: [galleryItemSchema],

    // AMENITIES & DISTANCES
    amenities: [{ type: String, trim: true }], // ["Swimming pool", ...]
    distances: [distanceSchema], // [{ place, time, originQuery }, ...]

    // HIGHLIGHTS FOR CARDS (optional)
    highlights: [{ type: String, trim: true }], // ["Beachfront", "Retail podium"]

    // FLAGS
    isFeatured: { type: Boolean, default: false, index: true },

    // ADMIN
    createdBy: { type: Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true },
);

export default mongoose.models.Project ||
  mongoose.model("Project", projectSchema);
