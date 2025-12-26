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

    address: { type: String, trim: true, default: "" },
    image: { type: String, trim: true, default: "" }, // URL
    language: { type: String, trim: true, default: "English" },

    // never return this
    passwordHash: { type: String, required: true, select: false },

    role: {
      type: String,
      enum: ["client", "sales", "admin"],
      default: "client",
      index: true,
    },

    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

// Clean JSON output (never leak passwordHash)
userSchema.set("toJSON", {
  transform: function (doc, ret) {
    delete ret.passwordHash;
    return ret;
  },
});

export default mongoose.models.User || mongoose.model("User", userSchema);
