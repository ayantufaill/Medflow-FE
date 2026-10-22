import { describe, it, expect } from 'vitest';
import {
  hasUnclaimedSecondaryLines,
  secondaryClaimedItemIds,
} from '../secondaryClaimEligibility';

// Ashley Brown (patient 16), captured from the live API. Her D2140 line on
// invoice INV1791464041 carries $28.00 of unclaimed secondary estimate even
// though she already has a secondary claim on her D2740.
const D2740 = '1791494092552325';
const D2140 = '1791494092552326';

const coverages = [
  { _id: '4', insuranceType: 'primary', isActive: true, insuranceCompanyId: { name: 'Delta Dental PPO' } },
  { _id: '291', insuranceType: 'secondary', isActive: true, insuranceCompanyId: { name: 'MetLife Test Dental' } },
];

const claims = [
  {
    claimNumber: 'CLM1791494255269056',
    insuranceType: 'secondary',
    procedures: [{ id: D2740, code: 'D2740', fee: 950 }],
  },
  {
    claimNumber: 'CLM000130',
    insuranceType: 'primary',
    procedures: [{ id: D2140, code: 'D2140', fee: 140 }],
  },
];

const proceduresByProcNum = new Map([
  [D2740, { _id: D2740, cptCode: 'D2740', secondaryInsPortion: 475 }],
  [D2140, { _id: D2140, cptCode: 'D2140', secondaryInsPortion: 28 }],
]);

describe('secondary claim eligibility (Ashley Brown, patient 16)', () => {
  it('collects only the items already on a secondary claim', () => {
    const ids = secondaryClaimedItemIds(claims);
    expect(ids.has(D2740)).toBe(true);
    // Claimed by the PRIMARY only — still secondary-claimable.
    expect(ids.has(D2140)).toBe(false);
  });

  it('still offers the prompt for D2140 despite the existing secondary claim', () => {
    expect(
      hasUnclaimedSecondaryLines({
        coverages,
        procedures: [{ id: D2140 }],
        proceduresByProcNum,
        claims,
      }),
    ).toBe(true);
  });

  it('does not re-offer the prompt for D2740, already on secondary claim', () => {
    expect(
      hasUnclaimedSecondaryLines({
        coverages,
        procedures: [{ id: D2740 }],
        proceduresByProcNum,
        claims,
      }),
    ).toBe(false);
  });

  it('stays quiet when the patient has no secondary coverage', () => {
    expect(
      hasUnclaimedSecondaryLines({
        coverages: [coverages[0]],
        procedures: [{ id: D2140 }],
        proceduresByProcNum,
        claims: [],
      }),
    ).toBe(false);
  });

  it('stays quiet when no line carries a secondary estimate', () => {
    expect(
      hasUnclaimedSecondaryLines({
        coverages,
        procedures: [{ id: 'no-estimate-line' }],
        proceduresByProcNum,
        claims: [],
      }),
    ).toBe(false);
  });
});
