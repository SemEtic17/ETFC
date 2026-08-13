import mongoose, { Schema } from "mongoose";
import type { Model, InferSchemaType } from "mongoose";

const ppvPurchaseSchema = new Schema(
  {
    event: {
      type: Schema.Types.ObjectId,
      ref: "Event",
      required: true,
      index: true,
    },
    owner: { type: Schema.Types.ObjectId, ref: "User", index: true },
    email: { type: String, required: true, lowercase: true, trim: true },
    pricePaid: { type: Number, required: true, min: 0 },
    currency: { type: String, enum: ["ETB", "USD"], required: true },
    provider: { type: String, enum: ["chapa", "stripe"], required: true },
    txRef: { type: String, required: true, unique: true, trim: true },
    providerTxId: { type: String, trim: true },
    // One-time stream access token, generated on successful payment
    accessToken: { type: String, trim: true },
    status: {
      type: String,
      enum: ["pending", "active", "refunded", "expired"],
      default: "pending",
    },
    activatedAt: { type: Date },
  },
  { timestamps: true }
);

export type PPVPurchaseDoc = InferSchemaType<typeof ppvPurchaseSchema>;

const PPVPurchaseModel = (mongoose.models.PPVPurchase ??
  mongoose.model("PPVPurchase", ppvPurchaseSchema)) as Model<PPVPurchaseDoc>;

export default PPVPurchaseModel;
