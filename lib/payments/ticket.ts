import crypto from "crypto";

/**
 * Digital ticket payload — the exact string a QR code encodes.
 *
 * The payload is a compact JSON object carrying everything a door scanner
 * needs, signed with an HMAC-SHA256 token so forged tickets are rejected.
 */
export interface TicketPayloadData {
  /** Payload schema version */
  v: number;
  type: "ticket";
  ticketId: string; // DigitalTicket._id
  eventSlug: string;
  eventName: string;
  /** ISO date of the event */
  date: string;
  venue?: string;
  tier: string; // tier key, e.g. "vip"
  tierName: string;
  seat: string | null;
  email: string;
  txRef: string;
  provider: "chapa" | "stripe";
  /** ISO timestamp of issuance */
  issuedAt: string;
}

function signingSecret(): string {
  const secret = process.env.TICKET_SIGNING_SECRET;
  if (!secret) {
    throw new Error(
      "TICKET_SIGNING_SECRET is not set. Generate one with: openssl rand -hex 32"
    );
  }
  return secret;
}

/**
 * Builds the signed QR payload for a digital ticket.
 * Returns the JSON payload string plus the HMAC signature token.
 */
export function createTicketPayload(
  data: Omit<TicketPayloadData, "v" | "issuedAt" | "type">
): { payload: string; token: string } {
  const full: TicketPayloadData = {
    v: 1,
    type: "ticket",
    issuedAt: new Date().toISOString(),
    ...data,
  };

  const payload = JSON.stringify(full);
  const token = crypto
    .createHmac("sha256", signingSecret())
    .update(payload)
    .digest("hex");

  return { payload, token };
}

/**
 * Verifies a scanned ticket's payload + token pair. Returns the decoded data
 * when the signature is valid, otherwise null (forged or corrupted ticket).
 */
export function verifyTicketPayload(
  payload: string,
  token: string
): TicketPayloadData | null {
  const expected = crypto
    .createHmac("sha256", signingSecret())
    .update(payload)
    .digest("hex");

  const a = Buffer.from(expected, "hex");
  const b = Buffer.from(token, "hex");
  if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) return null;

  try {
    const data = JSON.parse(payload) as TicketPayloadData;
    if (data.v !== 1 || data.type !== "ticket") return null;
    return data;
  } catch {
    return null;
  }
}
