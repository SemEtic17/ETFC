import crypto from "crypto";
import dbConnect from "@/lib/db";
import EventModel from "@/lib/models/Event";
import UserModel from "@/lib/models/User";
import DigitalTicketModel from "@/lib/models/DigitalTicket";
import PPVPurchaseModel from "@/lib/models/PPVPurchase";
import MerchOrderModel from "@/lib/models/MerchOrder";
import WebhookEventModel from "@/lib/models/WebhookEvent";
import { createTicketPayload } from "@/lib/payments/ticket";

export interface PaymentConfirmation {
  provider: "chapa" | "stripe";
  /** Provider webhook event id — used for idempotency. */
  eventId: string;
  /** Our unique transaction reference, generated at checkout time. */
  txRef: string;
  providerTxId?: string;
}

export interface FulfillmentResult {
  handled: boolean;
  reason?: string;
  ticketId?: string;
}

/**
 * Shared fulfillment for both payment providers. Called from the Chapa and
 * Stripe webhook handlers after the signature has been verified.
 *
 * Steps:
 *  1. Idempotency — reject webhook events we've already processed.
 *  2. Locate the pending artifact created at checkout (ticket / PPV / order).
 *  3. Generate the unique digital ticket (QR payload) and mark it issued.
 */
export async function handlePaymentSuccess(
  conf: PaymentConfirmation
): Promise<FulfillmentResult> {
  await dbConnect();

  // ── 1. Idempotency ────────────────────────────────────────────────────
  // Insert the webhook event FIRST: the unique index on {provider, eventId}
  // is the atomic gate. A duplicate-key error means a concurrent delivery
  // already claimed this event, so we bail before any side effects. (A
  // check-then-act `findOne` first would let two concurrent deliveries both
  // pass the check and both fulfil.)
  try {
    await WebhookEventModel.create({
      provider: conf.provider,
      eventId: conf.eventId,
      txRef: conf.txRef,
    });
  } catch (err) {
    const isDuplicate =
      typeof err === "object" &&
      err !== null &&
      "code" in err &&
      (err as { code?: number }).code === 11000;
    if (isDuplicate) {
      return { handled: false, reason: "duplicate_webhook_event" };
    }
    throw err;
  }

  // ── 2. Locate the pending artifact created at checkout ────────────────
  const ticket = await DigitalTicketModel.findOne({
    txRef: conf.txRef,
    provider: conf.provider,
  });
  const ppv = ticket
    ? null
    : await PPVPurchaseModel.findOne({
        txRef: conf.txRef,
        provider: conf.provider,
      });
  const order =
    !ticket && !ppv
      ? await MerchOrderModel.findOne({
          txRef: conf.txRef,
          provider: conf.provider,
        })
      : null;

  // Unknown tx_ref — the event was already recorded above (idempotency), and
  // acknowledging with a 2xx stops the provider from retrying.
  if (!ticket && !ppv && !order) {
    return { handled: false, reason: "unknown_tx_ref" };
  }

  // ── 3. Fulfil ─────────────────────────────────────────────────────────
  let ticketId: string | undefined;

  if (ticket) {
    if (ticket.status === "issued") {
      // Safety net — should never happen thanks to step 1, but never re-issue.
      return { handled: true, reason: "already_issued", ticketId: ticket._id.toString() };
    }

    const event = await EventModel.findById(ticket.event);
    const { payload, token } = createTicketPayload({
      ticketId: ticket._id.toString(),
      eventSlug: event?.slug ?? ticket.tier,
      eventName: event?.name ?? "ETFC Event",
      date: event ? new Date(event.date).toISOString() : new Date().toISOString(),
      venue: event?.venue?.name ?? undefined,
      tier: ticket.tier,
      tierName: ticket.tierName,
      seat: ticket.seat ?? null,
      email: ticket.email,
      txRef: ticket.txRef,
      provider: ticket.provider,
    });

    ticket.payload = payload;
    ticket.token = token;
    ticket.status = "issued";
    ticket.issuedAt = new Date();
    if (conf.providerTxId) ticket.providerTxId = conf.providerTxId;
    await ticket.save();

    if (ticket.owner) {
      await UserModel.updateOne(
        { _id: ticket.owner },
        { $addToSet: { tickets: ticket._id } }
      );
    }

    ticketId = ticket._id.toString();
  } else if (ppv) {
    if (ppv.status === "active") {
      return { handled: true, reason: "already_activated" };
    }

    ppv.accessToken = crypto.randomBytes(32).toString("base64url");
    ppv.status = "active";
    ppv.activatedAt = new Date();
    if (conf.providerTxId) ppv.providerTxId = conf.providerTxId;
    await ppv.save();

    if (ppv.owner) {
      await UserModel.updateOne(
        { _id: ppv.owner },
        { $addToSet: { ppvPurchases: ppv._id } }
      );
    }
  } else if (order) {
    if (order.status === "paid") {
      return { handled: true, reason: "already_paid" };
    }

    order.status = "paid";
    if (conf.providerTxId) order.providerTxId = conf.providerTxId;
    await order.save();

    if (order.owner) {
      await UserModel.updateOne(
        { _id: order.owner },
        { $addToSet: { merchOrders: order._id } }
      );
    }
  }

  return { handled: true, ticketId };
}
