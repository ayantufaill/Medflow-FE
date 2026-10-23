import { getCoverageAmounts, getRemainingBenefits } from './insuranceHelpers';

describe('saved coverage Used Amount', () => {
  const calculatedUsage = { usedAmount: 734.20, annualMax: 2000, remaining: 1265.80 };

  it('shows the saved amount and derives remaining benefits from it', () => {
    const coverage = { coverageLimits: { individual: { usedAmount: '450.50', annualMax: '2000' } } };
    expect(getCoverageAmounts(coverage, calculatedUsage)).toEqual({ usedAmount: 450.50, maxAmount: 2000 });
    expect(getRemainingBenefits(coverage, calculatedUsage)).toBe(1549.50);
  });

  it('keeps a cleared field empty instead of showing calculated usage', () => {
    const coverage = { coverageLimits: { individual: { usedAmount: '', annualMax: 2000 } }, usedAmount: 600 };
    expect(getCoverageAmounts(coverage, calculatedUsage).usedAmount).toBe(0);
  });

  it('reads JSON coverage limits and a legacy flat saved amount', () => {
    expect(getCoverageAmounts({ coverageLimits: '{"individual":{"usedAmount":"125.25"}}' }, calculatedUsage).usedAmount).toBe(125.25);
    expect(getCoverageAmounts({ usedAmount: 80 }, calculatedUsage).usedAmount).toBe(80);
  });
});
