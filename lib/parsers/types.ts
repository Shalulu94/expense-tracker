export interface NormalizedRow {
  date: string;      // YYYY-MM-DD
  description: string;
  amount: number;    // positive = debit/expense, negative = credit/income
  balance?: number;
  reference?: string;
}

export interface BankFormatProfile {
  id: string;
  name: string;
  country: string;
  headerless?: boolean; // true = CSV has no header row; detect receives first-row values; map keys are '0','1','2'...
  detect: (headers: string[]) => boolean;
  map: (row: Record<string, string>) => NormalizedRow | null;
}
