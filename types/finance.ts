export const DEFAULT_USER_ID = 'local-user' as const;

// ─── Categories ───────────────────────────────────────────────────────────────

export type CategoryType = 'expense' | 'income' | 'transfer';

export interface Category {
  id: string;
  userId: string;
  name: string;
  icon: string;
  color: string;
  type: CategoryType;
  isSystem: boolean;
  parentId: string | null;
  budgetId: string | null; // future: Budget module
  createdAt: string;
  updatedAt: string;
}

// ─── Recurrence ───────────────────────────────────────────────────────────────

export type RecurrenceFrequency =
  | 'daily'
  | 'weekly'
  | 'biweekly'
  | 'monthly'
  | 'quarterly'
  | 'yearly';

export interface RecurrenceRule {
  frequency: RecurrenceFrequency;
  interval: number;
  startDate: string;
  endDate: string | null;
  dayOfMonth: number | null;
  maxOccurrences: number | null;
}

// ─── Transactions ─────────────────────────────────────────────────────────────

export type TransactionType = 'expense' | 'income' | 'transfer';

export type CategorizationSource = 'manual' | 'rule' | 'ai' | 'user-correction';
export type CategorizationConfidence = 'high' | 'medium' | 'low';

export interface Transaction {
  id: string;
  userId: string;
  type: TransactionType;
  amount: number;
  currency: string;
  date: string; // YYYY-MM-DD
  categoryId: string;
  description: string;
  tags: string[];
  notes: string | null;

  isRecurring: boolean;
  recurrenceRule: RecurrenceRule | null;
  recurrenceGroupId: string | null;

  accountId: string | null; // future: Net Worth module

  attachments: string[];

  // Statement import
  importSessionId: string | null;
  merchantRaw: string | null;
  categorizationSource: CategorizationSource | null;
  categorizationConfidence: CategorizationConfidence | null;

  isExcludedFromBudget: boolean; // future: Budget module
  isSplit: boolean;
  splitGroupId: string | null;

  createdAt: string;
  updatedAt: string;
}

// ─── Import ───────────────────────────────────────────────────────────────────

export interface ImportSession {
  id: string;
  userId: string;
  filename: string;
  bankProfileId: string;
  importedAt: string;
  rowCount: number;
  duplicatesSkipped: number;
  transactionIds: string[];
}

// ─── Merchant Rules ───────────────────────────────────────────────────────────

export type MerchantRuleSource = 'system' | 'ai-learned' | 'user';

export interface MerchantRule {
  id: string;
  pattern: string;
  isRegex: boolean;
  categoryId: string;
  source: MerchantRuleSource;
  matchCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface AiCacheEntry {
  merchantNormalized: string;
  categoryId: string | null;
  confidence: CategorizationConfidence;
  reasoning: string;
  hitCount: number;
  createdAt: string;
}

// ─── Filters ─────────────────────────────────────────────────────────────────

export type DatePreset = 'this_month' | 'last_3_months' | 'last_6_months' | 'this_year' | 'this_financial_year' | 'custom';

export interface DateRange {
  from: string;
  to: string;
}

export interface TransactionFilters {
  datePreset: DatePreset;
  dateRange: DateRange;
  categoryIds: string[];
  transactionTypes: TransactionType[];
  amountMin: number | null;
  amountMax: number | null;
  searchQuery: string;
  tags: string[];
  showRecurringOnly: boolean;
}

// ─── Derived / View Models ────────────────────────────────────────────────────

export interface ExpenseSummary {
  totalSpent: number;
  avgPerMonth: number;
  transactionCount: number;
  topCategory: { category: Category; amount: number } | null;
  dateRange: DateRange;
}

export interface CategoryBreakdown {
  categoryId: string;
  category: Category;
  amount: number;
  percentage: number;
  transactionCount: number;
}

export interface MonthlyTotals {
  month: string; // YYYY-MM
  expense: number;
  income: number;
  net: number;
}

// ─── App Settings ─────────────────────────────────────────────────────────────

export interface AppSettings {
  anthropicApiKey: string | null;
  defaultCurrency: string;
  theme: 'light' | 'dark' | 'system';
}

// ─── Future Module Stubs (data model only — not implemented) ─────────────────

export interface BudgetCategory {
  id: string;
  userId: string;
  categoryId: string;
  periodAmount: number;
  period: 'monthly' | 'yearly';
  rolloverEnabled: boolean;
}

export interface Account {
  id: string;
  userId: string;
  name: string;
  type: 'checking' | 'savings' | 'credit' | 'investment' | 'cash';
  currency: string;
  isAsset: boolean;
}
