import mongoose, { Schema } from "mongoose";
import type { Model, InferSchemaType } from "mongoose";

/**
 * Tracks provider webhook events that have already been processed so a
 * duplicate webhook delivery never fulfils an order twice.
 */
const webhookEventSchema = new Schema(
  {
    provider: { type: String, enum: ["chapa", "stripe"], required: true },
    // Provider's webhook event id — the idempotency key.
    eventId: { type: String, required: true, trim: true },
    txRef: { type: String, trim: true },
  },
  { timestamps: true } // createdAt doubles as "handledAt"
);

// Unique per provider + event id → duplicate deliveries hit a unique-index error.
webhookEventSchema.index({ provider: 1, eventId: 1 }, { unique: true });

export type WebhookEventDoc = InferSchemaType<typeof webhookEventSchema>;

const WebhookEventModel = (mongoose.models.WebhookEvent ??
  mongoose.model("WebhookEvent", webhookEventSchema)) as Model<WebhookEventDoc>;

export default WebhookEventModel;
