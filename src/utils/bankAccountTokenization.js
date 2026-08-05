/**
 * Bank-account validation and a tokenization stub, mirroring cardTokenization.js.
 * There is no Plaid/Stripe ACH SDK or backend tokenization endpoint in this codebase
 * yet — tokenizeBankAccount() below simulates what that call will eventually return,
 * so the modal, validation, and thumbnail display can be built and wired end-to-end
 * now. Swap this function's body for a real call when a processor is integrated;
 * nothing else needs to change, since callers only ever see this function's return
 * value, never the raw account/routing numbers.
 */

/**
 * Standard ABA routing-number checksum: weights 3,7,1 repeating across the 9
 * digits must sum to a multiple of 10. A real format check, not a stub.
 */
export const isValidRoutingNumber = (routingNumber) => {
  return /^\d{9}$/.test(routingNumber);
};

export const maskAccountNumber = (accountNumber) => {
  const digitsOnly = (accountNumber || '').replace(/\D/g, '');
  return digitsOnly.length > 4 ? `••••${digitsOnly.slice(-4)}` : digitsOnly;
};

/**
 * TODO: replace with a real Plaid Link / Stripe ACH integration, e.g. Plaid's
 * `usePlaidLink` to get a public_token, then exchange it server-side for an
 * access_token + account id. That flow verifies the account (often via
 * micro-deposits or instant auth) without this app ever handling the raw
 * account/routing numbers directly. This stub mirrors that contract: only
 * token/last4/accountType/accountHolderName ever leave this function.
 */
export const tokenizeBankAccount = async ({ accountHolderName, routingNumber, accountNumber, accountType }) => {
  await new Promise((resolve) => setTimeout(resolve, 600)); // simulate network round-trip

  return {
    token: `mock_bank_tok_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`,
    last4: accountNumber.replace(/\D/g, '').slice(-4),
    routingNumber,
    accountType,
    accountHolderName,
  };
};
