import type { Category } from '@/types/finance';
import { DEFAULT_USER_ID } from '@/types/finance';

const now = new Date().toISOString();

export const CAT_IDS = {
  // ── Parent categories ──────────────────────────────────────────────────────
  FOOD:         'sys_food',
  UTILITIES:    'sys_utilities',
  INSURANCE:    'sys_insurance',
  BILLS:        'sys_bills',
  HEALTH:       'sys_health',
  SUBSCRIPTIONS:'sys_subscriptions',
  TRAVEL:       'sys_travel',
  SHOPPING:     'sys_shopping',
  MISC:         'sys_misc',
  INCOME:       'sys_income',
  SAVINGS:      'sys_savings',

  // ── Food & Drink ───────────────────────────────────────────────────────────
  FOOD_DINING:     'sys_food_dining',
  FOOD_GROCERIES:  'sys_food_groceries',

  // ── Utilities ──────────────────────────────────────────────────────────────
  UTILITIES_ELECTRICITY: 'sys_utilities_electricity',
  UTILITIES_GAS:         'sys_utilities_gas',
  UTILITIES_WATER:       'sys_utilities_water',
  UTILITIES_PHONE:       'sys_utilities_phone',
  UTILITIES_INTERNET:    'sys_utilities_internet',

  // ── Insurance ──────────────────────────────────────────────────────────────
  INSURANCE_CAR:    'sys_insurance_car',
  INSURANCE_HOME:   'sys_insurance_home',
  INSURANCE_HEALTH: 'sys_insurance_health',
  INSURANCE_PET:    'sys_insurance_pet',

  // ── Bills ──────────────────────────────────────────────────────────────────
  BILLS_CAR_REG:     'sys_bills_car_reg',
  BILLS_BODY_CORP:   'sys_bills_body_corp',
  BILLS_SERVICING:   'sys_bills_servicing',
  BILLS_COUNCIL:     'sys_bills_council',
  BILLS_MEMBERSHIPS: 'sys_bills_memberships',

  // ── Health & Wellbeing ─────────────────────────────────────────────────────
  HEALTH_BEAUTY:        'sys_health_beauty',
  HEALTH_PROFESSIONAL:  'sys_health_professional',
  HEALTH_PHARMACY:      'sys_health_pharmacy',

  // ── Income ─────────────────────────────────────────────────────────────────
  INCOME_SALARY:   'sys_income_salary',
  INCOME_FREELANCE:'sys_income_freelance',
  INCOME_OTHER:    'sys_income_other',
} as const;

function systemCategory(
  id: string,
  name: string,
  icon: string,
  color: string,
  type: Category['type'] = 'expense',
  parentId: string | null = null,
): Category {
  return {
    id,
    userId: DEFAULT_USER_ID,
    name,
    icon,
    color,
    type,
    isSystem: true,
    parentId,
    budgetId: null,
    createdAt: now,
    updatedAt: now,
  };
}

export const DEFAULT_CATEGORIES: Category[] = [
  // ── Parent categories ──────────────────────────────────────────────────────
  systemCategory(CAT_IDS.FOOD,          'Food & Drink',      '🍽️', '#f59e0b'),
  systemCategory(CAT_IDS.UTILITIES,     'Utilities',         '💡', '#06b6d4'),
  systemCategory(CAT_IDS.INSURANCE,     'Insurance',         '🛡️', '#0284c7'),
  systemCategory(CAT_IDS.BILLS,         'Bills',             '📋', '#64748b'),
  systemCategory(CAT_IDS.HEALTH,        'Health & Wellbeing','🧘', '#ef4444'),
  systemCategory(CAT_IDS.SUBSCRIPTIONS, 'Subscriptions',     '📺', '#ec4899'),
  systemCategory(CAT_IDS.TRAVEL,        'Travel',            '✈️', '#14b8a6'),
  systemCategory(CAT_IDS.SHOPPING,      'Shopping',          '🛍️', '#f97316'),
  systemCategory(CAT_IDS.MISC,          'Miscellaneous',     '📦', '#94a3b8'),
  systemCategory(CAT_IDS.INCOME,        'Income',            '💰', '#22c55e', 'income'),
  systemCategory(CAT_IDS.SAVINGS,       'Savings',           '🏦', '#10b981', 'income'),

  // ── Food & Drink ───────────────────────────────────────────────────────────
  systemCategory(CAT_IDS.FOOD_DINING,    'Dining Out / Takeaway', '🥡', '#f59e0b', 'expense', CAT_IDS.FOOD),
  systemCategory(CAT_IDS.FOOD_GROCERIES, 'Groceries',             '🛒', '#f59e0b', 'expense', CAT_IDS.FOOD),

  // ── Utilities ──────────────────────────────────────────────────────────────
  systemCategory(CAT_IDS.UTILITIES_ELECTRICITY, 'Electricity', '⚡', '#06b6d4', 'expense', CAT_IDS.UTILITIES),
  systemCategory(CAT_IDS.UTILITIES_GAS,         'Gas',         '🔥', '#06b6d4', 'expense', CAT_IDS.UTILITIES),
  systemCategory(CAT_IDS.UTILITIES_WATER,       'Water',       '💧', '#06b6d4', 'expense', CAT_IDS.UTILITIES),
  systemCategory(CAT_IDS.UTILITIES_PHONE,       'Phone',       '📱', '#06b6d4', 'expense', CAT_IDS.UTILITIES),
  systemCategory(CAT_IDS.UTILITIES_INTERNET,    'Internet',    '🌐', '#06b6d4', 'expense', CAT_IDS.UTILITIES),

  // ── Insurance ──────────────────────────────────────────────────────────────
  systemCategory(CAT_IDS.INSURANCE_CAR,    'Car Insurance',    '🚗', '#0284c7', 'expense', CAT_IDS.INSURANCE),
  systemCategory(CAT_IDS.INSURANCE_HOME,   'Home Insurance',   '🏠', '#0284c7', 'expense', CAT_IDS.INSURANCE),
  systemCategory(CAT_IDS.INSURANCE_HEALTH, 'Health Insurance', '🏥', '#0284c7', 'expense', CAT_IDS.INSURANCE),
  systemCategory(CAT_IDS.INSURANCE_PET,    'Pet Insurance',    '🐾', '#0284c7', 'expense', CAT_IDS.INSURANCE),

  // ── Bills ──────────────────────────────────────────────────────────────────
  systemCategory(CAT_IDS.BILLS_CAR_REG,     'Car Registration', '📋', '#64748b', 'expense', CAT_IDS.BILLS),
  systemCategory(CAT_IDS.BILLS_BODY_CORP,   'Body Corp',        '🏢', '#64748b', 'expense', CAT_IDS.BILLS),
  systemCategory(CAT_IDS.BILLS_SERVICING,   'Car Servicing',    '🔧', '#64748b', 'expense', CAT_IDS.BILLS),
  systemCategory(CAT_IDS.BILLS_COUNCIL,     'Council Rates',    '🏛️', '#64748b', 'expense', CAT_IDS.BILLS),
  systemCategory(CAT_IDS.BILLS_MEMBERSHIPS, 'Memberships',      '🎫', '#64748b', 'expense', CAT_IDS.BILLS),

  // ── Health & Wellbeing ─────────────────────────────────────────────────────
  systemCategory(CAT_IDS.HEALTH_BEAUTY,       'Beauty Care',         '💅', '#ef4444', 'expense', CAT_IDS.HEALTH),
  systemCategory(CAT_IDS.HEALTH_PROFESSIONAL, 'Professional Services','👔', '#ef4444', 'expense', CAT_IDS.HEALTH),
  systemCategory(CAT_IDS.HEALTH_PHARMACY,     'Pharmacy',            '💊', '#ef4444', 'expense', CAT_IDS.HEALTH),

  // ── Income ─────────────────────────────────────────────────────────────────
  systemCategory(CAT_IDS.INCOME_SALARY,   'Salary',       '💼', '#22c55e', 'income', CAT_IDS.INCOME),
  systemCategory(CAT_IDS.INCOME_FREELANCE,'Freelance',    '💻', '#22c55e', 'income', CAT_IDS.INCOME),
  systemCategory(CAT_IDS.INCOME_OTHER,    'Other Income', '💵', '#22c55e', 'income', CAT_IDS.INCOME),
];

export function getMiscCategory(): Category | undefined {
  return DEFAULT_CATEGORIES.find((c) => c.id === CAT_IDS.MISC);
}
