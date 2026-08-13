import { NextResponse } from "next/server";
import { verifyChapaSignature, chapaVerify } from "@/lib/payments/chapa";
import { handlePaymentSuccess } from "@/lib/payments/fulfill";

export const runtime = "nodejs";

interface ChapaWebhook {
  event?: string;
  tx_ref?: string;
  id?: string;
  data?: {
    tx_ref?: string;
    reference?: string;
    id?: string;
  };
}

/**
 * POST /api/webhooks/chapa
 *
 * Receives Chapa's server-to-server payment notifications (`charge.success`,
 * `charge.refunded`, ...). Configure this URL as the webhook/callback URL in
 * the Chapa dashboard, and set your webhook secret hash to sign the payload.
 *
 * Security: the HMAC signature is verified first, then the transaction is
 * re-verified against Chapa's verify endpoint before anything is issued.
 */
export async function POST(request: Request) {
  const rawBody = await request.text();
  const signature =
    request.headers.get("x-chapa-signature") ??
    request.headers.get("chapa-signature");

  if (!verifyChapaSignature(rawBody, signature)) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }

  let event: ChapaWebhook;
  try {
    event = JSON.parse(rawBody) as ChapaWebhook;
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  if (event.event === "charge.success") {
    const txRef = event.tx_ref ?? event.data?.tx_ref;
    if (txRef) {
      // Belt and braces: confirm with Chapa's API before fulfilling.
      const verified = await chapaVerify(txRef);
      if (verified?.status === "success") {
        // Idempotency key. If Chapa omits an event id, namespace by event
        // type so a later different event for the same tx isn't collapsed.
        const eventId = String(
          event.id ?? event.data?.id ?? `${event.event}:${txRef}`
        );
        await handlePaymentSuccess({
          provider: "chapa",
          eventId,
          txRef,
          providerTxId: verified.reference ?? event.data?.reference,
        });
      }
    }
  }

  // Always acknowledge — Chapa retries on anything but a 2xx.
  return NextResponse.json({ received: true });
}
