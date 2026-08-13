import { NextResponse } from "next/server";
import type Stripe from "stripe";
import { getStripe } from "@/lib/payments/stripe";
import { handlePaymentSuccess } from "@/lib/payments/fulfill";

export const runtime = "nodejs";

/**
 * POST /api/webhooks/stripe
 *
 * Receives Stripe payment events (primarily `checkout.session.completed`).
 * Configure this URL as the webhook endpoint in the Stripe dashboard and set
 * STRIPE_WEBHOOK_SECRET so the signature can be verified.
 */
export async function POST(request: Request) {
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!secret) {
    return NextResponse.json(
      { error: "STRIPE_WEBHOOK_SECRET is not configured" },
      { status: 500 }
    );
  }

  const signature = request.headers.get("stripe-signature");
  if (!signature) {
    return NextResponse.json(
      { error: "Missing stripe-signature header" },
      { status: 400 }
    );
  }

  const body = await request.text();

  let event: Stripe.Event;
  try {
    event = await getStripe().webhooks.constructEventAsync(
      body,
      signature,
      secret
    );
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "unknown signature error";
    return NextResponse.json(
      { error: `Webhook signature verification failed: ${message}` },
      { status: 400 }
    );
  }

  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object as Stripe.Checkout.Session;

      // checkout.session.completed can fire with payment_status "unpaid" for
      // async payment methods — never fulfil an unpaid session.
      if (session.payment_status !== "paid") {
        break;
      }

      const txRef = session.metadata?.txRef;
      const itemType = session.metadata?.itemType;

      if (txRef && itemType) {
        const providerTxId =
          typeof session.payment_intent === "string"
            ? session.payment_intent
            : (session.payment_intent?.id ?? session.id);

        await handlePaymentSuccess({
          provider: "stripe",
          eventId: event.id,
          txRef,
          providerTxId,
        });
      }
      break;
    }
    default:
      // Other events (payment_intent.succeeded etc.) are handled by
      // checkout.session.completed; ignore them.
      break;
  }

  return NextResponse.json({ received: true });
}
