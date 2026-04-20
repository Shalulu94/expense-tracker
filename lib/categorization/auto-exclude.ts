// Descriptions matching any of these patterns are automatically pre-excluded
// during import — they represent balance credits, payment receipts, and
// internal transfers that are not real expenses.
//
// Matching is case-insensitive substring. Users can still un-exclude individual
// rows in the import preview if needed.
export const AUTO_EXCLUDE_PATTERNS: string[] = [
  'payment received',
  'payment thank you',
  'thank you for your payment',
  'credit card payment',
  'balance transfer',
  'refund',
  'direct credit',
  'closing balance',
  'opening balance',
];

export function isAutoExcluded(description: string): boolean {
  const lower = description.toLowerCase();
  return AUTO_EXCLUDE_PATTERNS.some((p) => lower.includes(p));
}
