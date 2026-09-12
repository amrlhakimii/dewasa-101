// Malaysian statutory constants — the single source of truth for all deduction
// and tax math in this app. Update whenever Belanjawan / LHDN / PERKESO revise rates.

export const STATUTORY_CONFIG = {
  EPF_EMPLOYEE_RATE: 0.11,
  // Employer pays 13% for basic <= 5000, 12% for basic > 5000
  EPF_EMPLOYER_THRESHOLD: 5000,

  // SOCSO and EIS salary ceiling raised from RM5,000 to RM6,000 (Oct 2024).
  SOCSO_SALARY_CAP: 6000,
  EIS_SALARY_CAP: 6000,

  // Programmatic approximation for First Category employees (Under 60).
  // Real SOCSO uses a tier table; 0.5% / 1.75% is the standard JS estimation shortcut.
  SOCSO_EMPLOYEE_RATE: 0.005,
  SOCSO_EMPLOYER_RATE: 0.0175,
  EIS_EMPLOYEE_RATE: 0.002,
  EIS_EMPLOYER_RATE: 0.002,
} as const;

export interface TaxBracket {
  min: number;
  max: number;
  rate: number;
  baseTaxAtMin: number;
}

// LHDN Individual Income Tax Rates (resident individual, YA current)
export const LHDN_TAX_BRACKETS: TaxBracket[] = [
  { min: 0, max: 5000, rate: 0.0, baseTaxAtMin: 0 },
  { min: 5001, max: 20000, rate: 0.01, baseTaxAtMin: 0 },
  { min: 20001, max: 35000, rate: 0.03, baseTaxAtMin: 150 },
  { min: 35001, max: 50000, rate: 0.06, baseTaxAtMin: 600 },
  { min: 50001, max: 70000, rate: 0.11, baseTaxAtMin: 1500 },
  { min: 70001, max: 100000, rate: 0.19, baseTaxAtMin: 3700 },
  { min: 100001, max: 400000, rate: 0.25, baseTaxAtMin: 9400 },
  { min: 400001, max: 600000, rate: 0.26, baseTaxAtMin: 84400 },
  { min: 600001, max: 2000000, rate: 0.28, baseTaxAtMin: 136400 },
  { min: 2000001, max: Infinity, rate: 0.3, baseTaxAtMin: 528400 },
];

export const LHDN_BASE_RELIEF = 9000;

// Zakat Nisab: 85g of gold. Value fluctuates with the gold price — treat as an
// editable estimate, not a statutory constant.
export const NISAB_GOLD_GRAMS = 85;
export const NISAB_ESTIMATED_VALUE = 24000; // RM, indicative — refresh periodically
export const ZAKAT_PENDAPATAN_RATE = 0.025;

// Zakat Fitrah rate by state (RM per head, indicative for current year).
export const ZAKAT_FITRAH_RATES: Record<string, number> = {
  'WP Kuala Lumpur': 7,
  Selangor: 7,
  Johor: 7,
  Penang: 7,
  Perak: 7,
  'Negeri Sembilan': 7,
  Melaka: 7,
  Kedah: 7,
  Kelantan: 7,
  Terengganu: 7,
  Pahang: 7,
  Perlis: 7,
  Sabah: 7,
  Sarawak: 7,
  Labuan: 7,
};

// DSR thresholds used by most Malaysian banks for conventional financing.
export const DSR_THRESHOLDS = {
  SAFE_MAX: 50,
  WARNING_MAX: 60,
} as const;

// KWSP historical average dividend rate (Simpanan Konvensional), used as the
// default growth assumption for the retirement projection — actual rate is
// declared annually and varies. See KWSP_SOURCE_URL below.
export const KWSP_DEFAULT_DIVIDEND_RATE = 0.055;
export const KWSP_DEFAULT_RETIREMENT_AGE = 60;

// Sources — shown in-app next to the figures they justify, so users can
// verify against the primary authority rather than trusting this app blindly.
export const DATA_SOURCES = {
  LHDN_TAX_RATE: 'https://www.hasil.gov.my/en/individual/individual-life-cycle/income-declaration/tax-rate/',
  ZAKAT_PENDAPATAN: 'https://www.zakatselangor.com.my/zakat-pendapatan-2/',
  ZAKAT_FITRAH: 'https://www.muftiselangor.gov.my/',
  KWSP: 'https://www.kwsp.gov.my/',
  ROAD_TAX: 'https://roadtaxguru.com/price-list/',
  MYTAX: 'https://mytax.hasil.gov.my/',
  CCRIS: 'https://www.bnm.gov.my/ccris',
  CTOS: 'https://www.ctoscredit.com.my/',
} as const;

export interface RoadTaxBracket {
  maxCc: number; // Infinity for the open-ended top bracket
  baseRate: number;
  perCcAboveRate: number; // 0 for flat brackets
  aboveCc: number; // the cc floor the per-cc rate applies above
}

// JPJ road tax schedule, Peninsular Malaysia, private-registered saloon cars.
// East Malaysia / Langkawi / Pangkor / Labuan rates are lower — treat this as
// an estimate, not the final JPJ figure. See DATA_SOURCES.ROAD_TAX.
export const CAR_ROAD_TAX_BRACKETS: RoadTaxBracket[] = [
  { maxCc: 1000, baseRate: 20, perCcAboveRate: 0, aboveCc: 0 },
  { maxCc: 1200, baseRate: 55, perCcAboveRate: 0, aboveCc: 0 },
  { maxCc: 1400, baseRate: 70, perCcAboveRate: 0, aboveCc: 0 },
  { maxCc: 1600, baseRate: 90, perCcAboveRate: 0, aboveCc: 0 },
  { maxCc: 1800, baseRate: 200, perCcAboveRate: 0.4, aboveCc: 1600 },
  { maxCc: 2000, baseRate: 280, perCcAboveRate: 0.5, aboveCc: 1800 },
  { maxCc: 2500, baseRate: 380, perCcAboveRate: 1.0, aboveCc: 2000 },
  { maxCc: 3000, baseRate: 880, perCcAboveRate: 2.5, aboveCc: 2500 },
  { maxCc: Infinity, baseRate: 2130, perCcAboveRate: 4.5, aboveCc: 3000 },
];

// JPJ road tax schedule, Peninsular Malaysia, private motorcycles (flat per
// bracket, no progressive component). East Malaysia is generally cheaper.
export const MOTORCYCLE_ROAD_TAX_BRACKETS: { maxCc: number; rate: number }[] = [
  { maxCc: 150, rate: 2 },
  { maxCc: 200, rate: 30 },
  { maxCc: 250, rate: 50 },
  { maxCc: 500, rate: 100 },
  { maxCc: 800, rate: 250 },
  { maxCc: Infinity, rate: 350 },
];

// Comprehensive car insurance in Malaysia is market-priced (varies by
// insurer, NCD, sum insured) — this is a rough rule-of-thumb range, not an
// official rate, used only to suggest a starting estimate.
export const INSURANCE_ESTIMATE_RATE_OF_VALUE = { min: 0.03, max: 0.05 } as const;
