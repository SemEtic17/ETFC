import crypto from "crypto";

const CHAPA_BASE_URL = "https://api.chapa.co/v1";
// Guard against a hung Chapa API hanging a serverless webhook/route handler.
const CHAPA_TIMEOUT_MS = 15_000;

function chapaHeaders(): Record<string, string> {
  const key = process.env.CHAPA_SECRET_KEY;
  if (!key) {
    throw new Error(
      "CHAPA_SECRET_KEY is not set. Add it to .env.local to enable Chapa."
    );
  }
  return {
    Authorization: `Bearer ${key}`,
    "Content-Type": "application/json",
  };
}

export interface ChapaInitializeParams {
  amount: number; // ETB
  currency: "ETB";
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  txRef: string; // unique merchant reference, echoed back in webhooks
  callbackUrl: string; // server-side webhook URL (Chapa sends status updates)
  returnUrl: string; // where the customer is redirected after paying
  title?: string;
  description?: string;
  meta?: Record<string, unknown>;
}

export interface ChapaInitializeResult {
  checkout_url: string;
  tx_ref?: string;
}

/**
 * POST /transaction/initialize — creates a hosted Chapa checkout where the
 * customer pays via Telebirr, CBE Birr, cards, etc.
 */
export async function chapaInitialize(
  params: ChapaInitializeParams
): Promise<ChapaInitializeResult> {
  const res = await fetch(`${CHAPA_BASE_URL}/transaction/initialize`, {
    method: "POST",
    headers: chapaHeaders(),
    signal: AbortSignal.timeout(CHAPA_TIMEOUT_MS),
    body: JSON.stringify({
      amount: String(params.amount),
      currency: params.currency,
      email: params.email,
      first_name: params.firstName,
      last_name: params.lastName,
      phone_number: params.phone,
      tx_ref: params.txRef,
      callback_url: params.callbackUrl,
      return_url: params.returnUrl,
      customization: {
        title: params.title,
        description: params.description,
      },
      meta: params.meta,
    }),
  });

  const json = (await res.json().catch(() => null)) as {
    status?: string;
    message?: string;
    data?: ChapaInitializeResult;
  } | null;

  if (!res.ok || json?.status !== "success" || !json?.data?.checkout_url) {
    throw new Error(
      json?.message || `Chapa initialize failed (HTTP ${res.status})`
    );
  }

  return json.data;
}

export interface ChapaVerification {
  status?: string; // "success" | "failed" | ...
  reference?: string;
  amount?: string;
  currency?: string;
}

/**
 * GET /transaction/verify/:tx_ref — server-side confirmation that a
 * transaction really succeeded before we issue anything.
 */
export async function chapaVerify(txRef: string): Promise<ChapaVerification | null> {
  const res = await fetch(
    `${CHAPA_BASE_URL}/transaction/verify/${encodeURIComponent(txRef)}`,
    {
      headers: chapaHeaders(),
      cache: "no-store",
      signal: AbortSignal.timeout(CHAPA_TIMEOUT_MS),
    }
  );

  const json = (await res.json().catch(() => null)) as {
    status?: string;
    data?: ChapaVerification;
  } | null;

  return json?.data ?? null;
}

/**
 * Verifies the HMAC-SHA256 signature Chapa attaches to webhook payloads.
 *
 * Chapa signs the raw request body with your secret hash and sends it in the
 * `x-chapa-signature` (or `chapa-signature`) header. We compare using a
 * constant-time comparison to avoid timing attacks.
 *
 * NOTE: Chapa's exact hashing of the body has changed between API versions.
 * If signature checks fail with a *real* webhook, try hashing the
 * JSON-stringified body instead of the raw bytes.
 */
export function verifyChapaSignature(
  rawBody: string,
  signature: string | null
): boolean {
  if (!signature) return false;

  const secret =
    process.env.CHAPA_WEBHOOK_SECRET ?? process.env.CHAPA_SECRET_KEY;
  if (!secret) return false;

  const expected = crypto
    .createHmac("sha256", secret)
    .update(rawBody)
    .digest("hex");

  const a = Buffer.from(expected, "hex");
  const b = Buffer.from(signature, "hex");
  if (a.length !== b.length) return false;

  return crypto.timingSafeEqual(a, b);
}
