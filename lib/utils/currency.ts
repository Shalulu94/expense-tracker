export function formatCurrency(
  amount: number,
  currency = 'GBP',
  options?: Intl.NumberFormatOptions
): string {
  return new Intl.NumberFormat('en-GB', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
    ...options,
  }).format(amount);
}

export function formatCurrencyCompact(amount: number, currency = 'GBP'): string {
  if (Math.abs(amount) >= 1000) {
    return formatCurrency(amount, currency, { notation: 'compact' });
  }
  return formatCurrency(amount, currency);
}

export function parseCurrencyInput(value: string): number {
  // Strip currency symbols and commas, parse as float
  const cleaned = value.replace(/[£$€,\s]/g, '');
  const parsed = parseFloat(cleaned);
  return isNaN(parsed) ? 0 : Math.round(parsed * 100) / 100;
}
