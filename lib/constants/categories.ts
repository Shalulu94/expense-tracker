import type { Category } from '@/types/finance';
import { DEFAULT_USER_ID } from '@/types/finance';

const now = new Date().toISOString();

export const CAT_IDS = {
  // ── Parent categories ──────────────────────────────────────────────────────
  FOOD:          'sys_food',
  TRANSPORT:     'sys_transport',
  HOUSING:       'sys_housing',
  UTILITIES:     'sys_utilities',
  INSURANCE:     'sys_insurance',
  ANNUAL_BILLS:  'sys_annual_bills',
  HEALTHCARE:    'sys_healthcare',
  PERSONAL_CARE: 'sys_personal_care',
  ENTERTAINMENT: 'sys_entertainment',
  SHOPPING:      'sys_shopping',
  TRAVEL:        'sys_travel',
  EDUCATION:     'sys_education',
  PETS:          'sys_pets',
  MISC:          'sys_misc',
  INCOME:        'sys_income',
  SAVINGS:       'sys_savings',

  // ── Food & Drink ───────────────────────────────────────────────────────────
  FOOD_GROCERIES: 'sys_food_groceries',
  FOOD_DINING:    'sys_food_dining',
  FOOD_CAFES:     'sys_food_cafes',
  FOOD_TAKEAWAY:  'sys_food_takeaway',

  // ── Transport ──────────────────────────────────────────────────────────────
  TRANSPORT_FUEL:        'sys_transport_fuel',
  TRANSPORT_PUBLIC:      'sys_transport_public',
  TRANSPORT_PARKING:     'sys_transport_parking',
  TRANSPORT_RIDESHARE:   'sys_transport_rideshare',
  TRANSPORT_MAINTENANCE: 'sys_transport_maintenance',

  // ── Housing ────────────────────────────────────────────────────────────────
  HOUSING_RENT:     'sys_housing_rent',
  HOUSING_REPAIRS:  'sys_housing_repairs',
  HOUSING_SUPPLIES: 'sys_housing_supplies',

  // ── Utilities ──────────────────────────────────────────────────────────────
  UTILITIES_ELECTRICITY: 'sys_utilities_electricity',
  UTILITIES_GAS:         'sys_utilities_gas',
  UTILITIES_WATER:       'sys_utilities_water',
  UTILITIES_INTERNET:    'sys_utilities_internet',
  UTILITIES_PHONE:       'sys_utilities_phone',

  // ── Insurance ──────────────────────────────────────────────────────────────
  INSURANCE_CAR:    'sys_insurance_car',
  INSURANCE_HOME:   'sys_insurance_home',
  INSURANCE_HEALTH: 'sys_insurance_health',
  INSURANCE_PET:    'sys_insurance_pet',
  INSURANCE_LIFE:   'sys_insurance_life',

  // ── Annual Bills ───────────────────────────────────────────────────────────
  ANNUAL_BILLS_CAR_REG:     'sys_annual_bills_car_reg',
  ANNUAL_BILLS_BODY_CORP:   'sys_annual_bills_body_corp',
  ANNUAL_BILLS_SERVICING:   'sys_annual_bills_servicing',
  ANNUAL_BILLS_MEMBERSHIPS: 'sys_annual_bills_memberships',
  ANNUAL_BILLS_COUNCIL:     'sys_annual_bills_council',

  // ── Healthcare ─────────────────────────────────────────────────────────────
  HEALTHCARE_GP:       'sys_healthcare_gp',
  HEALTHCARE_PHARMACY: 'sys_healthcare_pharmacy',
  HEALTHCARE_DENTAL:   'sys_healthcare_dental',
  HEALTHCARE_MENTAL:   'sys_healthcare_mental',

  // ── Personal Care ──────────────────────────────────────────────────────────
  PERSONAL_CARE_FITNESS:  'sys_personal_care_fitness',
  PERSONAL_CARE_BEAUTY:   'sys_personal_care_beauty',
  PERSONAL_CARE_SKINCARE: 'sys_personal_care_skincare',

  // ── Entertainment ──────────────────────────────────────────────────────────
  ENTERTAINMENT_STREAMING: 'sys_entertainment_streaming',
  ENTERTAINMENT_EVENTS:    'sys_entertainment_events',
  ENTERTAINMENT_GAMING:    'sys_entertainment_gaming',
  ENTERTAINMENT_SUBS:      'sys_entertainment_subs',

  // ── Shopping ───────────────────────────────────────────────────────────────
  SHOPPING_ELECTRONICS:  'sys_shopping_electronics',
  SHOPPING_CLOTHING:     'sys_shopping_clothing',
  SHOPPING_HOME_GARDEN:  'sys_shopping_home_garden',
  SHOPPING_GIFTS:        'sys_shopping_gifts',

  // ── Travel ─────────────────────────────────────────────────────────────────
  TRAVEL_FLIGHTS:       'sys_travel_flights',
  TRAVEL_ACCOMMODATION: 'sys_travel_accommodation',
  TRAVEL_ACTIVITIES:    'sys_travel_activities',

  // ── Education ──────────────────────────────────────────────────────────────
  EDUCATION_COURSES: 'sys_education_courses',
  EDUCATION_BOOKS:   'sys_education_books',
  EDUCATION_SCHOOL:  'sys_education_school',

  // ── Pets ───────────────────────────────────────────────────────────────────
  PETS_FOOD:     'sys_pets_food',
  PETS_VET:      'sys_pets_vet',
  PETS_GROOMING: 'sys_pets_grooming',

  // ── Income ─────────────────────────────────────────────────────────────────
  INCOME_SALARY:   'sys_income_salary',
  INCOME_FREELANCE: 'sys_income_freelance',
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

// Subcategories inherit their parent's colour for visual grouping in badges and charts.
export const DEFAULT_CATEGORIES: Category[] = [
  // ── Parent categories ──────────────────────────────────────────────────────
  systemCategory(CAT_IDS.FOOD,          'Food & Drink',  '🍴', '#f59e0b'),
  systemCategory(CAT_IDS.TRANSPORT,     'Transport',     '🚗', '#3b82f6'),
  systemCategory(CAT_IDS.HOUSING,       'Housing',       '🏠', '#8b5cf6'),
  systemCategory(CAT_IDS.UTILITIES,     'Utilities',     '💡', '#06b6d4'),
  systemCategory(CAT_IDS.INSURANCE,     'Insurance',     '🛡️', '#0284c7'),
  systemCategory(CAT_IDS.ANNUAL_BILLS,  'Annual Bills',  '📅', '#64748b'),
  systemCategory(CAT_IDS.HEALTHCARE,    'Healthcare',    '🏥', '#ef4444'),
  systemCategory(CAT_IDS.PERSONAL_CARE, 'Personal Care', '🪥', '#fb7185'),
  systemCategory(CAT_IDS.ENTERTAINMENT, 'Entertainment', '🎬', '#ec4899'),
  systemCategory(CAT_IDS.SHOPPING,      'Shopping',      '🛍️', '#f97316'),
  systemCategory(CAT_IDS.TRAVEL,        'Travel',        '✈️', '#14b8a6'),
  systemCategory(CAT_IDS.EDUCATION,     'Education',     '📚', '#84cc16'),
  systemCategory(CAT_IDS.PETS,          'Pets',          '🐾', '#a78bfa'),
  systemCategory(CAT_IDS.MISC,          'Miscellaneous', '📦', '#94a3b8'),
  systemCategory(CAT_IDS.INCOME,        'Income',        '💰', '#22c55e', 'income'),
  systemCategory(CAT_IDS.SAVINGS,       'Savings',       '🏦', '#10b981', 'income'),

  // ── Food & Drink ───────────────────────────────────────────────────────────
  systemCategory(CAT_IDS.FOOD_GROCERIES, 'Groceries',      '🛒', '#f59e0b', 'expense', CAT_IDS.FOOD),
  systemCategory(CAT_IDS.FOOD_DINING,    'Dining Out',     '🍽️', '#f59e0b', 'expense', CAT_IDS.FOOD),
  systemCategory(CAT_IDS.FOOD_CAFES,     'Cafes & Coffee', '☕', '#f59e0b', 'expense', CAT_IDS.FOOD),
  systemCategory(CAT_IDS.FOOD_TAKEAWAY,  'Takeaway',       '🥡', '#f59e0b', 'expense', CAT_IDS.FOOD),

  // ── Transport ──────────────────────────────────────────────────────────────
  systemCategory(CAT_IDS.TRANSPORT_FUEL,        'Fuel',             '⛽', '#3b82f6', 'expense', CAT_IDS.TRANSPORT),
  systemCategory(CAT_IDS.TRANSPORT_PUBLIC,      'Public Transport', '🚌', '#3b82f6', 'expense', CAT_IDS.TRANSPORT),
  systemCategory(CAT_IDS.TRANSPORT_PARKING,     'Parking & Tolls',  '🅿️', '#3b82f6', 'expense', CAT_IDS.TRANSPORT),
  systemCategory(CAT_IDS.TRANSPORT_RIDESHARE,   'Rideshare',        '🚕', '#3b82f6', 'expense', CAT_IDS.TRANSPORT),
  systemCategory(CAT_IDS.TRANSPORT_MAINTENANCE, 'Car Maintenance',  '🔧', '#3b82f6', 'expense', CAT_IDS.TRANSPORT),

  // ── Housing ────────────────────────────────────────────────────────────────
  systemCategory(CAT_IDS.HOUSING_RENT,     'Rent / Mortgage',       '🏡', '#8b5cf6', 'expense', CAT_IDS.HOUSING),
  systemCategory(CAT_IDS.HOUSING_REPAIRS,  'Repairs & Maintenance', '🔨', '#8b5cf6', 'expense', CAT_IDS.HOUSING),
  systemCategory(CAT_IDS.HOUSING_SUPPLIES, 'Home Supplies',         '🧹', '#8b5cf6', 'expense', CAT_IDS.HOUSING),

  // ── Utilities ──────────────────────────────────────────────────────────────
  systemCategory(CAT_IDS.UTILITIES_ELECTRICITY, 'Electricity', '⚡', '#06b6d4', 'expense', CAT_IDS.UTILITIES),
  systemCategory(CAT_IDS.UTILITIES_GAS,         'Gas',         '🔥', '#06b6d4', 'expense', CAT_IDS.UTILITIES),
  systemCategory(CAT_IDS.UTILITIES_WATER,       'Water',       '💧', '#06b6d4', 'expense', CAT_IDS.UTILITIES),
  systemCategory(CAT_IDS.UTILITIES_INTERNET,    'Internet',    '🌐', '#06b6d4', 'expense', CAT_IDS.UTILITIES),
  systemCategory(CAT_IDS.UTILITIES_PHONE,       'Phone',       '📱', '#06b6d4', 'expense', CAT_IDS.UTILITIES),

  // ── Insurance ──────────────────────────────────────────────────────────────
  systemCategory(CAT_IDS.INSURANCE_CAR,    'Car Insurance',    '🚘', '#0284c7', 'expense', CAT_IDS.INSURANCE),
  systemCategory(CAT_IDS.INSURANCE_HOME,   'Home Insurance',   '🏠', '#0284c7', 'expense', CAT_IDS.INSURANCE),
  systemCategory(CAT_IDS.INSURANCE_HEALTH, 'Health Insurance', '🏥', '#0284c7', 'expense', CAT_IDS.INSURANCE),
  systemCategory(CAT_IDS.INSURANCE_PET,    'Pet Insurance',    '🐾', '#0284c7', 'expense', CAT_IDS.INSURANCE),
  systemCategory(CAT_IDS.INSURANCE_LIFE,   'Life Insurance',   '💛', '#0284c7', 'expense', CAT_IDS.INSURANCE),

  // ── Annual Bills ───────────────────────────────────────────────────────────
  systemCategory(CAT_IDS.ANNUAL_BILLS_CAR_REG,     'Car Registration', '📋', '#64748b', 'expense', CAT_IDS.ANNUAL_BILLS),
  systemCategory(CAT_IDS.ANNUAL_BILLS_BODY_CORP,   'Body Corp',        '🏢', '#64748b', 'expense', CAT_IDS.ANNUAL_BILLS),
  systemCategory(CAT_IDS.ANNUAL_BILLS_SERVICING,   'Car Servicing',    '🔧', '#64748b', 'expense', CAT_IDS.ANNUAL_BILLS),
  systemCategory(CAT_IDS.ANNUAL_BILLS_MEMBERSHIPS, 'Memberships',      '🎫', '#64748b', 'expense', CAT_IDS.ANNUAL_BILLS),
  systemCategory(CAT_IDS.ANNUAL_BILLS_COUNCIL,     'Council Rates',    '🏛️', '#64748b', 'expense', CAT_IDS.ANNUAL_BILLS),

  // ── Healthcare ─────────────────────────────────────────────────────────────
  systemCategory(CAT_IDS.HEALTHCARE_GP,       'Doctor / GP',  '👨‍⚕️', '#ef4444', 'expense', CAT_IDS.HEALTHCARE),
  systemCategory(CAT_IDS.HEALTHCARE_PHARMACY, 'Pharmacy',     '💊', '#ef4444', 'expense', CAT_IDS.HEALTHCARE),
  systemCategory(CAT_IDS.HEALTHCARE_DENTAL,   'Dental',       '🦷', '#ef4444', 'expense', CAT_IDS.HEALTHCARE),
  systemCategory(CAT_IDS.HEALTHCARE_MENTAL,   'Mental Health', '🧠', '#ef4444', 'expense', CAT_IDS.HEALTHCARE),

  // ── Personal Care ──────────────────────────────────────────────────────────
  systemCategory(CAT_IDS.PERSONAL_CARE_FITNESS,  'Fitness & Gym', '💪', '#fb7185', 'expense', CAT_IDS.PERSONAL_CARE),
  systemCategory(CAT_IDS.PERSONAL_CARE_BEAUTY,   'Beauty & Hair', '✂️', '#fb7185', 'expense', CAT_IDS.PERSONAL_CARE),
  systemCategory(CAT_IDS.PERSONAL_CARE_SKINCARE, 'Skincare',      '🧴', '#fb7185', 'expense', CAT_IDS.PERSONAL_CARE),

  // ── Entertainment ──────────────────────────────────────────────────────────
  systemCategory(CAT_IDS.ENTERTAINMENT_STREAMING, 'Streaming',       '📺', '#ec4899', 'expense', CAT_IDS.ENTERTAINMENT),
  systemCategory(CAT_IDS.ENTERTAINMENT_EVENTS,    'Movies & Events', '🎟️', '#ec4899', 'expense', CAT_IDS.ENTERTAINMENT),
  systemCategory(CAT_IDS.ENTERTAINMENT_GAMING,    'Gaming',          '🎮', '#ec4899', 'expense', CAT_IDS.ENTERTAINMENT),
  systemCategory(CAT_IDS.ENTERTAINMENT_SUBS,      'Subscriptions',   '📱', '#ec4899', 'expense', CAT_IDS.ENTERTAINMENT),

  // ── Shopping ───────────────────────────────────────────────────────────────
  systemCategory(CAT_IDS.SHOPPING_ELECTRONICS, 'Electronics',   '💻', '#f97316', 'expense', CAT_IDS.SHOPPING),
  systemCategory(CAT_IDS.SHOPPING_CLOTHING,    'Clothing',      '👗', '#f97316', 'expense', CAT_IDS.SHOPPING),
  systemCategory(CAT_IDS.SHOPPING_HOME_GARDEN, 'Home & Garden', '🌿', '#f97316', 'expense', CAT_IDS.SHOPPING),
  systemCategory(CAT_IDS.SHOPPING_GIFTS,       'Gifts',         '🎁', '#f97316', 'expense', CAT_IDS.SHOPPING),

  // ── Travel ─────────────────────────────────────────────────────────────────
  systemCategory(CAT_IDS.TRAVEL_FLIGHTS,       'Flights',       '🛫', '#14b8a6', 'expense', CAT_IDS.TRAVEL),
  systemCategory(CAT_IDS.TRAVEL_ACCOMMODATION, 'Accommodation', '🏨', '#14b8a6', 'expense', CAT_IDS.TRAVEL),
  systemCategory(CAT_IDS.TRAVEL_ACTIVITIES,    'Activities',    '🗺️', '#14b8a6', 'expense', CAT_IDS.TRAVEL),

  // ── Education ──────────────────────────────────────────────────────────────
  systemCategory(CAT_IDS.EDUCATION_COURSES, 'Courses & Training', '🎓', '#84cc16', 'expense', CAT_IDS.EDUCATION),
  systemCategory(CAT_IDS.EDUCATION_BOOKS,   'Books',              '📖', '#84cc16', 'expense', CAT_IDS.EDUCATION),
  systemCategory(CAT_IDS.EDUCATION_SCHOOL,  'School Fees',        '🏫', '#84cc16', 'expense', CAT_IDS.EDUCATION),

  // ── Pets ───────────────────────────────────────────────────────────────────
  systemCategory(CAT_IDS.PETS_FOOD,     'Food & Treats', '🦴', '#a78bfa', 'expense', CAT_IDS.PETS),
  systemCategory(CAT_IDS.PETS_VET,      'Vet',           '💉', '#a78bfa', 'expense', CAT_IDS.PETS),
  systemCategory(CAT_IDS.PETS_GROOMING, 'Grooming',      '✂️', '#a78bfa', 'expense', CAT_IDS.PETS),

  // ── Income ─────────────────────────────────────────────────────────────────
  systemCategory(CAT_IDS.INCOME_SALARY,   'Salary',       '💼', '#22c55e', 'income', CAT_IDS.INCOME),
  systemCategory(CAT_IDS.INCOME_FREELANCE,'Freelance',    '💻', '#22c55e', 'income', CAT_IDS.INCOME),
  systemCategory(CAT_IDS.INCOME_OTHER,    'Other Income', '💵', '#22c55e', 'income', CAT_IDS.INCOME),
];

export function getMiscCategory(): Category | undefined {
  return DEFAULT_CATEGORIES.find((c) => c.id === CAT_IDS.MISC);
}
