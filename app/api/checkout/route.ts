import { NextResponse } from "next/server";
import crypto from "crypto";
import { Types } from "mongoose";
import dbConnect from "@/lib/db";
import EventModel from "@/lib/models/Event";
import UserModel from "@/lib/models/User";
import DigitalTicketModel from "@/lib/models/DigitalTicket";
import PPVPurchaseModel from "@/lib/models/PPVPurchase";
import MerchOrderModel from "@/lib/models/MerchOrder";
import { chapaInitialize } from "@/lib/payments/chapa";
import { getStripe } from "@/lib/payments/stripe";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

class HttpError extends Error {
  constructor(
    public status: number,
    message: string
  ) {
    super(message);
  }
}

interface Customer {
  email: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
}

interface MerchItem {
  name: string;
  sku?: string;
  quantity: number;
  unitPrice: number;
}

interface CheckoutBody {
  provider: "chapa" | "stripe";
  itemType: "ticket" | "ppv" | "merch";
  eventSlug?: string;
  tierKey?: string;
  seat?: string | null;
  merchItems?: MerchItem[];
  customer: Customer;
}

interface BuilderResult {
  pendingId: Types.ObjectId;
  amount: number;
  name: string;
  description?: string;
  // Seat-release info (tickets only) so a failed payment can restore the seat
  eventId?: Types.ObjectId;
  tierKey?: string;
  seatLabel?: string;
}

function genTxRef(prefix = "ETFC"): string {
  return `${prefix}-${Date.now()}-${crypto.randomBytes(6).toString("hex")}`;
}

/**
 * POST /api/checkout
 *
 * Creates a pending purchase (ticket / PPV / merch order) in MongoDB and
 * starts a payment with the requested provider:
 *
 *   - provider "chapa"  → hosted Chapa checkout (Telebirr, CBE Birr, cards)
 *   - provider "stripe" → Stripe Checkout session (global card payments)
 *
 * Body:
 *   {
 *     "provider": "chapa" | "stripe",
 *     "itemType": "ticket" | "ppv" | "merch",
 *     "eventSlug": "adwa-fight-night",          // ticket/ppv
 *     "tierKey": "vip",                          // ticket
 *     "seat": "vip-03",                          // optional exact seat
 *     "merchItems": [{ name, sku?, quantity, unitPrice }], // merch
 *     "customer": { email, firstName?, lastName?, phone? }
 *   }
 *
 * Response: { checkoutUrl, txRef, provider, itemType, orderId }
 *
 * The pending record is fulfilled later by the webhook handler, which issues
 * the unique digital ticket (QR payload) once payment is confirmed.
 */
export async function POST(request: Request) {
  try {
    return await handleCheckout(request);
  } catch (err) {
    if (err instanceof HttpError) {
      return NextResponse.json({ error: err.message }, { status: err.status });
    }
    console.error("[checkout] unexpected error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

async function handleCheckout(request: Request): Promise<NextResponse> {
  let body: CheckoutBody;
  try {
    body = (await request.json()) as CheckoutBody;
  } catch {
    throw new HttpError(400, "Invalid JSON body");
  }

  const { provider, itemType, customer } = body;
  if (provider !== "chapa" && provider !== "stripe") {
    throw new HttpError(400, "provider must be 'chapa' or 'stripe'");
  }
  if (!itemType || !["ticket", "ppv", "merch"].includes(itemType)) {
    throw new HttpError(400, "itemType must be 'ticket', 'ppv' or 'merch'");
  }
  const email = customer?.email?.trim().toLowerCase();
  if (!email || !email.includes("@")) {
    throw new HttpError(400, "A valid customer.email is required");
  }

  await dbConnect();

  // Upsert the customer so every purchase is attached to a user record.
  const user = await UserModel.findOneAndUpdate(
    { email },
    {
      $setOnInsert: {
        email,
        firstName: customer.firstName,
        lastName: customer.lastName,
        phone: customer.phone,
        role: "customer",
      },
    },
    { upsert: true, returnDocument: "after" }
  );
  if (!user) throw new HttpError(500, "Failed to create user record");

  // Currency follows the provider: ETB domestically, USD internationally.
  const currency = provider === "chapa" ? "ETB" : "USD";

  // ── Build the pending purchase ────────────────────────────────────────
  let result: BuilderResult;
  if (itemType === "ticket") {
    result = await buildTicketPurchase(body, currency, user._id, email);
  } else if (itemType === "ppv") {
    result = await buildPPVPurchase(body, currency, user._id, email);
  } else {
    result = await buildMerchOrder(body, currency, user._id, email);
  }

  const txRef = genTxRef();

  try {
    // ── Provider kick-off ───────────────────────────────────────────────
    if (provider === "chapa") {
      const checkout = await chapaInitialize({
        amount: Math.round(result.amount),
        currency: "ETB",
        email,
        firstName: customer.firstName ?? "",
        lastName: customer.lastName ?? "",
        phone: customer.phone,
        txRef,
        callbackUrl: `${APP_URL}/api/webhooks/chapa`,
        returnUrl: `${APP_URL}/payment/success?provider=chapa&tx_ref=${txRef}`,
        title: result.name,
        description: result.description,
        meta: { itemType, orderId: String(result.pendingId) },
      });

      return NextResponse.json({
        checkoutUrl: checkout.checkout_url,
        txRef,
        provider,
        itemType,
        orderId: String(result.pendingId),
      });
    }

    // Stripe
    const stripe = getStripe();
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      customer_email: email,
      line_items: [
        {
          quantity: 1,
          price_data: {
            currency: "usd",
            unit_amount: Math.round(result.amount * 100), // dollars → cents
            product_data: {
              name: result.name,
              description: result.description,
            },
          },
        },
      ],
      metadata: {
        itemType,
        orderId: String(result.pendingId),
        txRef,
        provider: "stripe",
      },
      success_url: `${APP_URL}/payment/success?provider=stripe&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${APP_URL}/payment/cancelled?tx_ref=${txRef}`,
    });

    return NextResponse.json({
      checkoutUrl: session.url,
      txRef,
      provider,
      itemType,
      orderId: String(result.pendingId),
    });
  } catch (err) {
    // Payment could not be started — remove the pending record and restore
    // the reserved seat (tickets only) so nothing leaks.
    const id = result.pendingId;
    if (itemType === "ticket") {
      await DigitalTicketModel.deleteOne({ _id: id });
      if (result.eventId && result.tierKey && result.seatLabel) {
        await releaseSeat(result.eventId, result.tierKey, result.seatLabel);
      }
    } else if (itemType === "ppv") {
      await PPVPurchaseModel.deleteOne({ _id: id });
    } else {
      await MerchOrderModel.deleteOne({ _id: id });
    }
    throw err;
  }
}

// ── Purchase builders ─────────────────────────────────────────────────────

async function buildTicketPurchase(
  body: CheckoutBody,
  currency: "ETB" | "USD",
  ownerId: Types.ObjectId,
  email: string
): Promise<BuilderResult> {
  const { eventSlug, tierKey, seat } = body;
  if (!eventSlug || !tierKey) {
    throw new HttpError(400, "eventSlug and tierKey are required for tickets");
  }

  const event = await EventModel.findOne({
    slug: eventSlug,
    status: { $ne: "completed" },
  });
  if (!event) throw new HttpError(404, "Event not found");

  const tier = event.ticketTiers?.find((t) => t.key === tierKey);
  if (!tier) throw new HttpError(404, `Ticket tier '${tierKey}' not found`);
  if ((tier.seatsAvailable ?? 0) <= 0) {
    throw new HttpError(409, `Ticket tier '${tier.name}' is sold out`);
  }

  const price = Number(currency === "ETB" ? tier.priceETB : tier.priceUSD);
  if (!Number.isFinite(price) || price <= 0) {
    throw new HttpError(
      400,
      `Tier '${tier.name}' has no ${currency} price configured`
    );
  }

  // Seat selection: exact seat when provided (and not taken), otherwise the
  // next available seat label for the tier.
  let seatLabel: string;
  if (seat) {
    if (tier.assignedSeats?.includes(seat)) {
      throw new HttpError(409, `Seat '${seat}' is already taken`);
    }
    seatLabel = seat;
  } else {
    const sold = (tier.seatsTotal ?? 0) - (tier.seatsAvailable ?? 0);
    seatLabel = `${tierKey}-${String(sold + 1).padStart(2, "0")}`;
  }

  // Create the pending ticket first, then reserve the seat. If the provider
  // kick-off fails later, both are rolled back together.
  const pending = await DigitalTicketModel.create({
    event: event._id,
    tier: tierKey,
    tierName: tier.name,
    seat: seatLabel,
    owner: ownerId,
    email,
    pricePaid: price,
    currency,
    provider: body.provider,
    status: "pending",
  });

  // Atomically reserve the seat. `arrayFilters` targets the exact tier element
  // (the positional $ operator can match the wrong element when the query has
  // multiple conditions on the same array). The `$ne` guard is applied for
  // BOTH exact-seat picks and auto-assigned labels: MongoDB re-evaluates the
  // filter against the updated document, so concurrent requests that compute
  // the same label are serialized — only the first wins, the rest get a 409
  // and a retry computes the next label.
  const updated = await EventModel.findOneAndUpdate(
    {
      _id: event._id,
      "ticketTiers.key": tierKey,
      "ticketTiers.seatsAvailable": { $gt: 0 },
      "ticketTiers.assignedSeats": { $ne: seatLabel },
    },
    {
      $inc: { "ticketTiers.$[t].seatsAvailable": -1 },
      $push: { "ticketTiers.$[t].assignedSeats": seatLabel },
    },
    { arrayFilters: [{ "t.key": tierKey }] }
  );
  if (!updated) {
    // Seat was lost to a concurrent purchase — remove the pending ticket.
    await DigitalTicketModel.deleteOne({ _id: pending._id });
    throw new HttpError(409, "That seat is no longer available");
  }

  return {
    pendingId: pending._id,
    amount: price,
    name: `ETFC ${tier.name} Ticket`,
    description: `${event.name} · Seat ${seatLabel}`,
    eventId: event._id,
    tierKey,
    seatLabel,
  };
}

/**
 * Restores a reserved seat (used when the payment cannot be started).
 */
async function releaseSeat(
  eventId: Types.ObjectId,
  tierKey: string,
  seatLabel: string
): Promise<void> {
  await EventModel.updateOne(
    { _id: eventId, "ticketTiers.key": tierKey },
    {
      $inc: { "ticketTiers.$[t].seatsAvailable": 1 },
      $pull: { "ticketTiers.$[t].assignedSeats": seatLabel },
    },
    { arrayFilters: [{ "t.key": tierKey }] }
  );
}

async function buildPPVPurchase(
  body: CheckoutBody,
  currency: "ETB" | "USD",
  ownerId: Types.ObjectId,
  email: string
): Promise<BuilderResult> {
  const { eventSlug } = body;
  if (!eventSlug) throw new HttpError(400, "eventSlug is required for PPV");

  const event = await EventModel.findOne({
    slug: eventSlug,
    status: { $ne: "completed" },
  });
  if (!event) throw new HttpError(404, "Event not found");
  if (!event.ppv?.available) throw new HttpError(409, "PPV is not available");

  const price = Number(currency === "ETB" ? event.ppv.priceETB : event.ppv.priceUSD);
  if (!Number.isFinite(price) || price <= 0) {
    throw new HttpError(400, `PPV has no ${currency} price configured`);
  }

  const pending = await PPVPurchaseModel.create({
    event: event._id,
    owner: ownerId,
    email,
    pricePaid: price,
    currency,
    provider: body.provider,
    status: "pending",
  });

  return {
    pendingId: pending._id,
    amount: price,
    name: `ETFC PPV — ${event.name}`,
    description: "Live stream access for the event.",
  };
}

async function buildMerchOrder(
  body: CheckoutBody,
  currency: "ETB" | "USD",
  ownerId: Types.ObjectId,
  email: string
): Promise<BuilderResult> {
  const items = body.merchItems ?? [];
  if (items.length === 0) {
    throw new HttpError(400, "merchItems is required for merch orders");
  }

  const normalized = items.map((item) => ({
    name: item.name,
    sku: item.sku,
    quantity: item.quantity,
    unitPrice: item.unitPrice,
  }));
  const total = normalized.reduce(
    (sum, item) => sum + item.quantity * item.unitPrice,
    0
  );

  // NOTE: unitPrice currently comes from the client. In production, look
  // prices up server-side from a Product/Inventory model.
  const pending = await MerchOrderModel.create({
    owner: ownerId,
    email,
    items: normalized,
    total,
    currency,
    provider: body.provider,
    status: "pending",
  });

  return {
    pendingId: pending._id,
    amount: total,
    name: "ETFC Store Order",
    description: `${normalized.length} item(s) · ${normalized
      .map((i) => `${i.quantity}× ${i.name}`)
      .join(", ")}`,
  };
}
