export interface CalculationInputs {
  currentAge: number;
  retirementAge: number;
  currentBalance: number;
  monthlyContribution: number;
  annualContributionIncrease: number; // percentage
  expectedReturn: number; // percentage
  inflationRate: number; // percentage
  lifeExpectancy: number;
  desiredMonthlyIncomeToday: number;
  country: string;
}

export interface YearData {
  year: number;
  age: number;
  balance: number;
  contributions: number;
  growth: number;
  inflationAdjustedBalance: number;
}

export interface CalculationResults {
  projectedCorpus: number;
  totalContributions: number;
  totalGrowth: number;
  inflationAdjustedCorpus: number;
  monthlyIncomePossibleToday: number;
  shortfallOrSurplus: number;
  yearlyBreakdown: YearData[];
  onTrack: boolean;
}

export function calculateRetirement(inputs: CalculationInputs): CalculationResults {
  const {
    currentAge,
    retirementAge,
    currentBalance,
    monthlyContribution,
    annualContributionIncrease,
    expectedReturn: annualReturn,
    inflationRate,
    lifeExpectancy,
    desiredMonthlyIncomeToday,
  } = inputs;

  const yearsToRetire = retirementAge - currentAge;
  if (yearsToRetire <= 0) {
    return {
      projectedCorpus: currentBalance,
      totalContributions: 0,
      totalGrowth: 0,
      inflationAdjustedCorpus: currentBalance,
      monthlyIncomePossibleToday: 0,
      shortfallOrSurplus: 0,
      yearlyBreakdown: [],
      onTrack: false,
    };
  }

  const monthlyReturn = annualReturn / 100 / 12;
  const monthlyInflation = inflationRate / 100 / 12;
  
  let currentYearBalance = currentBalance;
  let totalContrib = 0;
  let totalGrowth = 0;
  let currentMonthlyContrib = monthlyContribution;
  
  const yearlyBreakdown: YearData[] = [];

  for (let year = 1; year <= yearsToRetire; year++) {
    let yearContrib = 0;
    let yearGrowth = 0;

    for (let month = 1; month <= 12; month++) {
      const growth = currentYearBalance * monthlyReturn;
      yearGrowth += growth;
      currentYearBalance += growth + currentMonthlyContrib;
      yearContrib += currentMonthlyContrib;
      totalContrib += currentMonthlyContrib;
    }

    totalGrowth += yearGrowth;
    
    // Inflation adjusted balance (what this amount is worth in today's money)
    const inflationFactor = Math.pow(1 + inflationRate / 100, year);
    const inflationAdjustedBalance = currentYearBalance / inflationFactor;

    yearlyBreakdown.push({
      year,
      age: currentAge + year,
      balance: currentYearBalance,
      contributions: yearContrib,
      growth: yearGrowth,
      inflationAdjustedBalance,
    });

    // Increase contribution for next year
    currentMonthlyContrib *= (1 + annualContributionIncrease / 100);
  }

  const projectedCorpus = currentYearBalance;
  const inflationAdjustedCorpus = projectedCorpus / Math.pow(1 + inflationRate / 100, yearsToRetire);

  // How much monthly income can this corpus generate?
  // Using simplified 4% rule (safe withdrawal rate) or custom logic
  // Let's use a drawdown for the logic:
  // But a simple way is: (Corpus * WithdrawalRate) / 12
  const withdrawalRate = 0.04; 
  const monthlyIncomePossibleRaw = (projectedCorpus * withdrawalRate) / 12;
  // Adjust this income back to today's money to compare with desiredIncomeToday
  const monthlyIncomePossibleToday = monthlyIncomePossibleRaw / Math.pow(1 + inflationRate / 100, yearsToRetire);

  const shortfallOrSurplus = monthlyIncomePossibleToday - desiredMonthlyIncomeToday;
  const onTrack = shortfallOrSurplus >= 0;

  return {
    projectedCorpus,
    totalContributions: totalContrib,
    totalGrowth,
    inflationAdjustedCorpus,
    monthlyIncomePossibleToday,
    shortfallOrSurplus,
    yearlyBreakdown,
    onTrack,
  };
}

export const REGIONAL_PRESETS: Record<string, Partial<CalculationInputs>> = {
  India: {
    retirementAge: 60,
    expectedReturn: 12,
    inflationRate: 6,
    annualContributionIncrease: 5,
  },
  Australia: {
    retirementAge: 67,
    expectedReturn: 8,
    inflationRate: 3,
    annualContributionIncrease: 3,
  },
  USA: {
    retirementAge: 65,
    expectedReturn: 7,
    inflationRate: 2.5,
    annualContributionIncrease: 3,
  },
  UK: {
    retirementAge: 67,
    expectedReturn: 6,
    inflationRate: 2.5,
    annualContributionIncrease: 2,
  },
};
