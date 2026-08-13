/**
 * Seeds the ETFC database with the ADWA FIGHT NIGHT event, its ticket tiers
 * and the main-event fighters.
 *
 * Run:  node --experimental-strip-types scripts/seed.ts
 *
 * Idempotent — re-running upserts rather than duplicating documents.
 *
 * NOTE: USD ticket prices below are rough estimates (≈1 USD = 110 ETB).
 * Confirm the real diaspora prices before going live.
 */
import dbConnect from "../lib/db.ts";
import EventModel from "../lib/models/Event.ts";
import FighterModel from "../lib/models/Fighter.ts";

async function main() {
  await dbConnect();
  console.log("Connected to MongoDB.");

  const eventDate = new Date("2026-08-27T19:00:00Z");

  const sedo = await FighterModel.findOneAndUpdate(
    { slug: "sedo" },
    {
      $set: {
        slug: "sedo",
        name: "Sedo",
        nickname: "The Beast",
        division: "Heavyweight",
        weightClass: "Heavyweight",
        country: "Ethiopia",
        image: "/assets/fighter-sedo.png",
        record: { wins: 12, losses: 3, draws: 0, kos: 9 },
        stats: { height: "193 cm", reach: "201 cm" },
        active: true,
      },
    },
    { upsert: true, returnDocument: "after" }
  );

  const johnny = await FighterModel.findOneAndUpdate(
    { slug: "johnny-b" },
    {
      $set: {
        slug: "johnny-b",
        name: "Johnny B",
        nickname: "Jiu-Jitsu",
        division: "Heavyweight",
        weightClass: "Heavyweight",
        country: "USA",
        image: "/assets/fighter-johnnyb.png",
        record: { wins: 15, losses: 2, draws: 0, kos: 6 },
        stats: { height: "188 cm", reach: "196 cm" },
        active: true,
      },
    },
    { upsert: true, returnDocument: "after" }
  );

  const event = await EventModel.findOneAndUpdate(
    { slug: "adwa-fight-night" },
    {
      $set: {
        slug: "adwa-fight-night",
        name: "ADWA FIGHT NIGHT",
        tagline: "ETFC Fight Night 2026 — Main Event Sedo vs Johnny",
        date: eventDate,
        venue: {
          name: "Adwa 00 Museum",
          city: "Addis Ababa",
        },
        status: "upcoming",
        image: "/assets/mockup-hero-sedo-vs-johnny.png",
        ticketTiers: [
          {
            key: "vvip-ringsede",
            name: "VVIP Ringside",
            description: "Front-row cage-side seats. Pick your exact seat.",
            perks: ["Pick your exact seat", "Ultimate fight night experience"],
            priceETB: 100000,
            priceUSD: 900,
            seatsTotal: 26,
            seatsAvailable: 26,
            assignedSeats: [],
          },
          {
            key: "vvip-premium",
            name: "VVIP Premium",
            description: "Premium ringside seating. VIP treatment.",
            perks: ["VIP treatment", "Pick your exact seat"],
            priceETB: 50000,
            priceUSD: 450,
            seatsTotal: 26,
            seatsAvailable: 26,
            assignedSeats: [],
          },
          {
            key: "vvip-normal",
            name: "VVIP Normal",
            description: "Close ringside view. Auto-assigned best seats.",
            perks: ["Great value", "Auto-assigned seats"],
            priceETB: 30000,
            priceUSD: 270,
            seatsTotal: 26,
            seatsAvailable: 26,
            assignedSeats: [],
            autoAssign: true,
          },
          {
            key: "vip",
            name: "VIP",
            description: "Reserved seating block, closer to the ring.",
            perks: ["Priority entry", "Reserved block"],
            priceETB: 20000,
            priceUSD: 180,
            seatsTotal: 53,
            seatsAvailable: 53,
            assignedSeats: [],
          },
          {
            key: "early-bird",
            name: "Early Bird",
            description: "General admission. Best price.",
            perks: ["Best price", "General admission"],
            priceETB: 6000,
            priceUSD: 55,
            seatsTotal: 13,
            seatsAvailable: 13,
            assignedSeats: [],
            autoAssign: true,
          },
        ],
        fightCard: [
          {
            boutNumber: 1,
            sport: "MMA",
            division: "Heavyweight",
            rounds: 5,
            isMainEvent: true,
            redCorner: sedo._id,
            redCornerName: "Sedo",
            blueCorner: johnny._id,
            blueCornerName: "Johnny B",
          },
        ],
        ppv: {
          available: true,
          priceETB: 1500,
          priceUSD: 25,
          liveUrl: "",
        },
      },
    },
    { upsert: true, returnDocument: "after" }
  );

  console.log("Seeded:");
  console.log(`  Fighters : ${sedo.name} (${sedo._id}), ${johnny.name} (${johnny._id})`);
  console.log(`  Event    : ${event.name} (${event._id})`);
  console.log(`  Tiers    : ${event.ticketTiers.map((t) => `${t.key}@${t.priceETB}ETB`).join(", ")}`);
  console.log("Done.");
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error("Seed failed:", err);
    process.exit(1);
  });
