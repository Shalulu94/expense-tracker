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
