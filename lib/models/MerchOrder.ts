import mongoose, { Schema } from "mongoose";
import type { Model, InferSchemaType } from "mongoose";

const merchItemSchema = new Schema({
  name: { type: String, required: true, trim: true },
  sku: { type: String, trim: true },
  quantity: { type: Number, required: true, min: 1 },
  unitPrice: { type: Number, required: true, min: 0 },
});

const merchOrderSchema = new Schema(
  {
    owner: { type: Schema.Types.ObjectId, ref: "User", index: true },
    email: { type: String, required: true, lowercase: true, trim: true },
    items: { type: [merchItemSchema], required: true },
    total: { type: Number, required: true, min: 0 },
    currency: { type: String, enum: ["ETB", "USD"], required: true },
    provider: { type: String, enum: ["chapa", "stripe"], required: true },
    txRef: { type: String, required: true, unique: true, trim: true },
    providerTxId: { type: String, trim: true },
    status: {
      type: String,
      enum: ["pending", "paid", "shipped", "cancelled", "refunded"],
      default: "pending",
    },
    shipping: {
      fullName: { type: String, trim: true },
      phone: { type: String, trim: true },
      address: { type: String, trim: true },
      city: { type: String, trim: true },
    },
  },
  { timestamps: true }
);

export type MerchOrderDoc = InferSchemaType<typeof merchOrderSchema>;

const MerchOrderModel = (mongoose.models.MerchOrder ??
  mongoose.model("MerchOrder", merchOrderSchema)) as Model<MerchOrderDoc>;

export default MerchOrderModel;
