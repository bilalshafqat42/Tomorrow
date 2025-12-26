import mongoose from "mongoose";

const serviceSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true, index: true },
    shortDescription: { type: String, trim: true },
    icon: { type: String, trim: true }, // "home", "building", etc (frontend icon key)
    coverImageUrl: { type: String, trim: true },
    isActive: { type: Boolean, default: true, index: true },
  },
  { timestamps: true }
);

export default mongoose.models.Service ||
  mongoose.model("Service", serviceSchema);
