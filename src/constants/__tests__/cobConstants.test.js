import fs from 'fs';
import path from 'path';
import {
  PAYER_TYPES,
  BENEFIT_CATEGORIES,
  COB_PAYMENT_METHODS,
  COB_INFO_SOURCES,
  SUBSCRIBER_RELATIONSHIPS,
  COVERAGE_BASES,
  EMPLOYMENT_STATUSES,
  EMPLOYER_SIZE_BANDS,
  MEDICARE_ENTITLEMENT_REASONS,
  CUSTODY_ARRANGEMENTS,
  CUSTODY_ROLES,
  ORDER_STATUS,
  ORDER_STATUS_BADGES,
  BLOCKING_ORDER_STATUSES,
  BLOCKING_STATUS_REASONS,
  COB_PERMISSIONS,
  MIN_OVERRIDE_REASON_LENGTH,
  MIN_RESOLUTION_NOTE_LENGTH,
  REVIEW_FLAGS,
  REVIEW_FLAG_META,
  ELIGIBILITY_SOURCES,
  RESPONSIBLE_PARTIES,
  positionLabel,
  missingFieldLabel,
  missingFieldSection,
} from '../cobConstants';

describe('cobConstants — completeness', () => {
  it('gives every order status a badge', () => {
    Object.values(ORDER_STATUS).forEach((status) => {
      expect(ORDER_STATUS_BADGES[status]).toBeDefined();
      expect(ORDER_STATUS_BADGES[status].label).toBeTruthy();
    });
  });

  it('gives every review flag a title, a body and one action', () => {
    Object.values(REVIEW_FLAGS).forEach((flag) => {
      const meta = REVIEW_FLAG_META[flag];
      expect(meta).toBeDefined();
      expect(meta.title).toBeTruthy();
      expect(meta.body).toBeTruthy();
      expect(meta.actionLabel).toBeTruthy();
    });
  });

  it("marks exactly the backend's blocking flags as blocking", () => {
    // Mirrors BLOCKING_FLAGS in Medflow-BE/src/services/cob/cob.service.ts.
    const blocking = Object.entries(REVIEW_FLAG_META)
      .filter(([, meta]) => meta.blocking)
      .map(([flag]) => flag)
      .sort();

    expect(blocking).toEqual(['COB_DENIAL', 'PAYER_MISMATCH', 'RANKING_CYCLE']);
  });

  it("marks exactly the backend's blocking statuses as blocking", () => {
    // Mirrors BLOCKING_STATUSES. DISPUTED is the easy one to forget.
    expect([...BLOCKING_ORDER_STATUSES].sort()).toEqual([
      'DISPUTED',
      'NEEDS_INFO',
      'NEEDS_REVIEW',
    ]);
    BLOCKING_ORDER_STATUSES.forEach((status) => {
      expect(BLOCKING_STATUS_REASONS[status]).toBeTruthy();
    });
  });

  it('exposes the backend validators’ minimum text lengths', () => {
    expect(MIN_OVERRIDE_REASON_LENGTH).toBe(10);
    expect(MIN_RESOLUTION_NOTE_LENGTH).toBe(5);
  });

  it('uses the permission keys the backend routes enforce', () => {
    expect(COB_PERMISSIONS).toEqual({
      ORDER_READ: 'insurance.coverage_order.read',
      ORDER_OVERRIDE: 'insurance.coverage_order.override',
      FLAG_RESOLVE: 'insurance.coverage_order.resolve_flag',
      COVERAGE_DETAIL_EDIT: 'insurance.coverage_detail.edit',
      PAYER_REPORTED_WRITE: 'insurance.payer_reported.write',
      PLAN_MASTER_READ: 'insurance.plan_master.read',
      PLAN_MASTER_EDIT: 'insurance.plan_master.edit',
    });
  });

  it('names positions beyond tertiary rather than rendering blank', () => {
    expect(positionLabel(1)).toBe('Primary');
    expect(positionLabel(2)).toBe('Secondary');
    expect(positionLabel(3)).toBe('Tertiary');
    expect(positionLabel(4)).toBe('Payer 4');
  });

  it('turns an unmapped missing field into something readable', () => {
    expect(missingFieldLabel('subscriberBirthdate')).toBe("Policyholder's date of birth");
    expect(missingFieldLabel('someNewBackendField')).toBe('Some New Backend Field');
    expect(missingFieldSection('someNewBackendField')).toBe('coverage');
  });
});

describe('cobConstants — plain language', () => {
  /**
   * The front desk must never be shown "COB". Admin screens may use the
   * spelled-out phrase, which the help text for the plan master does.
   */
  const FRONT_DESK_LISTS = [
    ['payer types', PAYER_TYPES],
    ['benefit categories', BENEFIT_CATEGORIES],
    ['policyholder relationships', SUBSCRIBER_RELATIONSHIPS],
    ['coverage bases', COVERAGE_BASES],
    ['employment statuses', EMPLOYMENT_STATUSES],
    ['employer sizes', EMPLOYER_SIZE_BANDS],
    ['Medicare reasons', MEDICARE_ENTITLEMENT_REASONS],
    ['custody arrangements', CUSTODY_ARRANGEMENTS],
    ['custody roles', CUSTODY_ROLES],
    ['eligibility sources', ELIGIBILITY_SOURCES],
    ['responsible parties', RESPONSIBLE_PARTIES],
  ];

  it.each(FRONT_DESK_LISTS)('%s use no COB jargon', (_name, list) => {
    list.forEach((option) => {
      // "COBRA" is a real benefit someone reads off a letter, so it is allowed;
      // a bare "COB" is not.
      expect(option.label).not.toMatch(/\bCOB\b/);
      expect(option.label).not.toMatch(/coordination of benefits/i);
    });
  });

  it('explains every payment method in words, not codes', () => {
    COB_PAYMENT_METHODS.forEach((method) => {
      expect(method.label).not.toBe(method.value);
      expect(method.help).toBeTruthy();
    });
  });

  it('spells out where plan information came from', () => {
    COB_INFO_SOURCES.forEach((source) => {
      expect(source.label).not.toBe(source.value);
    });
  });
});

/**
 * Drift guard against the backend's own enum list. Skipped automatically when
 * the backend checkout is not alongside this one (CI with a single repo), so
 * it is a local safety net rather than a build dependency.
 */
const BE_TYPES = path.resolve(__dirname, '../../../../Medflow-BE/src/services/cob/types.ts');
const beAvailable = fs.existsSync(BE_TYPES);

(beAvailable ? describe : describe.skip)('cobConstants — matches the backend enums', () => {
  const source = beAvailable ? fs.readFileSync(BE_TYPES, 'utf8') : '';

  /**
   * Reads the members of a backend enum type, in either style the backend
   * uses:
   *
   *   export type X = 'A' | 'B';                  // literal union
   *   export const XS = ['A','B'] as const;       // const array...
   *   export type X = (typeof XS)[number];        // ...plus a derived type
   *
   * Both appear in `types.ts` today, and the second is the one the backend
   * has been migrating to — a parser that only understood unions silently
   * returned an empty list and the guard passed by accident.
   */
  const beEnum = (typeName) => {
    const typeMatch = source.match(new RegExp(`export type ${typeName}\\s*=([^;]+);`));
    if (!typeMatch) return null;
    const rhs = typeMatch[1];

    const literals = (text) => [...text.matchAll(/'([A-Z0-9_]+)'/g)].map((m) => m[1]);

    // Literal union: the members are right there.
    const direct = literals(rhs);
    if (direct.length > 0) return direct.sort();

    // Derived from a const array: follow the reference.
    const derived = rhs.match(/\(\s*typeof\s+([A-Za-z0-9_]+)\s*\)\s*\[\s*number\s*\]/);
    if (!derived) return null;

    const arrayMatch = source.match(
      new RegExp(`export const ${derived[1]}\\s*(?::[^=]+)?=\\s*\\[([^\\]]*)\\]`)
    );
    if (!arrayMatch) return null;

    const members = literals(arrayMatch[1]);
    return members.length > 0 ? members.sort() : null;
  };

  const cases = [
    ['PayerType', PAYER_TYPES],
    ['BenefitCategory', BENEFIT_CATEGORIES],
    ['CobPaymentMethod', COB_PAYMENT_METHODS],
    ['CobInfoSource', COB_INFO_SOURCES],
    ['SubscriberRelationship', SUBSCRIBER_RELATIONSHIPS],
    ['CoverageBasis', COVERAGE_BASES],
    ['EmploymentStatus', EMPLOYMENT_STATUSES],
    ['EmployerSizeBand', EMPLOYER_SIZE_BANDS],
    ['MedicareEntitlementReason', MEDICARE_ENTITLEMENT_REASONS],
    ['CustodyArrangement', CUSTODY_ARRANGEMENTS],
    ['CustodyRole', CUSTODY_ROLES],
    ['EligibilitySource', ELIGIBILITY_SOURCES],
    ['ResponsibleParty', RESPONSIBLE_PARTIES],
  ];

  it.each(cases)('%s covers exactly the backend values', (typeName, list) => {
    const expected = beEnum(typeName);
    // A null or empty read means the parser lost track of the backend's
    // style, which must fail the guard rather than silently pass it.
    expect(expected).not.toBeNull();
    expect(expected.length).toBeGreaterThan(0);
    expect(list.map((o) => o.value).sort()).toEqual(expected);
  });

  it('ReviewFlag covers exactly the backend values', () => {
    const expected = beEnum('ReviewFlag');
    expect(expected?.length).toBeGreaterThan(0);
    expect(Object.keys(REVIEW_FLAGS).sort()).toEqual(expected);
  });

  it('OrderStatus covers exactly the backend values', () => {
    const expected = beEnum('OrderStatus');
    expect(expected?.length).toBeGreaterThan(0);
    expect(Object.keys(ORDER_STATUS).sort()).toEqual(expected);
  });
});
