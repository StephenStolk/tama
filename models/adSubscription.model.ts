// models/adSubscription.model.ts
import mongoose from "mongoose";

const AdSubscriptionSchema = new mongoose.Schema(
  {
    advertiser: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    packageType: { type: String, enum: ["basic", "premium", "enterprise"], required: true },
    startDate: { type: Date, default: Date.now },
    endDate: { type: Date, required: true },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.models.AdSubscription || mongoose.model("AdSubscription", AdSubscriptionSchema);
