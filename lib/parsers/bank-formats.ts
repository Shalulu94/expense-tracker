import type { BankFormatProfile, NormalizedRow } from './types';
import { format, parse } from 'date-fns';

function parseAmount(str: string): number {
  return parseFloat(str.replace(/[£$€,\s]/g, '')) || 0;
}

function parseDate(str: string, fmt: string): string {
  try {
    return format(parse(str.trim(), fmt, new Date()), 'yyyy-MM-dd');
  } catch {
    // fallback: try ISO
    const d = new Date(str.trim());
    return isNaN(d.getTime()) ? str.trim() : format(d, 'yyyy-MM-dd');
  }
}

// Normalize header keys for comparison
function hasHeaders(headers: string[], ...required: string[]): boolean {
  const lower = headers.map((h) => h.toLowerCase().trim());
  return required.every((r) => lower.some((h) => h.includes(r.toLowerCase())));
}

export const BANK_FORMAT_PROFILES: BankFormatProfile[] = [
  // ── Barclays UK ──────────────────────────────────────────────────────────
  {
    id: 'barclays-uk',
    name: 'Barclays (UK)',
    country: 'GB',
    detect: (headers) => hasHeaders(headers, 'Number', 'Date', 'Account', 'Amount', 'Subcategory', 'Memo'),
    map: (row): NormalizedRow | null => {
      const amount = parseAmount(row['Amount'] ?? '0');
      return {
        date: parseDate(row['Date'] ?? '', 'dd/MM/yyyy'),
        description: (row['Memo'] ?? row['Subcategory'] ?? '').trim(),
        amount: Math.abs(amount),
        balance: parseAmount(row['Balance'] ?? '0'),
      };
    },
  },

  // ── HSBC UK ──────────────────────────────────────────────────────────────
  {
    id: 'hsbc-uk',
    name: 'HSBC (UK)',
    country: 'GB',
    detect: (headers) => hasHeaders(headers, 'Date', 'Description', 'Debit/Credit', 'Balance'),
    map: (row): NormalizedRow | null => {
      const debitCredit = row['Debit/Credit'] ?? row['Amount'] ?? '0';
      const amount = parseAmount(debitCredit);
      return {
        date: parseDate(row['Date'] ?? '', 'dd MMM yyyy'),
        description: (row['Description'] ?? '').trim(),
        amount: Math.abs(amount),
        balance: parseAmount(row['Balance'] ?? '0'),
      };
    },
  },

  // ── Monzo UK ─────────────────────────────────────────────────────────────
  {
    id: 'monzo-uk',
    name: 'Monzo (UK)',
    country: 'GB',
    detect: (headers) => hasHeaders(headers, 'Transaction ID', 'Date', 'Time', 'Name', 'Amount', 'Currency'),
    map: (row): NormalizedRow | null => {
      const amount = parseAmount(row['Amount'] ?? '0');
      return {
        date: parseDate(row['Date'] ?? '', 'dd/MM/yyyy'),
        description: (row['Name'] ?? row['Description'] ?? '').trim(),
        amount: Math.abs(amount),
        balance: parseAmount(row['Balance'] ?? '0'),
        reference: row['Transaction ID'],
      };
    },
  },

  // ── Starling Bank UK ─────────────────────────────────────────────────────
  {
    id: 'starling-uk',
    name: 'Starling Bank (UK)',
    country: 'GB',
    detect: (headers) => hasHeaders(headers, 'Date', 'Counter Party', 'Reference', 'Type', 'Amount (GBP)'),
    map: (row): NormalizedRow | null => {
      const amount = parseAmount(row['Amount (GBP)'] ?? '0');
      return {
        date: parseDate(row['Date'] ?? '', 'dd/MM/yyyy'),
        description: (row['Counter Party'] ?? row['Reference'] ?? '').trim(),
        amount: Math.abs(amount),
        balance: parseAmount(row['Balance (GBP)'] ?? '0'),
        reference: row['Reference'],
      };
    },
  },

  // ── Lloyds UK ────────────────────────────────────────────────────────────
  {
    id: 'lloyds-uk',
    name: 'Lloyds Bank (UK)',
    country: 'GB',
    detect: (headers) => hasHeaders(headers, 'Transaction Date', 'Transaction Type', 'Sort Code', 'Account Number', 'Transaction Description', 'Debit Amount', 'Credit Amount'),
    map: (row): NormalizedRow | null => {
      const debit = parseAmount(row['Debit Amount'] ?? '0');
      const credit = parseAmount(row['Credit Amount'] ?? '0');
      const amount = debit > 0 ? debit : credit;
      return {
        date: parseDate(row['Transaction Date'] ?? '', 'dd/MM/yyyy'),
        description: (row['Transaction Description'] ?? '').trim(),
        amount: Math.abs(amount),
        balance: parseAmount(row['Balance'] ?? '0'),
      };
    },
  },

  // ── NatWest / RBS UK ─────────────────────────────────────────────────────
  {
    id: 'natwest-uk',
    name: 'NatWest / RBS (UK)',
    country: 'GB',
    detect: (headers) => hasHeaders(headers, 'Date', 'Transaction Type', 'Description', 'Value', 'Balance', 'Account Name'),
    map: (row): NormalizedRow | null => {
      const value = parseAmount(row['Value'] ?? '0');
      return {
        date: parseDate(row['Date'] ?? '', 'dd/MM/yyyy'),
        description: (row['Description'] ?? '').trim(),
        amount: Math.abs(value),
        balance: parseAmount(row['Balance'] ?? '0'),
      };
    },
  },

  // ── Santander UK ─────────────────────────────────────────────────────────
  {
    id: 'santander-uk',
    name: 'Santander (UK)',
    country: 'GB',
    detect: (headers) => hasHeaders(headers, 'Date', 'Description', 'Amount', 'Balance') && headers.length <= 5,
    map: (row): NormalizedRow | null => {
      const amount = parseAmount(row['Amount'] ?? '0');
      return {
        date: parseDate(row['Date'] ?? '', 'dd/MM/yyyy'),
        description: (row['Description'] ?? '').trim(),
        amount: Math.abs(amount),
        balance: parseAmount(row['Balance'] ?? '0'),
      };
    },
  },

  // ── Chase US ─────────────────────────────────────────────────────────────
  {
    id: 'chase-us',
    name: 'Chase (US)',
    country: 'US',
    detect: (headers) => hasHeaders(headers, 'Transaction Date', 'Post Date', 'Description', 'Category', 'Type', 'Amount', 'Memo'),
    map: (row): NormalizedRow | null => {
      const amount = parseAmount(row['Amount'] ?? '0');
      return {
        date: parseDate(row['Transaction Date'] ?? '', 'MM/dd/yyyy'),
        description: (row['Description'] ?? '').trim(),
        amount: Math.abs(amount),
      };
    },
  },

  // ── Commonwealth Bank (CommBank) AU ──────────────────────────────────────
  {
    id: 'commbank-au',
    name: 'Commonwealth Bank (AU)',
    country: 'AU',
    detect: (headers) => hasHeaders(headers, 'Date', 'Amount', 'Description') && hasHeaders(headers, 'Balance') && headers.length <= 5,
    map: (row): NormalizedRow | null => {
      const amount = parseAmount(row['Amount'] ?? '0');
      return {
        date: parseDate(row['Date'] ?? '', 'dd/MM/yyyy'),
        description: (row['Description'] ?? '').trim(),
        amount: Math.abs(amount),
        balance: parseAmount(row['Balance'] ?? '0'),
      };
    },
  },

  // ── ANZ Bank AU ───────────────────────────────────────────────────────────
  {
    id: 'anz-au',
    name: 'ANZ Bank (AU)',
    country: 'AU',
    detect: (headers) => hasHeaders(headers, 'Date', 'Amount', 'Description', 'Type', 'Balance') && headers.length <= 6,
    map: (row): NormalizedRow | null => {
      const amount = parseAmount(row['Amount'] ?? '0');
      return {
        date: parseDate(row['Date'] ?? '', 'dd/MM/yyyy'),
        description: (row['Description'] ?? '').trim(),
        amount: Math.abs(amount),
        balance: parseAmount(row['Balance'] ?? '0'),
      };
    },
  },

  // ── NAB (National Australia Bank) ────────────────────────────────────────
  {
    id: 'nab-au',
    name: 'NAB (AU)',
    country: 'AU',
    detect: (headers) => hasHeaders(headers, 'Date', 'Amount', 'Particulars', 'Code', 'Reference', 'Balance'),
    map: (row): NormalizedRow | null => {
      const amount = parseAmount(row['Amount'] ?? '0');
      const desc = [row['Particulars'], row['Code'], row['Reference']]
        .filter(Boolean).join(' ').trim();
      return {
        date: parseDate(row['Date'] ?? '', 'dd-MMM-yy'),
        description: desc,
        amount: Math.abs(amount),
        balance: parseAmount(row['Balance'] ?? '0'),
      };
    },
  },

  // ── Westpac AU ────────────────────────────────────────────────────────────
  // Columns: Bank Account, Date, Narrative, Debit Amount, Credit Amount, Balance, Categories, Serial
  // Only import debit rows — credits are payments received / refunds, not expenses.
  {
    id: 'westpac-au',
    name: 'Westpac (AU)',
    country: 'AU',
    detect: (headers) => hasHeaders(headers, 'Date', 'Narrative', 'Debit Amount', 'Credit Amount', 'Balance'),
    map: (row): NormalizedRow | null => {
      const debit = parseAmount(row['Debit Amount'] ?? '');
      if (!debit) return null; // skip credits / empty rows
      return {
        date: parseDate(row['Date'] ?? '', 'dd/MM/yyyy'),
        description: (row['Narrative'] ?? '').trim(),
        amount: debit,
        balance: parseAmount(row['Balance'] ?? '0'),
      };
    },
  },

  // ── ING Bank AU ───────────────────────────────────────────────────────────
  {
    id: 'ing-au',
    name: 'ING Bank (AU)',
    country: 'AU',
    detect: (headers) => hasHeaders(headers, 'Date', 'Description', 'Credit', 'Debit', 'Balance') && headers.length <= 6,
    map: (row): NormalizedRow | null => {
      const debit = parseAmount(row['Debit'] ?? '0');
      const credit = parseAmount(row['Credit'] ?? '0');
      return {
        date: parseDate(row['Date'] ?? '', 'dd/MM/yyyy'),
        description: (row['Description'] ?? '').trim(),
        amount: Math.abs(debit > 0 ? debit : credit),
        balance: parseAmount(row['Balance'] ?? '0'),
      };
    },
  },

  // ── Macquarie Bank AU ─────────────────────────────────────────────────────
  {
    id: 'macquarie-au',
    name: 'Macquarie Bank (AU)',
    country: 'AU',
    detect: (headers) => hasHeaders(headers, 'Completed Date', 'Description', 'Debit', 'Credit', 'Running Balance'),
    map: (row): NormalizedRow | null => {
      const debit = parseAmount(row['Debit'] ?? '0');
      const credit = parseAmount(row['Credit'] ?? '0');
      return {
        date: parseDate(row['Completed Date'] ?? '', 'dd/MM/yyyy'),
        description: (row['Description'] ?? '').trim(),
        amount: Math.abs(debit > 0 ? debit : credit),
        balance: parseAmount(row['Running Balance'] ?? '0'),
      };
    },
  },

  // ── Up Bank AU ────────────────────────────────────────────────────────────
  {
    id: 'up-au',
    name: 'Up Bank (AU)',
    country: 'AU',
    detect: (headers) => hasHeaders(headers, 'Date', 'Description', 'Value', 'Category', 'Tags'),
    map: (row): NormalizedRow | null => {
      const amount = parseAmount(row['Value'] ?? '0');
      return {
        date: parseDate(row['Date'] ?? '', 'yyyy-MM-dd'),
        description: (row['Description'] ?? '').trim(),
        amount: Math.abs(amount),
      };
    },
  },

  // ── CommBank AU — no-header export (col 0=date, 1=amount, 2=description, 3=balance) ──
  {
    id: 'commbank-au-noheader',
    name: 'Commonwealth Bank (AU)',
    country: 'AU',
    headerless: true,
    detect: (firstRow) => /^\d{2}\/\d{2}\/\d{4}$/.test((firstRow[0] ?? '').trim()),
    map: (row): NormalizedRow | null => {
      const amount = parseAmount(row['1'] ?? '0');
      return {
        date: parseDate(row['0'] ?? '', 'dd/MM/yyyy'),
        description: (row['2'] ?? '').replace(/\s+/g, ' ').trim(),
        amount: Math.abs(amount),
        balance: parseAmount(row['3'] ?? '0'),
      };
    },
  },

  // ── Generic fallback (Date, Description, Amount columns) ─────────────────
  {
    id: 'generic',
    name: 'Generic CSV',
    country: 'ANY',
    detect: (headers) => hasHeaders(headers, 'Date') && hasHeaders(headers, 'Amount'),
    map: (row): NormalizedRow | null => {
      const descKey = Object.keys(row).find((k) =>
        ['description', 'merchant', 'payee', 'memo', 'details', 'reference', 'narrative']
          .some((d) => k.toLowerCase().includes(d))
      ) ?? '';
      const amount = parseAmount(row['Amount'] ?? row['Debit'] ?? row['Credit'] ?? '0');
      const dateStr = row['Date'] ?? row['Transaction Date'] ?? '';
      return {
        date: parseDate(dateStr, 'dd/MM/yyyy'),
        description: (descKey ? row[descKey] : '').trim(),
        amount: Math.abs(amount),
      };
    },
  },
];

// Ordered list of selectable banks for the UI dropdown (excludes generic + headerless)
export const SELECTABLE_BANK_PROFILES = BANK_FORMAT_PROFILES.filter(
  (p) => !p.headerless && p.id !== 'generic'
).map((p) => ({ id: p.id, name: p.name, country: p.country }));

export function getProfileById(id: string): BankFormatProfile | null {
  return BANK_FORMAT_PROFILES.find((p) => p.id === id) ?? null;
}

export function detectBankFormat(headers: string[], forceProfileId?: string): BankFormatProfile | null {
  if (forceProfileId) {
    const forced = getProfileById(forceProfileId);
    if (forced) return forced;
  }
  // Only try header-based (non-headerless) profiles
  const specific = BANK_FORMAT_PROFILES.filter((p) => !p.headerless && p.id !== 'generic');
  for (const profile of specific) {
    if (profile.detect(headers)) return profile;
  }
  const generic = BANK_FORMAT_PROFILES.find((p) => p.id === 'generic');
  return generic?.detect(headers) ? generic : null;
}

export function detectHeaderlessBankFormat(firstRowValues: string[]): BankFormatProfile | null {
  const headerlessProfiles = BANK_FORMAT_PROFILES.filter((p) => p.headerless);
  for (const profile of headerlessProfiles) {
    if (profile.detect(firstRowValues)) return profile;
  }
  return null;
}
