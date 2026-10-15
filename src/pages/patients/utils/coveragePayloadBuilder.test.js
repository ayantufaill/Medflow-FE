import {
  isFixedBenefitPlan,
  sanitizeCoverageForType,
  buildCoveragePayload,
} from './coveragePayloadBuilder';

const categoryData = {
  preventative: [
    { id: 'D1110', label: 'D1110', coverage: 100, waiting: 0 },
    { id: 'D1206', label: 'D1206', coverage: 80, waiting: 6 },
  ],
  restorative: [{ id: 'D2140', label: 'D2140', coverage: 80, waiting: 0 }],
};

const bookData = [
  { code: 'D1110', flatPlanPortion: '50' },
  { code: 'D2740', nc: true },
];

describe('isFixedBenefitPlan', () => {
  it('is true for the copay/fixed coverage type', () => {
    expect(isFixedBenefitPlan('flat')).toBe(true);
    expect(isFixedBenefitPlan('copay')).toBe(true);
    expect(isFixedBenefitPlan('FLAT')).toBe(true);
  });

  it('is false for percentage plans', () => {
    expect(isFixedBenefitPlan('ppo')).toBe(false);
    expect(isFixedBenefitPlan(undefined)).toBe(false);
    expect(isFixedBenefitPlan('')).toBe(false);
  });
});

describe('sanitizeCoverageForType', () => {
  it('leaves percentages intact for a percentage plan', () => {
    const result = sanitizeCoverageForType(categoryData, bookData, 'ppo');
    expect(result.coverageCategoryData).toBe(categoryData);
    expect(result.coverageBookData).toBe(bookData);
    expect(result.coverageCategoryData.preventative[0].coverage).toBe(100);
  });

  it('strips coverage percentages from category items for a copay plan', () => {
    const result = sanitizeCoverageForType(categoryData, bookData, 'flat');
    for (const items of Object.values(result.coverageCategoryData)) {
      for (const item of items) {
        expect(item).not.toHaveProperty('coverage');
      }
    }
    // Non-percentage fields survive.
    expect(result.coverageCategoryData.preventative[0].waiting).toBe(0);
    expect(result.coverageCategoryData.preventative[1].waiting).toBe(6);
    expect(result.coverageCategoryData.preventative[0].label).toBe('D1110');
  });

  it('does not mutate the input data', () => {
    sanitizeCoverageForType(categoryData, bookData, 'flat');
    expect(categoryData.preventative[0].coverage).toBe(100);
  });
});

describe('buildCoveragePayload', () => {
  const baseForm = {
    renewalMonth: 'January',
    insuranceCompanyId: '1',
    subscriber: { subscriberId: 'X1', name: 'A B', relationship: 'Self' },
    deductibles: [{ individual: '' }],
    coverage: {},
    coverageType: 'flat',
    assignmentOfBenefits: 1,
  };

  it('drops percentages from the saved category table for a copay plan', () => {
    const payload = buildCoveragePayload(baseForm, bookData, categoryData);
    const preventative = payload.coverageCategoryTable.find((c) => c.category === 'preventative');
    expect(preventative.items.every((i) => !('coverage' in i))).toBe(true);
  });

  it('keeps percentages for a percentage plan', () => {
    const payload = buildCoveragePayload(
      { ...baseForm, coverageType: 'ppo' },
      bookData,
      categoryData,
    );
    const preventative = payload.coverageCategoryTable.find((c) => c.category === 'preventative');
    expect(preventative.items[0].coverage).toBe(100);
  });
});
