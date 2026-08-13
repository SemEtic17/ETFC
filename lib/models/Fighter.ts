import mongoose, { Schema } from "mongoose";
import type { Model, InferSchemaType } from "mongoose";

const fighterSchema = new Schema(
  {
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    name: { type: String, required: true, trim: true },
    nickname: { type: String, trim: true },
    // e.g. "Heavyweight", "75 KG", "Lightweight"
    division: { type: String, required: true, trim: true },
    weightClass: { type: String, trim: true },
    country: { type: String, trim: true },
    // Path to a fighter portrait in /public/assets, e.g. "/assets/fighter-sedo.png"
    image: { type: String, trim: true },
    record: {
      wins: { type: Number, default: 0, min: 0 },
      losses: { type: Number, default: 0, min: 0 },
      draws: { type: Number, default: 0, min: 0 },
      kos: { type: Number, default: 0, min: 0 },
    },
    stats: {
      height: { type: String, trim: true },
      reach: { type: String, trim: true },
      age: { type: Number, min: 0 },
    },
    bio: { type: String, trim: true },
    active: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export type FighterDoc = InferSchemaType<typeof fighterSchema>;

const FighterModel = (mongoose.models.Fighter ??
  mongoose.model("Fighter", fighterSchema)) as Model<FighterDoc>;

export default FighterModel;
