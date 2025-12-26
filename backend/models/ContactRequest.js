// backend/models/ContactRequest.js
import mongoose from "mongoose";

const contactRequestSchema = new mongoose.Schema(
  {
    // optional link to a registered user
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
      index: true,
    },

    // optional link to a property/listing later
    listing: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Listing",
      default: null,
      index: true,
    },

    name: { type: String, trim: true, required: true },
    email: { type: String, trim: true, lowercase: true, default: "" },
    phone: { type: String, trim: true, default: "" },

    subject: { type: String, trim: true, default: "" },
    message: { type: String, trim: true, required: true },

    // helps sales/admin manage requests
    status: {
      type: String,
      enum: ["new", "in_progress", "closed"],
      default: "new",
      index: true,
    },

    source: { type: String, trim: true, default: "app" }, // app / website / ads / etc
  },
  { timestamps: true }
);

export default mongoose.models.ContactRequest ||
  mongoose.model("ContactRequest", contactRequestSchema);
