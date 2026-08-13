import mongoose, { Schema } from "mongoose";
import type { Model, InferSchemaType } from "mongoose";

const ticketTierSchema = new Schema({
  // Stable machine key, e.g. "vvip-ringsede", "vip", "early-bird"
  key: { type: String, required: true, trim: true },
  name: { type: String, required: true, trim: true }, // e.g. "VVIP Ringside"
  description: { type: String, trim: true },
  perks: { type: [String], default: [] },
  priceETB: { type: Number, required: true, min: 0 }, // domestic price (Chapa)
  priceUSD: { type: Number, min: 0 }, // diaspora price (Stripe)
  seatsTotal: { type: Number, default: 26 },
  seatsAvailable: { type: Number, default: 26 },
  // Seat labels already sold / assigned (e.g. ["vip-01", "vip-02"])
  assignedSeats: { type: [String], default: [] },
  // When true the buyer cannot pick a seat — we auto-assign the next one.
  autoAssign: { type: Boolean, default: false },
});

const boutSchema = new Schema({
  boutNumber: { type: Number },
  sport: { type: String, trim: true }, // "MMA" | "Boxing" | "Muay Thai"
  division: { type: String, trim: true },
  rounds: { type: Number },
  isMainEvent: { type: Boolean, default: false },
  redCorner: { type: Schema.Types.ObjectId, ref: "Fighter" },
  blueCorner: { type: Schema.Types.ObjectId, ref: "Fighter" },
  // Name fallbacks for when fighter docs aren't linked yet
  redCornerName: { type: String, trim: true },
  blueCornerName: { type: String, trim: true },
});

const eventSchema = new Schema(
  {
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    name: { type: String, required: true, trim: true },
    tagline: { type: String, trim: true },
    date: { type: Date, required: true },
    venue: {
      name: { type: String, trim: true },
      city: { type: String, trim: true },
      address: { type: String, trim: true },
    },
    status: {
      type: String,
      enum: ["upcoming", "live", "completed"],
      default: "upcoming",
    },
    // Path to the event poster in /public/assets
    image: { type: String, trim: true },
    ticketTiers: { type: [ticketTierSchema], default: [] },
    fightCard: { type: [boutSchema], default: [] },
    ppv: {
      available: { type: Boolean, default: false },
      priceETB: { type: Number, min: 0 },
      priceUSD: { type: Number, min: 0 },
      liveUrl: { type: String, trim: true },
    },
  },
  { timestamps: true }
);

export type EventDoc = InferSchemaType<typeof eventSchema>;
export type TicketTierDoc = InferSchemaType<typeof ticketTierSchema>;

const EventModel = (mongoose.models.Event ??
  mongoose.model("Event", eventSchema)) as Model<EventDoc>;

export default EventModel;
