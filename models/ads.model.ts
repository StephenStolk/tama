// models/ad.model.ts
import mongoose from "mongoose";

const AdSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    content: { type: String, required: true },
    imageUrl: { type: String }, // Optional for image-based ads
    link: { type: String, required: true }, // Redirect URL (Affiliate link)
    advertiser: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    status: { type: String, enum: ["active", "inactive"], default: "active" },
    placement: { type: String, enum: ["native", "sidebar"], default: "native" },
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export default mongoose.models.Ad || mongoose.model("Ad", AdSchema);
