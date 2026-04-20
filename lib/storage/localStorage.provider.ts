import type { IStorageProvider } from './types';
import type {
  Transaction,
  Category,
  TransactionFilters,
  MerchantRule,
  ImportSession,
  AiCacheEntry,
  AppSettings,
} from '@/types/finance';
import { applyFilters } from '@/lib/utils/filters';
import { generateId, nowISO } from '@/lib/utils/date';

// Key prefix 'pfp_' scopes keys across all future modules.
// Version suffix '_v1' allows migration if schema changes.
const KEYS = {
  TRANSACTIONS: 'pfp_transactions_v1',
  CATEGORIES: 'pfp_categories_v2',
  MERCHANT_RULES: 'pfp_merchant_rules_v2',
  IMPORT_SESSIONS: 'pfp_import_sessions_v1',
  AI_CACHE: 'pfp_ai_cache_v1',
  SETTINGS: 'pfp_settings_v1',
} as const;

const DEFAULT_SETTINGS: AppSettings = {
  anthropicApiKey: null,
  defaultCurrency: 'GBP',
  theme: 'system',
};

export class LocalStorageProvider implements IStorageProvider {
  private read<T>(key: string): T[] {
    if (typeof window === 'undefined') return [];
    try {
      return JSON.parse(localStorage.getItem(key) ?? '[]') as T[];
    } catch {
      return [];
    }
  }

  private readObject<T>(key: string, fallback: T): T {
    if (typeof window === 'undefined') return fallback;
    try {
      const raw = localStorage.getItem(key);
      return raw ? (JSON.parse(raw) as T) : fallback;
    } catch {
      return fallback;
    }
  }

  private write<T>(key: string, data: T[]): void {
    localStorage.setItem(key, JSON.stringify(data));
  }

  private writeObject<T>(key: string, data: T): void {
    localStorage.setItem(key, JSON.stringify(data));
  }

  // ── Transactions ────────────────────────────────────────────────────────────

  async getTransactions(filters?: Partial<TransactionFilters>): Promise<Transaction[]> {
    const all = this.read<Transaction>(KEYS.TRANSACTIONS);
    return filters ? applyFilters(all, filters) : all;
  }

  async getTransactionById(id: string): Promise<Transaction | null> {
    return this.read<Transaction>(KEYS.TRANSACTIONS).find((t) => t.id === id) ?? null;
  }

  async createTransaction(
    data: Omit<Transaction, 'id' | 'createdAt' | 'updatedAt'>
  ): Promise<Transaction> {
    const all = this.read<Transaction>(KEYS.TRANSACTIONS);
    const record: Transaction = { ...data, id: generateId(), createdAt: nowISO(), updatedAt: nowISO() };
    this.write(KEYS.TRANSACTIONS, [...all, record]);
    return record;
  }

  async createTransactionsBatch(
    data: Omit<Transaction, 'id' | 'createdAt' | 'updatedAt'>[]
  ): Promise<Transaction[]> {
    const all = this.read<Transaction>(KEYS.TRANSACTIONS);
    const ts = nowISO();
    const records = data.map((d) => ({ ...d, id: generateId(), createdAt: ts, updatedAt: ts } as Transaction));
    this.write(KEYS.TRANSACTIONS, [...all, ...records]);
    return records;
  }

  async updateTransaction(id: string, data: Partial<Transaction>): Promise<Transaction> {
    const all = this.read<Transaction>(KEYS.TRANSACTIONS);
    const idx = all.findIndex((t) => t.id === id);
    if (idx === -1) throw new Error(`Transaction ${id} not found`);
    const updated = { ...all[idx], ...data, updatedAt: nowISO() };
    all[idx] = updated;
    this.write(KEYS.TRANSACTIONS, all);
    return updated;
  }

  async deleteTransaction(id: string): Promise<void> {
    this.write(
      KEYS.TRANSACTIONS,
      this.read<Transaction>(KEYS.TRANSACTIONS).filter((t) => t.id !== id)
    );
  }

  async deleteTransactionsBatch(ids: string[]): Promise<void> {
    const idSet = new Set(ids);
    this.write(
      KEYS.TRANSACTIONS,
      this.read<Transaction>(KEYS.TRANSACTIONS).filter((t) => !idSet.has(t.id))
    );
  }

  async deleteTransactionsByGroupId(groupId: string): Promise<void> {
    this.write(
      KEYS.TRANSACTIONS,
      this.read<Transaction>(KEYS.TRANSACTIONS).filter(
        (t) => t.recurrenceGroupId !== groupId
      )
    );
  }

  // ── Categories ──────────────────────────────────────────────────────────────

  async getCategories(): Promise<Category[]> {
    return this.read<Category>(KEYS.CATEGORIES);
  }

  async getCategoryById(id: string): Promise<Category | null> {
    return this.read<Category>(KEYS.CATEGORIES).find((c) => c.id === id) ?? null;
  }

  async createCategory(
    data: Omit<Category, 'id' | 'createdAt' | 'updatedAt'>
  ): Promise<Category> {
    const all = this.read<Category>(KEYS.CATEGORIES);
    const record: Category = { ...data, id: generateId(), createdAt: nowISO(), updatedAt: nowISO() };
    this.write(KEYS.CATEGORIES, [...all, record]);
    return record;
  }

  async updateCategory(id: string, data: Partial<Category>): Promise<Category> {
    const all = this.read<Category>(KEYS.CATEGORIES);
    const idx = all.findIndex((c) => c.id === id);
    if (idx === -1) throw new Error(`Category ${id} not found`);
    const updated = { ...all[idx], ...data, updatedAt: nowISO() };
    all[idx] = updated;
    this.write(KEYS.CATEGORIES, all);
    return updated;
  }

  async deleteCategory(id: string): Promise<void> {
    this.write(
      KEYS.CATEGORIES,
      this.read<Category>(KEYS.CATEGORIES).filter((c) => c.id !== id)
    );
  }

  // ── Merchant Rules ──────────────────────────────────────────────────────────

  async getMerchantRules(): Promise<MerchantRule[]> {
    return this.read<MerchantRule>(KEYS.MERCHANT_RULES);
  }

  async createMerchantRule(
    data: Omit<MerchantRule, 'id' | 'createdAt' | 'updatedAt'>
  ): Promise<MerchantRule> {
    const all = this.read<MerchantRule>(KEYS.MERCHANT_RULES);
    const record: MerchantRule = { ...data, id: generateId(), createdAt: nowISO(), updatedAt: nowISO() };
    this.write(KEYS.MERCHANT_RULES, [...all, record]);
    return record;
  }

  async updateMerchantRule(id: string, data: Partial<MerchantRule>): Promise<MerchantRule> {
    const all = this.read<MerchantRule>(KEYS.MERCHANT_RULES);
    const idx = all.findIndex((r) => r.id === id);
    if (idx === -1) throw new Error(`MerchantRule ${id} not found`);
    const updated = { ...all[idx], ...data, updatedAt: nowISO() };
    all[idx] = updated;
    this.write(KEYS.MERCHANT_RULES, all);
    return updated;
  }

  async deleteMerchantRule(id: string): Promise<void> {
    this.write(
      KEYS.MERCHANT_RULES,
      this.read<MerchantRule>(KEYS.MERCHANT_RULES).filter((r) => r.id !== id)
    );
  }

  // ── Import Sessions ─────────────────────────────────────────────────────────

  async getImportSessions(): Promise<ImportSession[]> {
    return this.read<ImportSession>(KEYS.IMPORT_SESSIONS);
  }

  async createImportSession(data: Omit<ImportSession, 'id'>): Promise<ImportSession> {
    const all = this.read<ImportSession>(KEYS.IMPORT_SESSIONS);
    const record: ImportSession = { ...data, id: generateId() };
    this.write(KEYS.IMPORT_SESSIONS, [...all, record]);
    return record;
  }

  // ── AI Cache ────────────────────────────────────────────────────────────────

  async getAiCache(): Promise<AiCacheEntry[]> {
    return this.read<AiCacheEntry>(KEYS.AI_CACHE);
  }

  async upsertAiCache(merchantNormalized: string, entry: AiCacheEntry): Promise<void> {
    const all = this.read<AiCacheEntry>(KEYS.AI_CACHE);
    const idx = all.findIndex((e) => e.merchantNormalized === merchantNormalized);
    if (idx === -1) {
      this.write(KEYS.AI_CACHE, [...all, entry]);
    } else {
      all[idx] = entry;
      this.write(KEYS.AI_CACHE, all);
    }
  }

  // ── Settings ────────────────────────────────────────────────────────────────

  async getSettings(): Promise<AppSettings> {
    return this.readObject<AppSettings>(KEYS.SETTINGS, DEFAULT_SETTINGS);
  }

  async updateSettings(data: Partial<AppSettings>): Promise<AppSettings> {
    const current = await this.getSettings();
    const updated = { ...current, ...data };
    this.writeObject(KEYS.SETTINGS, updated);
    return updated;
  }

  // ── Utility ─────────────────────────────────────────────────────────────────

  async seed(data: { categories: Category[]; merchantRules: MerchantRule[] }): Promise<void> {
    if (this.read<Category>(KEYS.CATEGORIES).length === 0) {
      this.write(KEYS.CATEGORIES, data.categories);
    }

    const existingRules = this.read<MerchantRule>(KEYS.MERCHANT_RULES);
    if (existingRules.length === 0) {
      this.write(KEYS.MERCHANT_RULES, data.merchantRules);
    } else {
      // Add any new system rules that don't already exist by pattern.
      const existingPatterns = new Set(existingRules.map((r) => r.pattern.toLowerCase()));
      const newRules = data.merchantRules.filter(
        (r) => !existingPatterns.has(r.pattern.toLowerCase())
      );
      if (newRules.length > 0) {
        this.write(KEYS.MERCHANT_RULES, [...existingRules, ...newRules]);
      }
    }
  }

  async clear(): Promise<void> {
    Object.values(KEYS).forEach((key) => localStorage.removeItem(key));
  }
}
