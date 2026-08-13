import mongoose, { Schema } from "mongoose";
import type { Model, InferSchemaType } from "mongoose";

const userSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    firstName: { type: String, trim: true },
    lastName: { type: String, trim: true },
    phone: { type: String, trim: true },
    // For future auth integration (bcrypt/argon2 hash) — not used yet.
    passwordHash: { type: String },
    role: { type: String, enum: ["customer", "admin"], default: "customer" },
    // Purchases tracked against this user
    tickets: [{ type: Schema.Types.ObjectId, ref: "DigitalTicket" }],
    ppvPurchases: [{ type: Schema.Types.ObjectId, ref: "PPVPurchase" }],
    merchOrders: [{ type: Schema.Types.ObjectId, ref: "MerchOrder" }],
  },
  { timestamps: true }
);

export type UserDoc = InferSchemaType<typeof userSchema>;

const UserModel = (mongoose.models.User ??
  mongoose.model("User", userSchema)) as Model<UserDoc>;

export default UserModel;
