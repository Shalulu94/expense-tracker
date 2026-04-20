// Normalizes merchant names for consistent rule matching and AI cache lookups.
// e.g. 'NETFLIX.COM *SUBSCRIPTION GB' → 'netflix'
export function normalizeMerchant(raw: string): string {
  return raw
    .toLowerCase()
    .replace(/\*.*$/, '')         // strip everything after asterisk
    .replace(/\bltd\b|\bplc\b|\binc\b|\bgmbh\b|\bllc\b/g, '') // strip legal suffixes
    .replace(/\.com|\.co\.uk|\.co|\.uk/g, '') // strip TLDs
    .replace(/[^a-z0-9\s&]/g, ' ') // keep alphanumeric, spaces, ampersands
    .replace(/\s+/g, ' ')           // collapse whitespace
    .trim();
}

// Common bank prefixes that appear before the actual merchant name.
// Order matters — longer/more-specific prefixes are listed first.
const BANK_PREFIXES = [
  'direct debit ',
  'internet transfer ',
  'card payment ',
  'visa purchase ',
  'visa debit ',
  'debit card ',
  'standing order ',
  'auto pay ',
  'autopay ',
  'recurring payment ',
  'recurring ',
  'bill payment ',
  'payment to ',
  'transfer to ',
  'bpay ',
  'eftpos ',
  'sq ',   // Square payment processor (SQ *MERCHANT)
];

// Extracts a stable, meaningful pattern from a normalized merchant string.
// Used when learning rules from user corrections so patterns are specific
// enough to avoid colliding with other merchants.
//
// e.g. 'direct debit origin energy'  → 'origin energy'
//      'woolworths metro 1234'        → 'woolworths metro'
//      'amazon fresh delivery'        → 'amazon fresh'
//      'sq goodbean coffee'           → 'goodbean coffee'
export function extractMerchantPattern(normalized: string): string {
  let s = normalized;

  // Strip known bank prefixes
  for (const prefix of BANK_PREFIXES) {
    if (s.startsWith(prefix)) {
      s = s.slice(prefix.length).trim();
      break;
    }
  }

  // Extract up to 3 meaningful tokens: ≥3 chars and not purely numeric
  const tokens = s
    .split(' ')
    .filter((t) => t.length >= 3 && !/^\d+$/.test(t));

  const pattern = tokens.slice(0, 3).join(' ');

  // Fall back to full normalized string if nothing meaningful was extracted
  return pattern.length >= 4 ? pattern : normalized;
}
