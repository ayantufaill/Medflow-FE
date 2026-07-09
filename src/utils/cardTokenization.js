/**
 * Card-brand detection and number formatting for the credit-card entry form,
 * plus a tokenization stub. There is no Stripe/Braintree SDK or backend
 * tokenization endpoint anywhere in this codebase yet — tokenizeCard() below
 * simulates what that call will eventually return, so the modal, validation,
 * and CardThumbnail display can be built and wired end-to-end now. Swap this
 * function's body for a real call when a processor is integrated; nothing
 * else (the modal, PatientPreferencesGrid, CardThumbnail) needs to change,
 * since they only ever see this function's return value, never the raw PAN/CVV.
 */

const BRAND_PATTERNS = [
  { brand: 'visa', pattern: /^4/ },
  { brand: 'mastercard', pattern: /^(5[1-5]|2[2-7])/ },
  { brand: 'amex', pattern: /^3[47]/ },
  { brand: 'discover', pattern: /^6(?:011|5)/ },
];

export const detectCardBrand = (digitsOnly) => {
  const match = BRAND_PATTERNS.find(({ pattern }) => pattern.test(digitsOnly));
  return match?.brand || 'unknown';
};

/** Amex groups as 4-6-5; every other supported brand groups as 4-4-4-4. */
export const formatCardNumber = (value) => {
  const digitsOnly = value.replace(/\D/g, '').slice(0, 16);
  const brand = detectCardBrand(digitsOnly);

  if (brand === 'amex') {
    const amexDigits = digitsOnly.slice(0, 15);
    const parts = [amexDigits.slice(0, 4), amexDigits.slice(4, 10), amexDigits.slice(10, 15)].filter(Boolean);
    return parts.join(' ');
  }

  return digitsOnly.match(/.{1,4}/g)?.join(' ') || digitsOnly;
};

export const expectedCardLength = (digitsOnly) => (detectCardBrand(digitsOnly) === 'amex' ? 15 : 16);

/**
 * TODO: replace with a real Stripe.js / Braintree Drop-in integration, e.g.:
 *   const stripe = useStripe();
 *   const { paymentMethod, error } = await stripe.createPaymentMethod({
 *     type: 'card',
 *     card: elements.getElement(CardNumberElement),
 *     billing_details: { name: cardholderName },
 *   });
 * That call (or Braintree's client.tokenizeCard()) returns an opaque token —
 * the raw card number and CVV are handled entirely by the processor's own
 * hosted fields/SDK and never touch this app's backend. This stub mirrors
 * that contract: only token/brand/last4/expiry ever leave this function.
 */
export const tokenizeCard = async ({ cardNumber, expMonth, expYear, cardholderName }) => {
  const digitsOnly = cardNumber.replace(/\D/g, '');

  await new Promise((resolve) => setTimeout(resolve, 600)); // simulate network round-trip

  return {
    token: `mock_tok_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`,
    brand: detectCardBrand(digitsOnly),
    last4: digitsOnly.slice(-4),
    expMonth,
    expYear,
    cardholderName,
  };
};
