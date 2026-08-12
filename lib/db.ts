import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

declare global {
  // eslint-disable-next-line no-var
  var mongooseCache: MongooseCache | undefined;
}

const cached: MongooseCache =
  globalThis.mongooseCache ?? { conn: null, promise: null };

globalThis.mongooseCache = cached;

/**
 * Returns a single shared Mongoose connection.
 *
 * - In development: survives Next.js hot-reloads (the module-level cache is
 *   re-used because only the first import initialises it).
 * - In production/serverless: avoids exhausting the connection pool by
 *   reusing the cached connection across invocations.
 *
 * Usage:
 *   import dbConnect from "@/lib/db";
 *   await dbConnect();
 */
export async function dbConnect(): Promise<typeof mongoose> {
  if (!MONGODB_URI) {
    throw new Error(
      "MONGODB_URI is not defined. Copy .env.example to .env.local and set your connection string."
    );
  }

  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    // Note: Mongoose 9 removed connection buffering, so no buffer options needed.
    cached.promise = mongoose.connect(MONGODB_URI);
  }

  cached.conn = await cached.promise;
  return cached.conn;
}

export default dbConnect;
