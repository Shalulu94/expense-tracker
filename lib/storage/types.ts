import type {
  Transaction,
  Category,
  TransactionFilters,
  MerchantRule,
  ImportSession,
  AiCacheEntry,
  AppSettings,
} from '@/types/finance';

export interface IStorageProvider {
  // ── Transactions ──────────────────────────────────────────────────────────
  getTransactions(filters?: Partial<TransactionFilters>): Promise<Transaction[]>;
  getTransactionById(id: string): Promise<Transaction | null>;
  createTransaction(
    data: Omit<Transaction, 'id' | 'createdAt' | 'updatedAt'>
  ): Promise<Transaction>;
  createTransactionsBatch(
    data: Omit<Transaction, 'id' | 'createdAt' | 'updatedAt'>[]
  ): Promise<Transaction[]>;
  updateTransaction(id: string, data: Partial<Transaction>): Promise<Transaction>;
  deleteTransaction(id: string): Promise<void>;
  deleteTransactionsBatch(ids: string[]): Promise<void>;
  deleteTransactionsByGroupId(groupId: string): Promise<void>;

  // ── Categories ────────────────────────────────────────────────────────────
  getCategories(): Promise<Category[]>;
  getCategoryById(id: string): Promise<Category | null>;
  createCategory(
    data: Omit<Category, 'id' | 'createdAt' | 'updatedAt'>
  ): Promise<Category>;
  updateCategory(id: string, data: Partial<Category>): Promise<Category>;
  deleteCategory(id: string): Promise<void>;

  // ── Merchant Rules ────────────────────────────────────────────────────────
  getMerchantRules(): Promise<MerchantRule[]>;
  createMerchantRule(
    data: Omit<MerchantRule, 'id' | 'createdAt' | 'updatedAt'>
  ): Promise<MerchantRule>;
  updateMerchantRule(id: string, data: Partial<MerchantRule>): Promise<MerchantRule>;
  deleteMerchantRule(id: string): Promise<void>;

  // ── Import Sessions ───────────────────────────────────────────────────────
  getImportSessions(): Promise<ImportSession[]>;
  createImportSession(data: Omit<ImportSession, 'id'>): Promise<ImportSession>;

  // ── AI Cache ──────────────────────────────────────────────────────────────
  getAiCache(): Promise<AiCacheEntry[]>;
  upsertAiCache(merchantNormalized: string, entry: AiCacheEntry): Promise<void>;

  // ── Settings ──────────────────────────────────────────────────────────────
  getSettings(): Promise<AppSettings>;
  updateSettings(data: Partial<AppSettings>): Promise<AppSettings>;

  // ── Utility ───────────────────────────────────────────────────────────────
  seed(data: { categories: Category[]; merchantRules: MerchantRule[] }): Promise<void>;
  clear(): Promise<void>;
}
