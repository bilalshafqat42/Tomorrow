import mongoose from "mongoose";

const projectSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true, index: true },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      index: true,
    },
    locationText: { type: String, trim: true }, // e.g. "Dubai Islands"
    address: { type: String, trim: true },

    description: { type: String, trim: true },

    status: {
      type: String,
      enum: ["upcoming", "under_construction", "ready"],
      default: "upcoming",
      index: true,
    },

    heroImageUrl: { type: String, trim: true },
    gallery: [{ url: String, caption: String }],

    // admin info
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

export default mongoose.models.Project ||
  mongoose.model("Project", projectSchema);
