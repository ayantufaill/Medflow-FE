import dayjs from 'dayjs';
import { mapClaimFields } from './claimUtils';
import { getOutstandingDateBounds } from './outstandingDateBounds';
import {
  generateClaimsReportHtml,
  formatCurrency,
  formatStatus,
  printClaimsReport,
  getMemberOrSubscriberId,
} from './claimPrintUtils';
import {
  CLAIM_TYPES, CARRIERS, CLAIM_STATUSES, SORT_REPORT_OPTIONS, FILTER_DATE_OPTIONS,
} from '../../pages/claims/claimsConstants';

describe('Claim management tabs filter options and utilities', () => {
  test('constants define all expected dropdown values without gaps', () => {
    expect(CLAIM_TYPES.map((t) => t.value)).toContain('all');
    expect(CLAIM_TYPES.map((t) => t.value)).toContain('Manual Primary');
    expect(CLAIM_TYPES.map((t) => t.value)).toContain('All E-claim Primary');
    expect(CLAIM_TYPES.map((t) => t.value)).toContain('E-preauth Primary');
    expect(CLAIM_TYPES.map((t) => t.value)).toContain('Manual Preauth Primary');

    expect(CARRIERS.map((c) => c.value)).toContain('all');
    expect(CARRIERS.map((c) => c.value)).toContain('metlife');
    expect(CARRIERS.map((c) => c.value)).toContain('aetna');
    expect(CARRIERS.map((c) => c.value)).toContain('delta');

    expect(CLAIM_STATUSES.map((s) => s.value)).toContain('all');
    expect(CLAIM_STATUSES.map((s) => s.value)).toContain('Accepted');
    expect(CLAIM_STATUSES.map((s) => s.value)).toContain('Manual Claim');
    expect(CLAIM_STATUSES.map((s) => s.value)).toContain('Pending At Payor');
    expect(CLAIM_STATUSES.map((s) => s.value)).toContain('An error occurred when submitting the claim attachments');

    expect(SORT_REPORT_OPTIONS.map((s) => s.value)).toEqual([
      'none', 'sentDate', 'printedDate', 'patientName', 'carrierName', 'dos', 'claimDate',
    ]);

    expect(FILTER_DATE_OPTIONS.map((d) => d.value)).toContain('all');
    expect(FILTER_DATE_OPTIONS.map((d) => d.value)).toContain('thisWeek');
    expect(FILTER_DATE_OPTIONS.map((d) => d.value)).toContain('thisMonth');
    expect(FILTER_DATE_OPTIONS.map((d) => d.value)).toContain('lastMonth');
    expect(FILTER_DATE_OPTIONS.map((d) => d.value)).toContain('range');
  });

  test('mapClaimFields correctly formats raw backend claims for UI tabs', () => {
    const rawClaim = {
      id: 'claim_123',
      claimNumber: 'CLM123',
      claimFormat: 'Paper',
      insuranceType: 'primary',
      createdAt: '2026-10-10T09:00:00Z',
      patient: {
        firstName: 'Jane',
        lastName: 'Doe',
        dateOfBirth: '1990-05-15',
      },
      insuranceCompany: {
        name: 'MetLife Dental',
      },
      status: 'readyForSubmission',
      procedures: [
        { code: 'D0120', name: 'Periodic Oral Exam', fee: 50 },
      ],
    };

    const mapped = mapClaimFields(rawClaim, 'unsent');
    expect(mapped.id).toBe('claim_123');
    expect(mapped.claimNumber).toBe('CLM123');
    expect(mapped.patientName).toBe('Jane Doe');
    expect(mapped.carrier).toBe('MetLife Dental');
    expect(mapped.claimType).toBe('Manual Primary');
    expect(mapped.procedures).toHaveLength(1);
    expect(mapped.procedures[0].code).toBe('D0120');
  });

  test('date boundaries generate valid ISO ranges for all supported presets', () => {
    const now = dayjs('2026-10-16T12:00:00');
    const presets = ['thisWeek', 'thisMonth', 'last7Days', 'lastWeek', 'last4Weeks', 'lastMonth', 'last3Months', 'monthToDate', 'quarterToDate', 'yearToDate', 'lastYear'];

    presets.forEach((preset) => {
      const bounds = getOutstandingDateBounds(preset, {}, now);
      expect(bounds.start).toBeTruthy();
      expect(bounds.end).toBeTruthy();
      expect(new Date(bounds.start).getTime()).toBeLessThan(new Date(bounds.end).getTime());
    });

    const all = getOutstandingDateBounds('all', {}, now);
    expect(all.start).toBe('');
    expect(all.end).toBe('');
  });

  describe('Claims Management Branded Print Pop-up Utility', () => {
    beforeAll(() => {
      jest.spyOn(window, 'alert').mockImplementation(() => {});
    });

    afterAll(() => {
      window.alert.mockRestore?.();
    });

    test('formatCurrency and formatStatus helper functions format values accurately', () => {
      expect(formatCurrency(1250)).toBe('$1,250.00');
      expect(formatCurrency(0)).toBe('$0.00');
      expect(formatCurrency('350.5')).toBe('$350.50');
      expect(formatCurrency(null)).toBe('$0.00');

      expect(formatStatus('readyForSubmission')).toBe('Ready for Submission');
      expect(formatStatus('validationError')).toBe('Validation Error');
      expect(formatStatus('acceptedPaid')).toBe('Accepted & Paid');
      expect(formatStatus(null)).toBe('—');
    });

    test('generateClaimsReportHtml produces complete landscape report with logo, filter summary, and totals', () => {
      const claims = [
        {
          id: 'claim-1',
          claimNumber: 'CLM-001',
          patientName: 'Alice Smith',
          patientCode: 'P101',
          carrier: 'Delta Dental',
          claimType: 'Manual Primary',
          status: 'readyForSubmission',
          sentDate: '2026-10-12',
          procedures: [{ code: 'D0120' }, { code: 'D1110' }],
          submittedValue: 240,
        },
        {
          id: 'claim-2',
          claimNumber: 'CLM-002',
          patientName: 'Bob Jones',
          carrier: 'MetLife',
          claimType: 'All E-claim Primary',
          status: 'validationError',
          createdDate: '2026-10-14',
          procedures: ['D2391'],
          submittedValue: 160.5,
        },
      ];

      const html = generateClaimsReportHtml({
        claims,
        tabTitle: 'Unsent Claims',
        filters: {
          carrier: 'Delta Dental',
          status: 'readyForSubmission',
        },
        logoUrl: 'http://localhost:5173/assets/medflow-logo.png',
        now: new Date('2026-10-16T12:00:00Z'),
      });

      // Basic structure & styles
      expect(html).toContain('<!doctype html>');
      expect(html).toContain('size: A4 landscape;');
      expect(html).toContain('Claims Management — Unsent Claims');
      expect(html).toContain('http://localhost:5173/assets/medflow-logo.png');

      // Filter summary
      expect(html).toContain('Carrier: Delta Dental');
      expect(html).toContain('Status: readyForSubmission');

      // Rows content
      expect(html).toContain('CLM-001');
      expect(html).toContain('Alice Smith (P101)');
      expect(html).toContain('Delta Dental');
      expect(html).toContain('Ready for Submission');
      expect(html).toContain('D0120, D1110');
      expect(html).toContain('$240.00');

      expect(html).toContain('CLM-002');
      expect(html).toContain('Bob Jones');
      expect(html).toContain('Validation Error');
      expect(html).toContain('D2391');
      expect(html).toContain('$160.50');

      // Footer totals
      expect(html).toContain('Total: 2 Claims');
      expect(html).toContain('Grand Total:');
      expect(html).toContain('$400.50');
    });

    test('generateClaimsReportHtml for Outstanding Claims displays Member ID for membership plan and Subscriber ID for non-membership', () => {
      const outstandingClaims = [
        {
          id: 'out-1',
          claimNumber: 'CLM-OUT-101',
          patientName: 'Sarah Connor',
          patientDob: '05/12/1984',
          hasMembershipPlan: true,
          memberId: 'MEM-987654',
          subscriberId: 'SUB-IGNORED-1',
          carrier: 'Direct Dental Membership',
          claimType: 'Manual Primary',
          status: 'submitted',
          dos: '10/01/2026',
          sentDate: '10/03/2026',
          submittedValue: 550,
        },
        {
          id: 'out-2',
          claimNumber: 'CLM-OUT-102',
          patientName: 'John Smith',
          patientDob: '01/15/1990',
          hasMembershipPlan: false,
          memberId: '',
          subscriberId: 'SUB-DELTA-777',
          carrier: 'Delta Dental PPO',
          claimType: 'E-claim Primary',
          status: 'accepted',
          dos: '10/05/2026',
          sentDate: '10/06/2026',
          submittedValue: 320,
        },
      ];

      // Unit check getMemberOrSubscriberId directly
      expect(getMemberOrSubscriberId(outstandingClaims[0])).toBe('MEM-987654');
      expect(getMemberOrSubscriberId(outstandingClaims[1])).toBe('SUB-DELTA-777');
      expect(getMemberOrSubscriberId(null)).toBe('—');

      const html = generateClaimsReportHtml({
        claims: outstandingClaims,
        tabTitle: 'Outstanding Claims',
        isOutstanding: true,
      });

      // Verify custom Outstanding headers
      expect(html).toContain('>DOB</th>');
      expect(html).toContain('>Member / Subscriber ID</th>');
      expect(html).toContain('>DOS</th>');
      expect(html).toContain('>Sent Date</th>');
      expect(html).toContain('>Billed Amount</th>');

      // Verify row 1 (membership patient displays memberId)
      expect(html).toContain('CLM-OUT-101');
      expect(html).toContain('Sarah Connor');
      expect(html).toContain('05/12/1984');
      expect(html).toContain('MEM-987654');
      expect(html).not.toContain('SUB-IGNORED-1');

      // Verify row 2 (non-membership patient displays subscriberId)
      expect(html).toContain('CLM-OUT-102');
      expect(html).toContain('John Smith');
      expect(html).toContain('01/15/1990');
      expect(html).toContain('SUB-DELTA-777');

      expect(html).toContain('Total: 2 Claims');
      expect(html).toContain('$870.00');
    });

    test('generateClaimsReportHtml ensures multiple claims for the same patient consistently display the correct subscriber ID and never patientCode PAT001', () => {
      const samePatientClaims = [
        {
          id: 'claim-1',
          claimNumber: 'CLM-84017',
          patientName: 'James Harrison',
          patientCode: 'PAT001',
          patientDob: '4/12/1978',
          hasMembershipPlan: false,
          subscriberId: 'GRP32432234234233',
          carrier: 'Delta Dental',
          claimType: 'E-claim Primary',
          status: 'submitted',
          dos: '10/10/2026',
          sentDate: '10/11/2026',
          submittedValue: 400,
        },
        {
          id: 'claim-2',
          claimNumber: 'CLM-84018',
          patientName: 'James Harrison',
          patientCode: 'PAT001',
          patientDob: '4/12/1978',
          hasMembershipPlan: false,
          subscriberId: '', // lacks direct subscriber ID
          carrier: 'Delta Dental',
          claimType: 'E-claim Primary',
          status: 'pending',
          dos: '10/12/2026',
          sentDate: '10/13/2026',
          submittedValue: 250,
        },
      ];

      // Direct check: a claim with patientCode 'PAT001' must never have getMemberOrSubscriberId return 'PAT001'
      expect(getMemberOrSubscriberId(samePatientClaims[1])).toBe('—');

      const html = generateClaimsReportHtml({
        claims: samePatientClaims,
        tabTitle: 'Outstanding Claims',
        isOutstanding: true,
      });

      // Both rows must display James Harrison (PAT001) in patient column
      expect(html).toContain('James Harrison (PAT001)');
      // Both rows must resolve and display the subscriber ID GRP32432234234233
      const occurrences = (html.match(/<td>GRP32432234234233<\/td>/g) || []).length;
      expect(occurrences).toBe(2);
      // 'PAT001' must NEVER appear in the member/subscriber ID column
      expect(html).not.toContain('<td>PAT001</td>');
    });

    test('generateClaimsReportHtml displays empty table and zero totals when no claims provided', () => {
      const html = generateClaimsReportHtml({
        claims: [],
        tabTitle: 'Errored Claims',
      });

      expect(html).toContain('Claims Management — Errored Claims');
      expect(html).toContain('All Claims (No filter applied)');
      expect(html).toContain('Total: 0 Claims');
      expect(html).toContain('$0.00');
    });

    test('printClaimsReport handles empty claims without throwing and returns a promise', async () => {
      const result = await printClaimsReport({ claims: [] });
      expect(result).toBeUndefined();
    });
  });
});
