import {
  getVisibleConditionalSections,
  validateCoverageForm,
  splitOrderPositions,
  getClaimBlockers,
  isClaimBlocked,
  orderBadges,
  formatEstimate,
  isUnknownMethodEstimate,
  isHistoricalOrder,
  buildMismatchComparison,
  isFixedBenefit,
  payerReportedRanking,
  deriveCoverageFormContext,
} from '../cobUtils';

/**
 * These are the rules the whole COB UI leans on — which questions appear,
 * what blocks a claim, and how an estimate is worded. They are tested here as
 * pure functions so the component tests can focus on rendering rather than
 * re-proving the logic through the DOM.
 */

describe('getVisibleConditionalSections', () => {
  it('hides every conditional section for a plain self-pay commercial policy', () => {
    const visible = getVisibleConditionalSections(
      { payerType: 'COMMERCIAL', relationship: 'SELF', coverageBasis: 'EMPLOYER_GROUP' },
      {}
    );

    expect(visible.subscriber).toBe(false);
    expect(visible.medicare).toBe(false);
    expect(visible.esrdDate).toBe(false);
    expect(visible.employment).toBe(false);
    expect(visible.custody).toBe(false);
    expect(visible.cobraRetiree).toBe(false);
  });

  it('shows the subscriber questions as soon as the policyholder is not the patient', () => {
    expect(getVisibleConditionalSections({ relationship: 'SPOUSE' }).subscriber).toBe(true);
    expect(getVisibleConditionalSections({ relationship: 'PARENT' }).subscriber).toBe(true);
    expect(getVisibleConditionalSections({ relationship: 'OTHER' }).subscriber).toBe(true);
    expect(getVisibleConditionalSections({ relationship: 'SELF' }).subscriber).toBe(false);
  });

  it('shows Medicare questions for a Medicare payer, and the ESRD date only for ESRD', () => {
    const base = { payerType: 'MEDICARE', relationship: 'SELF' };

    expect(getVisibleConditionalSections(base).medicare).toBe(true);
    expect(getVisibleConditionalSections(base).esrdDate).toBe(false);

    const esrd = getVisibleConditionalSections({ ...base, medicareEntitlementReason: 'ESRD' });
    expect(esrd.esrdDate).toBe(true);

    const age = getVisibleConditionalSections({ ...base, medicareEntitlementReason: 'AGE' });
    expect(age.esrdDate).toBe(false);
  });

  it('asks about working and employer size only when Medicare meets employer coverage', () => {
    const medicareAlone = getVisibleConditionalSections(
      { payerType: 'MEDICARE', coverageBasis: 'MEDICARE' },
      { otherCoverages: [] }
    );
    expect(medicareAlone.employment).toBe(false);

    const medicarePlusEmployer = getVisibleConditionalSections(
      { payerType: 'MEDICARE', coverageBasis: 'MEDICARE' },
      { otherCoverages: [{ coverageBasis: 'EMPLOYER_GROUP' }] }
    );
    expect(medicarePlusEmployer.employment).toBe(true);
  });

  it('asks custody questions only for a dependent child carried on both parents', () => {
    const oneParent = getVisibleConditionalSections(
      { relationship: 'PARENT' },
      { patientIsDependentChild: true, otherCoverages: [{ relationship: 'SELF' }] }
    );
    expect(oneParent.custody).toBe(false);

    const bothParents = getVisibleConditionalSections(
      { relationship: 'PARENT' },
      { patientIsDependentChild: true, otherCoverages: [{ relationship: 'PARENT' }] }
    );
    expect(bothParents.custody).toBe(true);
    // Nothing further is asked until we know the parents are not together.
    expect(bothParents.custodyDetail).toBe(false);

    const separated = getVisibleConditionalSections(
      { relationship: 'PARENT', custodyArrangement: 'DIVORCED' },
      { patientIsDependentChild: true, otherCoverages: [{ relationship: 'PARENT' }] }
    );
    expect(separated.custodyDetail).toBe(true);
  });

  it('stops asking custody detail when the parents are married or living together', () => {
    const together = getVisibleConditionalSections(
      { relationship: 'PARENT', custodyArrangement: 'TOGETHER' },
      { patientIsDependentChild: true, otherCoverages: [{ relationship: 'PARENT' }] }
    );
    expect(together.custody).toBe(true);
    expect(together.custodyDetail).toBe(false);
  });

  it('asks about employment status for COBRA and retiree coverage', () => {
    expect(getVisibleConditionalSections({ coverageBasis: 'COBRA' }).cobraRetiree).toBe(true);
    expect(getVisibleConditionalSections({ coverageBasis: 'RETIREE' }).cobraRetiree).toBe(true);
    expect(getVisibleConditionalSections({ coverageBasis: 'INDIVIDUAL' }).cobraRetiree).toBe(false);
  });
});

describe('validateCoverageForm', () => {
  const valid = {
    carrierId: '1',
    planId: '10',
    memberId: 'M123',
    relationship: 'SELF',
  };

  it('accepts a complete self policy', () => {
    expect(validateCoverageForm(valid)).toEqual({});
  });

  it('requires the subscriber date of birth when the policyholder is not the patient', () => {
    const errors = validateCoverageForm({
      ...valid,
      relationship: 'SPOUSE',
      subscriberName: 'Jane Doe',
      subscriberBirthdate: null,
    });

    expect(errors.subscriberBirthdate).toMatch(/date of birth/i);
  });

  it('does not require the subscriber date of birth for a self policy', () => {
    const errors = validateCoverageForm({ ...valid, relationship: 'SELF' });
    expect(errors.subscriberBirthdate).toBeUndefined();
    expect(errors.subscriberName).toBeUndefined();
  });

  it('never requires a field whose question is hidden', () => {
    // Commercial payer: the Medicare reason is not on screen, so it must not
    // be able to block the save.
    const errors = validateCoverageForm({ ...valid, payerType: 'COMMERCIAL' });
    expect(errors.medicareEntitlementReason).toBeUndefined();
    expect(errors.esrdEntitlementDate).toBeUndefined();
    expect(errors.custodyArrangement).toBeUndefined();
  });

  it('requires employer size only while the policyholder is still working', () => {
    const context = { otherCoverages: [{ coverageBasis: 'EMPLOYER_GROUP' }] };
    const base = { ...valid, payerType: 'MEDICARE', medicareEntitlementReason: 'AGE' };

    expect(
      validateCoverageForm({ ...base, employmentStatus: 'ACTIVE' }, context).employerSizeBand
    ).toBeDefined();

    expect(
      validateCoverageForm({ ...base, employmentStatus: 'RETIRED' }, context).employerSizeBand
    ).toBeUndefined();
  });
});

describe('splitOrderPositions', () => {
  it('ranks by position and keeps the backend-excluded coverages apart', () => {
    const { ranked, excluded } = splitOrderPositions({
      positions: [
        { position: 2, coverageId: 'b' },
        { position: 1, coverageId: 'a' },
      ],
      excludedCoverages: [{ coverageId: 'c', explanation: 'Pays the patient.' }],
    });

    expect(ranked.map((p) => p.coverageId)).toEqual(['a', 'b']);
    expect(excluded.map((p) => p.coverageId)).toEqual(['c']);
  });

  it('never renders a null-position row as a rank', () => {
    // shapeOrder types position as `number | null`, so a null must fall to the
    // excluded list rather than becoming "Payer null".
    const { ranked, excluded } = splitOrderPositions({
      positions: [
        { position: 1, coverageId: 'a' },
        { position: null, coverageId: 'c' },
      ],
    });

    expect(ranked.map((p) => p.coverageId)).toEqual(['a']);
    expect(excluded.map((p) => p.coverageId)).toEqual(['c']);
  });

  it('handles a missing order without throwing', () => {
    expect(splitOrderPositions(undefined)).toEqual({ ranked: [], excluded: [] });
  });
});

describe('isFixedBenefit', () => {
  it('recognises indemnity plans', () => {
    expect(isFixedBenefit({ benefitCategory: 'FIXED_INDEMNITY' })).toBe(true);
    expect(isFixedBenefit({ benefitCategory: 'MEDICAL' })).toBe(false);
  });
});

describe('getClaimBlockers', () => {
  it("uses the server's own sentence when submission is refused", () => {
    const reason =
      'The coverage order for 2026-10-08 is incomplete: a coordination rule needs ' +
      'information we do not have (cov-spouse.subscriberBirthdate).';

    const blockers = getClaimBlockers({
      order: { status: 'NEEDS_INFO' },
      submittable: { allowed: false, reason, orderId: 'order-1', status: 'NEEDS_INFO' },
    });

    // Verbatim: the panel must say exactly what an attempted submit would say.
    expect(blockers).toEqual([reason]);
    expect(isClaimBlocked({ submittable: { allowed: false, reason } })).toBe(true);
  });

  it('reports nothing blocking when the server allows submission', () => {
    const payload = {
      order: { status: 'SUGGESTED', flags: [{ id: 1, flag: 'COVERAGE_CHANGED', resolvedAt: null }] },
      submittable: { allowed: true, reason: null },
    };

    expect(getClaimBlockers(payload)).toEqual([]);
    expect(isClaimBlocked(payload)).toBe(false);
  });

  it('trusts the server even when our own flag reading would disagree', () => {
    // An unresolved PAYER_MISMATCH that the server has decided is fine must
    // not be turned back into a block by the client.
    const payload = {
      order: { status: 'CONFIRMED', flags: [{ id: 1, flag: 'PAYER_MISMATCH', resolvedAt: null }] },
      submittable: { allowed: true, reason: null },
    };

    expect(getClaimBlockers(payload)).toEqual([]);
  });

  describe('fallback when no submittable block is present', () => {
    it('blocks on the statuses the backend treats as blocking', () => {
      expect(isClaimBlocked({ status: 'NEEDS_INFO' })).toBe(true);
      expect(isClaimBlocked({ status: 'NEEDS_REVIEW' })).toBe(true);
      expect(isClaimBlocked({ status: 'DISPUTED' })).toBe(true);
    });

    it('blocks on an unresolved payer mismatch', () => {
      expect(
        isClaimBlocked({
          status: 'SUGGESTED',
          flags: [{ id: 1, flag: 'PAYER_MISMATCH', resolvedAt: null }],
        })
      ).toBe(true);
    });

    it('does not block once the mismatch is resolved', () => {
      expect(
        getClaimBlockers({
          status: 'SUGGESTED',
          flags: [{ id: 1, flag: 'PAYER_MISMATCH', resolvedAt: '2026-10-01' }],
        })
      ).toEqual([]);
    });

    it('does not block on the purely informational flags', () => {
      expect(
        getClaimBlockers({
          status: 'SUGGESTED',
          flags: [{ id: 1, flag: 'COVERAGE_CHANGED', resolvedAt: null }],
        })
      ).toEqual([]);
    });

    it('handles a missing payload', () => {
      expect(getClaimBlockers(null)).toEqual([]);
      expect(getClaimBlockers(undefined)).toEqual([]);
    });
  });
});

describe('orderBadges', () => {
  it('shows both the status and the payer verification', () => {
    expect(
      orderBadges({ status: 'CONFIRMED', verification: { status: 'VERIFIED_WITH_PAYER' } })
    ).toEqual(['CONFIRMED', 'VERIFIED_WITH_PAYER']);
  });

  it('adds a disputed badge while a payer mismatch is unresolved', () => {
    const badges = orderBadges({
      status: 'SUGGESTED',
      flags: [{ id: 1, flag: 'PAYER_MISMATCH', resolvedAt: null }],
    });
    expect(badges).toContain('DISPUTED');
  });
});

describe('formatEstimate', () => {
  it('shows a single figure when the low and high agree', () => {
    expect(formatEstimate({ estimateLow: 120, estimateHigh: 120 })).toBe('$120.00');
  });

  it('shows a range when the plan payment method is unknown', () => {
    expect(formatEstimate({ estimateLow: 0, estimateHigh: 240 })).toBe('$0.00 – $240.00');
  });

  it('falls back to the plain amount with no estimate bounds', () => {
    expect(formatEstimate({ amount: 55.5 })).toBe('$55.50');
  });

  it('flags an unknown-method estimate so the UI can explain the range', () => {
    expect(isUnknownMethodEstimate({ estimated: true, cobPaymentMethod: 'UNKNOWN' })).toBe(true);
    expect(isUnknownMethodEstimate({ estimated: true, cobPaymentMethod: 'STANDARD' })).toBe(false);
    expect(isUnknownMethodEstimate({ estimated: false, cobPaymentMethod: 'UNKNOWN' })).toBe(false);
  });
});

describe('isHistoricalOrder', () => {
  it("uses the backend's isCurrent flag", () => {
    expect(isHistoricalOrder({ isCurrent: true })).toBe(false);
    expect(isHistoricalOrder({ isCurrent: false })).toBe(true);
  });

  it('falls back to a closed effective range', () => {
    expect(isHistoricalOrder({ effectiveTo: '2026-03-31' })).toBe(true);
    expect(isHistoricalOrder({ effectiveTo: null })).toBe(false);
  });

  it('handles a missing order', () => {
    expect(isHistoricalOrder(null)).toBe(false);
  });
});

describe('buildMismatchComparison', () => {
  const order = {
    positions: [
      { position: 1, coverageId: 'a', explanation: 'Birthday rule.' },
      { position: 2, coverageId: 'b', explanation: 'Later birthday.' },
    ],
  };
  const coveragesById = {
    a: { displayName: 'Cigna PPO' },
    b: { displayName: 'Aetna Choice' },
  };

  it('lines our order up against the positions the payer named', () => {
    const report = {
      coverageId: 'b',
      reportingCarrierName: 'Aetna',
      reportedSelfOrder: 1,
      otherPayerCarrierId: 'a',
      otherPayerName: 'Cigna',
      otherPayerReportedOrder: 2,
    };

    const { ours, theirs } = buildMismatchComparison(order, report, coveragesById);

    expect(ours.map((o) => o.label)).toEqual(['Cigna PPO', 'Aetna Choice']);
    expect(ours[0].explanation).toBe('Birthday rule.');
    expect(theirs.map((t) => t.label)).toEqual(['Aetna Choice', 'Cigna']);
    expect(theirs.map((t) => t.position)).toEqual([1, 2]);
  });

  it('lists only what the insurer actually said', () => {
    // The usual case: the payer names a position for itself and nothing else.
    // Inferring the rest would be putting words in the insurer's mouth.
    const { theirs } = buildMismatchComparison(
      order,
      { coverageId: 'b', reportedSelfOrder: 1, reportingCarrierName: 'Aetna' },
      coveragesById
    );

    expect(theirs).toHaveLength(1);
    expect(theirs[0]).toMatchObject({ position: 1, label: 'Aetna Choice' });
  });

  it('returns an empty payer column when the insurer named no order', () => {
    expect(buildMismatchComparison({ positions: [] }, null, {}).theirs).toEqual([]);
  });
});

describe('payerReportedRanking', () => {
  const order = {
    positions: [
      { position: 1, coverageId: 'a' },
      { position: 2, coverageId: 'b' },
    ],
  };

  it('builds the full ranking when the payer placed every coverage we hold', () => {
    const ranking = payerReportedRanking(order, {
      coverageId: 'b',
      reportedSelfOrder: 1,
      otherPayerCoverageId: 'a',
      otherPayerReportedOrder: 2,
    });

    expect(ranking).toEqual(['b', 'a']);
  });

  it('refuses to guess when the payer named only itself', () => {
    // The override endpoint replaces the WHOLE order, so a partial ranking
    // would silently drop a coverage.
    expect(payerReportedRanking(order, { coverageId: 'b', reportedSelfOrder: 1 })).toBeNull();
  });

  it('refuses when the payer named a coverage we do not hold', () => {
    expect(
      payerReportedRanking(order, {
        coverageId: 'zzz',
        reportedSelfOrder: 1,
        otherPayerCoverageId: 'a',
        otherPayerReportedOrder: 2,
      })
    ).toBeNull();
  });

  it('handles a missing report or an empty order', () => {
    expect(payerReportedRanking(order, null)).toBeNull();
    expect(payerReportedRanking({ positions: [] }, { reportedSelfOrder: 1 })).toBeNull();
  });
});

describe('deriveCoverageFormContext', () => {
  const child = { dateOfBirth: '2015-04-02' };
  const adult = { dateOfBirth: '1980-04-02' };

  const bothParents = [
    { id: 'c1', relationship: 'PARENT', coverageBasis: 'EMPLOYER_GROUP' },
    { id: 'c2', relationship: 'PARENT', coverageBasis: 'EMPLOYER_GROUP' },
  ];

  it('treats a young patient on a parent policy as a dependent child', () => {
    const context = deriveCoverageFormContext({ patient: child, coverages: bothParents });
    expect(context.patientIsDependentChild).toBe(true);
    expect(context.otherCoverages).toHaveLength(2);
  });

  it('does not treat an adult on a parent policy as a dependent child', () => {
    // Age alone and relationship alone are both wrong; it takes both.
    expect(
      deriveCoverageFormContext({ patient: adult, coverages: bothParents }).patientIsDependentChild
    ).toBe(false);
  });

  it('does not treat a child with only their own policy as a dependent child', () => {
    expect(
      deriveCoverageFormContext({
        patient: child,
        coverages: [{ id: 'c1', relationship: 'SELF' }],
      }).patientIsDependentChild
    ).toBe(false);
  });

  it('excludes the coverage being edited from otherCoverages', () => {
    const context = deriveCoverageFormContext({
      patient: child,
      coverages: bothParents,
      editingCoverageId: 'c1',
    });

    expect(context.otherCoverages.map((c) => c.id)).toEqual(['c2']);
    // The patient is still a dependent child — that is about all their
    // policies, not just the other ones.
    expect(context.patientIsDependentChild).toBe(true);
  });

  it('is safe with no patient and no coverages', () => {
    expect(deriveCoverageFormContext()).toEqual({
      otherCoverages: [],
      patientIsDependentChild: false,
      patientAge: null,
    });
  });

  it('feeds getVisibleConditionalSections so the custody branch opens', () => {
    // The whole point of the helper: its output must switch the form's
    // conditional questions on.
    const context = deriveCoverageFormContext({ patient: child, coverages: bothParents });
    const visible = getVisibleConditionalSections({ relationship: 'PARENT' }, context);
    expect(visible.custody).toBe(true);
  });
});
