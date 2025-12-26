import mongoose from "mongoose";

const listingSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true, index: true },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      index: true,
    },

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

    purpose: {
      type: String,
      enum: ["sale", "rent"],
      required: true,
      index: true,
    },

    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      index: true,
    },

    price: { type: Number, index: true },
    currency: { type: String, default: "AED" },

    beds: { type: Number },
    baths: { type: Number },
    areaSqft: { type: Number, index: true },

    locationText: { type: String, trim: true, index: true },
    address: { type: String, trim: true },

    description: { type: String, trim: true },

    images: [{ url: String }],

    // Good for filtering
    amenities: [{ type: String, trim: true, index: true }], // pool, gym, parking, etc.

    // contact / assignment
    assignedToSales: { type: mongoose.Schema.Types.ObjectId, ref: "User" },

    // status
    isPublished: { type: Boolean, default: false, index: true },
  },
  { timestamps: true }
);

// Optional but very powerful: text search
listingSchema.index({
  title: "text",
  description: "text",
  locationText: "text",
});

export default mongoose.models.Listing ||
  mongoose.model("Listing", listingSchema);
