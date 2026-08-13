import mongoose, { Schema } from "mongoose";
import type { Model, InferSchemaType } from "mongoose";

const digitalTicketSchema = new Schema(
  {
    event: {
      type: Schema.Types.ObjectId,
      ref: "Event",
      required: true,
      index: true,
    },
    // Tier key, e.g. "vip" | "vvip-ringsede" | "early-bird"
    tier: { type: String, required: true, trim: true },
    tierName: { type: String, required: true, trim: true }, // e.g. "VIP"
    seat: { type: String, trim: true, default: null }, // seat label or null (GA)
    owner: { type: Schema.Types.ObjectId, ref: "User", index: true },
    email: { type: String, required: true, lowercase: true, trim: true },
    pricePaid: { type: Number, required: true, min: 0 },
    currency: { type: String, enum: ["ETB", "USD"], required: true },
    provider: { type: String, enum: ["chapa", "stripe"], required: true },
    // Our unique transaction reference (generated at checkout time)
    txRef: { type: String, required: true, unique: true, trim: true },
    providerTxId: { type: String, trim: true },
    // QR code payload + HMAC signature — generated on successful payment
    payload: { type: String },
    token: { type: String },
    status: {
      type: String,
      enum: ["pending", "issued", "used", "revoked", "expired"],
      default: "pending",
    },
    issuedAt: { type: Date },
    usedAt: { type: Date },
  },
  { timestamps: true }
);

export type DigitalTicketDoc = InferSchemaType<typeof digitalTicketSchema>;

const DigitalTicketModel = (mongoose.models.DigitalTicket ??
  mongoose.model("DigitalTicket", digitalTicketSchema)) as Model<DigitalTicketDoc>;

export default DigitalTicketModel;
