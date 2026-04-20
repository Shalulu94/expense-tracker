import Papa from 'papaparse';
import type { NormalizedRow, BankFormatProfile } from './types';
import { detectBankFormat, detectHeaderlessBankFormat } from './bank-formats';

export interface ParseResult {
  profile: BankFormatProfile | null;
  rows: NormalizedRow[];
  rawHeaders: string[];
  errors: string[];
}

export async function parseStatementFile(file: File): Promise<ParseResult> {
  // 1. Try header-based detection first
  const headerResult = await parseWithHeaders(file);
  if (headerResult.profile) return headerResult;

  // 2. Fall back to headerless detection
  return parseHeaderless(file);
}

function parseWithHeaders(file: File): Promise<ParseResult> {
  return new Promise((resolve) => {
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        const rawHeaders = results.meta.fields ?? [];
        const errors: string[] = results.errors.map((e) => e.message);
        const profile = detectBankFormat(rawHeaders);
        const rows: NormalizedRow[] = [];

        if (profile) {
          for (const rawRow of results.data as Record<string, string>[]) {
            const mapped = profile.map(rawRow);
            if (mapped && mapped.description && mapped.date) rows.push(mapped);
          }
        }

        resolve({ profile, rows, rawHeaders, errors });
      },
      error: (error) => resolve({ profile: null, rows: [], rawHeaders: [], errors: [error.message] }),
    });
  });
}

function parseHeaderless(file: File): Promise<ParseResult> {
  return new Promise((resolve) => {
    Papa.parse(file, {
      header: false,
      skipEmptyLines: true,
      complete: (results) => {
        const data = results.data as string[][];
        if (data.length === 0) {
          resolve({ profile: null, rows: [], rawHeaders: [], errors: ['No data found in file.'] });
          return;
        }

        const firstRow = data[0];
        const profile = detectHeaderlessBankFormat(firstRow);

        if (!profile) {
          resolve({
            profile: null,
            rows: [],
            rawHeaders: firstRow,
            errors: ['Could not detect bank format. No matching profile found for this CSV layout.'],
          });
          return;
        }

        const rows: NormalizedRow[] = [];
        for (const rawArr of data) {
          const rawRow: Record<string, string> = {};
          rawArr.forEach((val, i) => { rawRow[String(i)] = val; });
          const mapped = profile.map(rawRow);
          if (mapped && mapped.description && mapped.date) rows.push(mapped);
        }

        resolve({ profile, rows, rawHeaders: firstRow, errors: results.errors.map((e) => e.message) });
      },
      error: (error) => resolve({ profile: null, rows: [], rawHeaders: [], errors: [error.message] }),
    });
  });
}
