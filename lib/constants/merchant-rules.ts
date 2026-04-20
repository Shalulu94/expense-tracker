import type { MerchantRule } from '@/types/finance';
import { generateId } from '@/lib/utils/date';
import { CAT_IDS } from './categories';

const now = new Date().toISOString();

function rule(pattern: string, categoryId: string): MerchantRule {
  return {
    id: generateId(),
    pattern,
    isRegex: false,
    categoryId,
    source: 'system',
    matchCount: 0,
    createdAt: now,
    updatedAt: now,
  };
}

export const DEFAULT_MERCHANT_RULES: MerchantRule[] = [
  // ── Streaming ──────────────────────────────────────────────────────────────
  rule('netflix',          CAT_IDS.ENTERTAINMENT_STREAMING),
  rule('spotify',          CAT_IDS.ENTERTAINMENT_STREAMING),
  rule('amazon prime',     CAT_IDS.ENTERTAINMENT_STREAMING),
  rule('disney+',          CAT_IDS.ENTERTAINMENT_STREAMING),
  rule('disney plus',      CAT_IDS.ENTERTAINMENT_STREAMING),
  rule('youtube premium',  CAT_IDS.ENTERTAINMENT_STREAMING),
  rule('sky subscription', CAT_IDS.ENTERTAINMENT_STREAMING),
  rule('now tv',           CAT_IDS.ENTERTAINMENT_STREAMING),
  rule('binge',            CAT_IDS.ENTERTAINMENT_STREAMING),
  rule('stan ',            CAT_IDS.ENTERTAINMENT_STREAMING),
  rule('paramount+',       CAT_IDS.ENTERTAINMENT_STREAMING),

  // ── Software Subscriptions ─────────────────────────────────────────────────
  rule('apple.com/bill',   CAT_IDS.ENTERTAINMENT_SUBS),
  rule('google one',       CAT_IDS.ENTERTAINMENT_SUBS),
  rule('microsoft 365',    CAT_IDS.ENTERTAINMENT_SUBS),
  rule('dropbox',          CAT_IDS.ENTERTAINMENT_SUBS),
  rule('adobe',            CAT_IDS.ENTERTAINMENT_SUBS),
  rule('notion',           CAT_IDS.ENTERTAINMENT_SUBS),
  rule('paypal *nba',      CAT_IDS.ENTERTAINMENT_SUBS),

  // ── Cafes & Coffee ─────────────────────────────────────────────────────────
  rule('starbucks',        CAT_IDS.FOOD_CAFES),
  rule('costa',            CAT_IDS.FOOD_CAFES),
  rule('gong cha',         CAT_IDS.FOOD_CAFES),
  rule('st. ali',          CAT_IDS.FOOD_CAFES),

  // ── Dining Out ─────────────────────────────────────────────────────────────
  rule('deliveroo',        CAT_IDS.FOOD_DINING),
  rule('uber eats',        CAT_IDS.FOOD_DINING),
  rule('just eat',         CAT_IDS.FOOD_DINING),
  rule('mcdonald',         CAT_IDS.FOOD_DINING),
  rule('nandos',           CAT_IDS.FOOD_DINING),
  rule('kfc',              CAT_IDS.FOOD_DINING),
  rule('burger king',      CAT_IDS.FOOD_DINING),
  rule('pret a manger',    CAT_IDS.FOOD_DINING),
  rule('subway',           CAT_IDS.FOOD_DINING),
  rule('pizza hut',        CAT_IDS.FOOD_DINING),
  rule('dominos',          CAT_IDS.FOOD_DINING),
  rule('wagamama',         CAT_IDS.FOOD_DINING),
  rule('itsu',             CAT_IDS.FOOD_DINING),
  rule('400 gradi',        CAT_IDS.FOOD_DINING),
  rule('mister fox',       CAT_IDS.FOOD_DINING),
  rule('gyg',              CAT_IDS.FOOD_DINING),
  rule('hot star',         CAT_IDS.FOOD_DINING),
  rule('fragrant harbour', CAT_IDS.FOOD_DINING),
  rule('hungry jacks',     CAT_IDS.FOOD_DINING),
  rule('oporto',           CAT_IDS.FOOD_DINING),
  rule('domino',           CAT_IDS.FOOD_DINING),
  rule('red rooster',      CAT_IDS.FOOD_DINING),
  rule('sq *foodness',     CAT_IDS.FOOD_DINING),
  rule('zlr*maguro',       CAT_IDS.FOOD_DINING),
  rule('the sy he group',  CAT_IDS.FOOD_DINING),
  rule('hhj investment',   CAT_IDS.FOOD_DINING),
  rule('rwq* goodbean',    CAT_IDS.FOOD_DINING),
  rule('rwd* goodbean',    CAT_IDS.FOOD_DINING),
  rule('natures green farm', CAT_IDS.FOOD_DINING),

  // ── Groceries ──────────────────────────────────────────────────────────────
  rule('tesco',                  CAT_IDS.FOOD_GROCERIES),
  rule('sainsbury',              CAT_IDS.FOOD_GROCERIES),
  rule('waitrose',               CAT_IDS.FOOD_GROCERIES),
  rule('asda',                   CAT_IDS.FOOD_GROCERIES),
  rule('aldi',                   CAT_IDS.FOOD_GROCERIES),
  rule('lidl',                   CAT_IDS.FOOD_GROCERIES),
  rule('morrisons',              CAT_IDS.FOOD_GROCERIES),
  rule('marks & spencer food',   CAT_IDS.FOOD_GROCERIES),
  rule('m&s food',               CAT_IDS.FOOD_GROCERIES),
  rule('co-op',                  CAT_IDS.FOOD_GROCERIES),
  rule('ocado',                  CAT_IDS.FOOD_GROCERIES),
  rule('amazon fresh',           CAT_IDS.FOOD_GROCERIES),
  rule('woolworths',             CAT_IDS.FOOD_GROCERIES),
  rule('coles',                  CAT_IDS.FOOD_GROCERIES),
  rule('costco',                 CAT_IDS.FOOD_GROCERIES),
  rule('aldi stores',            CAT_IDS.FOOD_GROCERIES),
  rule('iga',                    CAT_IDS.FOOD_GROCERIES),
  rule('harris farm',            CAT_IDS.FOOD_GROCERIES),
  rule('drakes supermarket',     CAT_IDS.FOOD_GROCERIES),
  rule('foodworks',              CAT_IDS.FOOD_GROCERIES),
  rule('fengsheng supermarket',  CAT_IDS.FOOD_GROCERIES),
  rule('direcfresh foods',       CAT_IDS.FOOD_GROCERIES),
  rule('afc knox',               CAT_IDS.FOOD_GROCERIES),

  // ── Fuel ───────────────────────────────────────────────────────────────────
  rule('eg group',       CAT_IDS.TRANSPORT_FUEL),
  rule('bp ',            CAT_IDS.TRANSPORT_FUEL),
  rule('shell',          CAT_IDS.TRANSPORT_FUEL),
  rule('ampol',          CAT_IDS.TRANSPORT_FUEL),
  rule('7-eleven fuel',  CAT_IDS.TRANSPORT_FUEL),

  // ── Public Transport ───────────────────────────────────────────────────────
  rule('trainline',      CAT_IDS.TRANSPORT_PUBLIC),
  rule('national rail',  CAT_IDS.TRANSPORT_PUBLIC),
  rule('tfl',            CAT_IDS.TRANSPORT_PUBLIC),
  rule('oyster',         CAT_IDS.TRANSPORT_PUBLIC),
  rule('myki',           CAT_IDS.TRANSPORT_PUBLIC),
  rule('opal',           CAT_IDS.TRANSPORT_PUBLIC),
  rule('go card',        CAT_IDS.TRANSPORT_PUBLIC),
  rule('citymapper',     CAT_IDS.TRANSPORT_PUBLIC),

  // ── Rideshare ──────────────────────────────────────────────────────────────
  rule('uber',           CAT_IDS.TRANSPORT_RIDESHARE),
  rule('bolt',           CAT_IDS.TRANSPORT_RIDESHARE),
  rule('free now',       CAT_IDS.TRANSPORT_RIDESHARE),
  rule('addison lee',    CAT_IDS.TRANSPORT_RIDESHARE),

  // ── Parking & Tolls ────────────────────────────────────────────────────────
  rule('wilson parking',  CAT_IDS.TRANSPORT_PARKING),
  rule('point parking',   CAT_IDS.TRANSPORT_PARKING),
  rule('carepark',        CAT_IDS.TRANSPORT_PARKING),
  rule('airportparking',  CAT_IDS.TRANSPORT_PARKING),
  rule('crown melbourne', CAT_IDS.TRANSPORT_PARKING),

  // ── Flights ────────────────────────────────────────────────────────────────
  rule('easyjet',          CAT_IDS.TRAVEL_FLIGHTS),
  rule('ryanair',          CAT_IDS.TRAVEL_FLIGHTS),
  rule('british airways',  CAT_IDS.TRAVEL_FLIGHTS),
  rule('qantas',           CAT_IDS.TRAVEL_FLIGHTS),
  rule('virgin australia', CAT_IDS.TRAVEL_FLIGHTS),
  rule('jetstar',          CAT_IDS.TRAVEL_FLIGHTS),

  // ── Car Hire (mapped to Transport parent) ──────────────────────────────────
  rule('enterprise car', CAT_IDS.TRANSPORT),
  rule('hertz',          CAT_IDS.TRANSPORT),
  rule('avis',           CAT_IDS.TRANSPORT),

  // ── Electricity ────────────────────────────────────────────────────────────
  rule('british gas',      CAT_IDS.UTILITIES_ELECTRICITY),
  rule('eon',              CAT_IDS.UTILITIES_ELECTRICITY),
  rule('octopus energy',   CAT_IDS.UTILITIES_ELECTRICITY),
  rule('edf',              CAT_IDS.UTILITIES_ELECTRICITY),
  rule('origin energy',    CAT_IDS.UTILITIES_ELECTRICITY),
  rule('energyaustralia',  CAT_IDS.UTILITIES_ELECTRICITY),
  rule('agl',              CAT_IDS.UTILITIES_ELECTRICITY),
  rule('dodo power',       CAT_IDS.UTILITIES_ELECTRICITY),

  // ── Gas ────────────────────────────────────────────────────────────────────
  rule('dodo services',    CAT_IDS.UTILITIES_GAS),

  // ── Water ──────────────────────────────────────────────────────────────────
  rule('thames water',       CAT_IDS.UTILITIES_WATER),
  rule('south east water',   CAT_IDS.UTILITIES_WATER),
  rule('sydney water',       CAT_IDS.UTILITIES_WATER),
  rule('yarra valley water', CAT_IDS.UTILITIES_WATER),

  // ── Internet ───────────────────────────────────────────────────────────────
  rule('virgin media',      CAT_IDS.UTILITIES_INTERNET),
  rule('bt internet',       CAT_IDS.UTILITIES_INTERNET),
  rule('sky broadband',     CAT_IDS.UTILITIES_INTERNET),
  rule('aussie broadband',  CAT_IDS.UTILITIES_INTERNET),

  // ── Phone ──────────────────────────────────────────────────────────────────
  rule('vodafone',   CAT_IDS.UTILITIES_PHONE),
  rule('ee limited', CAT_IDS.UTILITIES_PHONE),
  rule('o2',         CAT_IDS.UTILITIES_PHONE),
  rule('three',      CAT_IDS.UTILITIES_PHONE),
  rule('optus',      CAT_IDS.UTILITIES_PHONE),
  rule('telstra',    CAT_IDS.UTILITIES_PHONE),
  rule('belong',     CAT_IDS.UTILITIES_PHONE),

  // ── Health Insurance ───────────────────────────────────────────────────────
  rule('medibank',   CAT_IDS.INSURANCE_HEALTH),
  rule('bupa au',    CAT_IDS.INSURANCE_HEALTH),
  rule('bupa',       CAT_IDS.INSURANCE_HEALTH),
  rule('hcf',        CAT_IDS.INSURANCE_HEALTH),
  rule('nib health', CAT_IDS.INSURANCE_HEALTH),
  rule('axa health', CAT_IDS.INSURANCE_HEALTH),
  rule('vitality',   CAT_IDS.INSURANCE_HEALTH),

  // ── Pet Insurance ──────────────────────────────────────────────────────────
  rule('pet insurance', CAT_IDS.INSURANCE_PET),

  // ── Pharmacy ───────────────────────────────────────────────────────────────
  rule('chemist warehouse',    CAT_IDS.HEALTHCARE_PHARMACY),
  rule('lloyds pharmacy',      CAT_IDS.HEALTHCARE_PHARMACY),
  rule('pharmacy',             CAT_IDS.HEALTHCARE_PHARMACY),
  rule('pline pharm',          CAT_IDS.HEALTHCARE_PHARMACY),
  rule('pline ph ',            CAT_IDS.HEALTHCARE_PHARMACY),
  rule('pharmacy 4 less',      CAT_IDS.HEALTHCARE_PHARMACY),
  rule('bayswater nth pharm',  CAT_IDS.HEALTHCARE_PHARMACY),
  rule('cwh forest hill',      CAT_IDS.HEALTHCARE_PHARMACY),
  rule('boots',                CAT_IDS.HEALTHCARE_PHARMACY),

  // ── Dental ─────────────────────────────────────────────────────────────────
  rule('dentist', CAT_IDS.HEALTHCARE_DENTAL),

  // ── Doctor / GP ────────────────────────────────────────────────────────────
  rule('nhs',                    CAT_IDS.HEALTHCARE_GP),
  rule('optical',                CAT_IDS.HEALTHCARE_GP),
  rule('specsavers',             CAT_IDS.HEALTHCARE_GP),
  rule('pelvic strength physio', CAT_IDS.HEALTHCARE_GP),
  rule('eastern health',         CAT_IDS.HEALTHCARE_GP),
  rule('cdc boronia',            CAT_IDS.HEALTHCARE_GP),

  // ── Fitness & Gym ──────────────────────────────────────────────────────────
  rule('gym',             CAT_IDS.PERSONAL_CARE_FITNESS),
  rule('puregym',         CAT_IDS.PERSONAL_CARE_FITNESS),
  rule('david lloyd',     CAT_IDS.PERSONAL_CARE_FITNESS),
  rule('virgin active',   CAT_IDS.PERSONAL_CARE_FITNESS),
  rule('anytime fitness', CAT_IDS.PERSONAL_CARE_FITNESS),
  rule('peloton',         CAT_IDS.PERSONAL_CARE_FITNESS),
  rule('classpass',       CAT_IDS.PERSONAL_CARE_FITNESS),
  rule('crzyoga',         CAT_IDS.PERSONAL_CARE_FITNESS),
  rule('yoga',            CAT_IDS.PERSONAL_CARE_FITNESS),
  rule('f45',             CAT_IDS.PERSONAL_CARE_FITNESS),
  rule('snap fitness',    CAT_IDS.PERSONAL_CARE_FITNESS),
  rule('goodlife',        CAT_IDS.PERSONAL_CARE_FITNESS),
  rule('fitness first',   CAT_IDS.PERSONAL_CARE_FITNESS),
  rule('my place massage',CAT_IDS.PERSONAL_CARE_FITNESS),

  // ── Beauty & Hair ──────────────────────────────────────────────────────────
  rule('sns exclusive salon', CAT_IDS.PERSONAL_CARE_BEAUTY),
  rule('mao feng',            CAT_IDS.PERSONAL_CARE_BEAUTY),
  rule('j and lg',            CAT_IDS.PERSONAL_CARE_BEAUTY),
  rule('salon de j',          CAT_IDS.PERSONAL_CARE_BEAUTY),
  rule('sq *orange hair',     CAT_IDS.PERSONAL_CARE_BEAUTY),
  rule('white ivy',           CAT_IDS.PERSONAL_CARE_BEAUTY),
  rule('alana taylor',        CAT_IDS.PERSONAL_CARE_BEAUTY),

  // ── Movies & Events ────────────────────────────────────────────────────────
  rule('hoyts',             CAT_IDS.ENTERTAINMENT_EVENTS),
  rule('village cinemas',   CAT_IDS.ENTERTAINMENT_EVENTS),
  rule('event cinemas',     CAT_IDS.ENTERTAINMENT_EVENTS),
  rule('lup tix',           CAT_IDS.ENTERTAINMENT_EVENTS),
  rule('ticketek',          CAT_IDS.ENTERTAINMENT_EVENTS),
  rule('ticketmaster',      CAT_IDS.ENTERTAINMENT_EVENTS),
  rule('melbourn conventon',CAT_IDS.ENTERTAINMENT_EVENTS),
  rule('baby sensory',      CAT_IDS.ENTERTAINMENT_EVENTS),

  // ── Shopping ───────────────────────────────────────────────────────────────
  rule('amazon',             CAT_IDS.SHOPPING),
  rule('ebay',               CAT_IDS.SHOPPING),
  rule('amazon au',          CAT_IDS.SHOPPING),
  rule('amazon marketplace', CAT_IDS.SHOPPING),
  rule('paypal *ebay',       CAT_IDS.SHOPPING),
  rule('paypal *isiptrading',CAT_IDS.SHOPPING),
  rule('temu',               CAT_IDS.SHOPPING),
  rule('sq *the lorri',      CAT_IDS.SHOPPING),
  rule('westfield',          CAT_IDS.SHOPPING),
  rule('kmart',              CAT_IDS.SHOPPING),
  rule('target',             CAT_IDS.SHOPPING),
  rule('big w',              CAT_IDS.SHOPPING),

  // ── Clothing ───────────────────────────────────────────────────────────────
  rule('asos',           CAT_IDS.SHOPPING_CLOTHING),
  rule('zara',           CAT_IDS.SHOPPING_CLOTHING),
  rule('h&m',            CAT_IDS.SHOPPING_CLOTHING),
  rule('primark',        CAT_IDS.SHOPPING_CLOTHING),
  rule('next',           CAT_IDS.SHOPPING_CLOTHING),
  rule('the iconic',     CAT_IDS.SHOPPING_CLOTHING),
  rule('uniqlo',         CAT_IDS.SHOPPING_CLOTHING),
  rule('cotton on',      CAT_IDS.SHOPPING_CLOTHING),
  rule('country road',   CAT_IDS.SHOPPING_CLOTHING),
  rule('peter alexander',CAT_IDS.SHOPPING_CLOTHING),
  rule('best & less',    CAT_IDS.SHOPPING_CLOTHING),
  rule('best and less',  CAT_IDS.SHOPPING_CLOTHING),
  rule('myer',           CAT_IDS.SHOPPING_CLOTHING),
  rule('david jones',    CAT_IDS.SHOPPING_CLOTHING),

  // ── Home & Garden ──────────────────────────────────────────────────────────
  rule('john lewis',     CAT_IDS.SHOPPING_HOME_GARDEN),
  rule('marks & spencer',CAT_IDS.SHOPPING_HOME_GARDEN),
  rule('argos',          CAT_IDS.SHOPPING_HOME_GARDEN),
  rule('ikea',           CAT_IDS.SHOPPING_HOME_GARDEN),

  // ── Baby & Gifts ───────────────────────────────────────────────────────────
  rule('baby bunting',   CAT_IDS.SHOPPING_GIFTS),

  // ── Annual Bills ───────────────────────────────────────────────────────────
  rule('bpayn deft payments',   CAT_IDS.ANNUAL_BILLS_BODY_CORP),
  rule('bpayn knox city council', CAT_IDS.ANNUAL_BILLS_COUNCIL),

  // ── Pets ───────────────────────────────────────────────────────────────────
  rule('paws n stuff',       CAT_IDS.PETS_FOOD),
  rule('budgetpetprodu',     CAT_IDS.PETS_FOOD),
  rule('paypal *budgetpetpr',CAT_IDS.PETS_FOOD),
  rule('pet circle',         CAT_IDS.PETS_FOOD),
  rule('petbarn',            CAT_IDS.PETS_FOOD),
  rule('animates',           CAT_IDS.PETS_FOOD),

  // ── PayPal streaming pass-throughs ─────────────────────────────────────────
  rule('paypal *netflix', CAT_IDS.ENTERTAINMENT_STREAMING),
  rule('paypal *spotify', CAT_IDS.ENTERTAINMENT_STREAMING),
];
