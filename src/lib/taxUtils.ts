export interface TaxBracket {
  rangeLabel: string;
  min: number;
  max: number | null;
  ratePercent: number;
  rateDecimal: number;
  fixedDeduction: number;
  notes?: string;
}

export const ETHIOPIAN_INCOME_TAX_BRACKETS: TaxBracket[] = [
  {
    rangeLabel: '0 – 2,000 ETB',
    min: 0,
    max: 2000,
    ratePercent: 0,
    rateDecimal: 0,
    fixedDeduction: 0,
    notes: 'Exempt',
  },
  {
    rangeLabel: '2,001 – 4,000 ETB',
    min: 2001,
    max: 4000,
    ratePercent: 15,
    rateDecimal: 0.15,
    fixedDeduction: 300,
  },
  {
    rangeLabel: '4,001 – 7,000 ETB',
    min: 4001,
    max: 7000,
    ratePercent: 20,
    rateDecimal: 0.20,
    fixedDeduction: 500,
  },
  {
    rangeLabel: '7,001 – 10,000 ETB',
    min: 7001,
    max: 10000,
    ratePercent: 25,
    rateDecimal: 0.25,
    fixedDeduction: 850,
  },
  {
    rangeLabel: '10,001 – 14,000 ETB',
    min: 10001,
    max: 14000,
    ratePercent: 30,
    rateDecimal: 0.30,
    fixedDeduction: 1350,
  },
  {
    rangeLabel: 'Over 14,000 ETB',
    min: 14001,
    max: null,
    ratePercent: 35,
    rateDecimal: 0.35,
    fixedDeduction: 2050,
  },
];

export interface TaxCalculationResult {
  taxableIncome: number;
  applicableBracket: TaxBracket;
  taxRatePercent: number;
  fixedDeduction: number;
  taxAmount: number;
  effectiveTaxRatePercent: number;
  proclamation: string;
}

/**
 * Calculates employment income tax according to the Federal Income Tax
 * Amendment Proclamation No. 1395/2025 (Ethiopia).
 *
 * Formula: (Monthly Taxable Income × Tax Rate) - Fixed Deduction
 */
export function calculateEthiopianIncomeTax(monthlyTaxableIncome: number): TaxCalculationResult {
  const gross = Math.max(0, monthlyTaxableIncome);
  let bracket: TaxBracket = ETHIOPIAN_INCOME_TAX_BRACKETS[0];

  if (gross <= 2000) {
    bracket = ETHIOPIAN_INCOME_TAX_BRACKETS[0];
  } else if (gross <= 4000) {
    bracket = ETHIOPIAN_INCOME_TAX_BRACKETS[1];
  } else if (gross <= 7000) {
    bracket = ETHIOPIAN_INCOME_TAX_BRACKETS[2];
  } else if (gross <= 10000) {
    bracket = ETHIOPIAN_INCOME_TAX_BRACKETS[3];
  } else if (gross <= 14000) {
    bracket = ETHIOPIAN_INCOME_TAX_BRACKETS[4];
  } else {
    bracket = ETHIOPIAN_INCOME_TAX_BRACKETS[5];
  }

  const rawTax = gross * bracket.rateDecimal - bracket.fixedDeduction;
  const taxAmount = Math.round(Math.max(0, rawTax) * 100) / 100;
  const effectiveRate = gross > 0 ? Math.round((taxAmount / gross) * 10000) / 100 : 0;

  return {
    taxableIncome: gross,
    applicableBracket: bracket,
    taxRatePercent: bracket.ratePercent,
    fixedDeduction: bracket.fixedDeduction,
    taxAmount,
    effectiveTaxRatePercent: effectiveRate,
    proclamation: 'Proclamation No. 1395/2025',
  };
}
