import { create } from 'zustand';
import type {
  Transaction,
  Category,
  TransactionFilters,
  DatePreset,
  AppSettings,
  MerchantRule,
} from '@/types/finance';
import { getStorageProvider } from '@/lib/storage';
import { getDateRangeForPreset } from '@/lib/utils/date';
import { DEFAULT_CATEGORIES } from '@/lib/constants/categories';
import { DEFAULT_MERCHANT_RULES } from '@/lib/constants/merchant-rules';

interface AppState {
  // ── Data ──────────────────────────────────────────────────────────────────
  transactions: Transaction[];
  categories: Category[];
  merchantRules: MerchantRule[];
  settings: AppSettings | null;

  // ── UI State ──────────────────────────────────────────────────────────────
  filters: TransactionFilters;
  isTransactionModalOpen: boolean;
  editingTransactionId: string | null;
  isLoading: boolean;

  // ── Actions: Bootstrap ────────────────────────────────────────────────────
  seed: () => Promise<void>;
  loadAll: () => Promise<void>;

  // ── Actions: Transactions ─────────────────────────────────────────────────
  createTransaction: (
    data: Omit<Transaction, 'id' | 'createdAt' | 'updatedAt'>
  ) => Promise<Transaction>;
  updateTransaction: (id: string, data: Partial<Transaction>) => Promise<void>;
  deleteTransaction: (id: string) => Promise<void>;
  deleteTransactionsBatch: (ids: string[]) => Promise<void>;
  deleteTransactionsByGroupId: (groupId: string) => Promise<void>;

  // ── Actions: Categories ───────────────────────────────────────────────────
  createCategory: (
    data: Omit<Category, 'id' | 'createdAt' | 'updatedAt'>
  ) => Promise<Category>;
  updateCategory: (id: string, data: Partial<Category>) => Promise<void>;
  deleteCategory: (id: string) => Promise<void>;

  // ── Actions: Merchant Rules ───────────────────────────────────────────────
  createMerchantRule: (
    data: Omit<MerchantRule, 'id' | 'createdAt' | 'updatedAt'>
  ) => Promise<MerchantRule>;
  updateMerchantRule: (id: string, data: Partial<MerchantRule>) => Promise<void>;
  deleteMerchantRule: (id: string) => Promise<void>;

  // ── Actions: Settings ─────────────────────────────────────────────────────
  updateSettings: (data: Partial<AppSettings>) => Promise<void>;

  // ── Actions: UI ───────────────────────────────────────────────────────────
  setFilters: (filters: Partial<TransactionFilters>) => void;
  setDatePreset: (preset: DatePreset) => void;
  openTransactionModal: (editId?: string) => void;
  closeTransactionModal: () => void;
}

const defaultFilters: TransactionFilters = {
  datePreset: 'this_month',
  dateRange: getDateRangeForPreset('this_month'),
  categoryIds: [],
  transactionTypes: [],
  amountMin: null,
  amountMax: null,
  searchQuery: '',
  tags: [],
  showRecurringOnly: false,
};

export const useAppStore = create<AppState>((set, get) => ({
  transactions: [],
  categories: [],
  merchantRules: [],
  settings: null,
  filters: defaultFilters,
  isTransactionModalOpen: false,
  editingTransactionId: null,
  isLoading: false,

  seed: async () => {
    const storage = getStorageProvider();
    await storage.seed({
      categories: DEFAULT_CATEGORIES,
      merchantRules: DEFAULT_MERCHANT_RULES,
    });
    await get().loadAll();
  },

  loadAll: async () => {
    set({ isLoading: true });
    const storage = getStorageProvider();
    const [transactions, categories, merchantRules, settings] = await Promise.all([
      storage.getTransactions(),
      storage.getCategories(),
      storage.getMerchantRules(),
      storage.getSettings(),
    ]);
    set({ transactions, categories, merchantRules, settings, isLoading: false });
  },

  createTransaction: async (data) => {
    const tx = await getStorageProvider().createTransaction(data);
    set((s) => ({ transactions: [tx, ...s.transactions] }));
    return tx;
  },

  updateTransaction: async (id, data) => {
    const updated = await getStorageProvider().updateTransaction(id, data);
    set((s) => ({
      transactions: s.transactions.map((t) => (t.id === id ? updated : t)),
    }));
  },

  deleteTransaction: async (id) => {
    await getStorageProvider().deleteTransaction(id);
    set((s) => ({ transactions: s.transactions.filter((t) => t.id !== id) }));
  },

  deleteTransactionsBatch: async (ids) => {
    await getStorageProvider().deleteTransactionsBatch(ids);
    const idSet = new Set(ids);
    set((s) => ({ transactions: s.transactions.filter((t) => !idSet.has(t.id)) }));
  },

  deleteTransactionsByGroupId: async (groupId) => {
    await getStorageProvider().deleteTransactionsByGroupId(groupId);
    set((s) => ({
      transactions: s.transactions.filter((t) => t.recurrenceGroupId !== groupId),
    }));
  },

  createCategory: async (data) => {
    const cat = await getStorageProvider().createCategory(data);
    set((s) => ({ categories: [...s.categories, cat] }));
    return cat;
  },

  updateCategory: async (id, data) => {
    const updated = await getStorageProvider().updateCategory(id, data);
    set((s) => ({
      categories: s.categories.map((c) => (c.id === id ? updated : c)),
    }));
  },

  deleteCategory: async (id) => {
    await getStorageProvider().deleteCategory(id);
    set((s) => ({ categories: s.categories.filter((c) => c.id !== id) }));
  },

  createMerchantRule: async (data) => {
    const rule = await getStorageProvider().createMerchantRule(data);
    set((s) => ({ merchantRules: [...s.merchantRules, rule] }));
    return rule;
  },

  updateMerchantRule: async (id, data) => {
    const updated = await getStorageProvider().updateMerchantRule(id, data);
    set((s) => ({
      merchantRules: s.merchantRules.map((r) => (r.id === id ? updated : r)),
    }));
  },

  deleteMerchantRule: async (id) => {
    await getStorageProvider().deleteMerchantRule(id);
    set((s) => ({ merchantRules: s.merchantRules.filter((r) => r.id !== id) }));
  },

  updateSettings: async (data) => {
    const updated = await getStorageProvider().updateSettings(data);
    set({ settings: updated });
  },

  setFilters: (filters) => {
    set((s) => ({ filters: { ...s.filters, ...filters } }));
  },

  setDatePreset: (preset) => {
    const dateRange = preset !== 'custom' ? getDateRangeForPreset(preset) : get().filters.dateRange;
    set((s) => ({ filters: { ...s.filters, datePreset: preset, dateRange } }));
  },

  openTransactionModal: (editId) => {
    set({ isTransactionModalOpen: true, editingTransactionId: editId ?? null });
  },

  closeTransactionModal: () => {
    set({ isTransactionModalOpen: false, editingTransactionId: null });
  },
}));
