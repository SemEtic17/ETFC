import Stripe from "stripe";

let _stripe: Stripe | null = null;

/**
 * Lazily-constructed Stripe client. Instantiation is deferred so that
 * importing this module never throws when STRIPE_SECRET_KEY is missing
 * (e.g. in dev environments that only use Chapa).
 */
export function getStripe(): Stripe {
  if (_stripe) return _stripe;

  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) {
    throw new Error(
      "STRIPE_SECRET_KEY is not set. Add it to .env.local to enable Stripe."
    );
  }

  _stripe = new Stripe(key);
  return _stripe;
}
