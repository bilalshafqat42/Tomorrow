// backend/models/Listing.js
import mongoose from "mongoose";

const listingSchema = new mongoose.Schema(
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

    // HIGH-LEVEL TYPE
    category: {
      type: String,
      enum: [
        "house",
        "apartment",
        "office",
        "shop",
        "villa",
        "plot",
        "warehouse",
      ],
      required: true,
      index: true,
    },

    // SALE / RENT
    purpose: {
      type: String,
      enum: ["sale", "rent"],
      required: true,
      index: true,
    },

    // LINK TO PROJECT (Tomorrow 166, etc.)
    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      index: true,
    },

    // PRICING
    price: { type: Number, index: true },
    currency: { type: String, default: "AED" },
    pricePerSqft: { type: Number, index: true },

    // PROPERTY DETAILS
    beds: { type: Number },
    baths: { type: Number },
    areaSqft: { type: Number, index: true },

    // building / view info
    buildingName: { type: String, trim: true },
    view: { type: String, trim: true },

    // floor / completion
    floorNumber: { type: Number },
    totalFloors: { type: Number },
    yearBuilt: { type: Number },
    completionStatus: {
      type: String,
      enum: ["completed", "under_construction", "offplan"],
      default: "completed",
      index: true,
    },
    handoverDate: { type: Date },

    // FURNISHING
    furnishing: {
      type: String,
      enum: ["unfurnished", "semi-furnished", "furnished"],
      default: "unfurnished",
    },

    // LOCATION
    locationText: { type: String, trim: true, index: true },
    address: { type: String, trim: true },
    coordinates: {
      lat: { type: Number },
      lng: { type: Number },
    },

    // MARKETING COPY
    description: { type: String, trim: true },

    // MEDIA
    heroImage: { url: String },
    images: [{ url: String }],

    // FILTER HELPERS
    amenities: [{ type: String, trim: true, index: true }],

    // CONTACT / ASSIGNMENT
    assignedToSales: { type: mongoose.Schema.Types.ObjectId, ref: "User" },

    // LISTING STATUS
    availabilityStatus: {
      type: String,
      enum: ["available", "reserved", "sold", "rented", "offmarket"],
      default: "available",
      index: true,
    },

    isPublished: { type: Boolean, default: false, index: true },
    isFeatured: { type: Boolean, default: false, index: true },

    // LABELS / BADGES
    labels: [{ type: String, trim: true }],

    // INTERNAL REFERENCE
    propertyRef: { type: String, trim: true, index: true },

    // SEO (for web later if you want)
    seoTitle: { type: String, trim: true },
    seoDescription: { type: String, trim: true },
  },
  { timestamps: true },
);

// Text search index
listingSchema.index({
  title: "text",
  description: "text",
  locationText: "text",
});

export default mongoose.models.Listing ||
  mongoose.model("Listing", listingSchema);
