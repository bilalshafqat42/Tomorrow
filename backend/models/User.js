import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, trim: true, required: true },

    email: {
      type: String,
      trim: true,
      lowercase: true,
      required: true,
      unique: true,
      index: true,
    },

    phone: { type: String, trim: true, default: "" },

    // ✅ New fields
    address: { type: String, trim: true, default: "" },
    image: { type: String, trim: true, default: "" }, // store URL (recommended)
    language: { type: String, trim: true, default: "English" },

    passwordHash: { type: String, required: true },

    // ✅ Only these 3 roles
    role: {
      type: String,
      enum: ["admin", "sales", "client"],
      default: "client",
    },
  },
  { timestamps: true }
);

export default mongoose.models.User || mongoose.model("User", userSchema);
