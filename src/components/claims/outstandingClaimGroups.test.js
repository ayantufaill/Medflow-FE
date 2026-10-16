import { groupOutstandingClaims } from './outstandingClaimGroups';

test('groups by saved service date and carrier, preserving claims within each group', () => {
  const claims = [
    { id: '1', dateOfService: '2026-10-01', createdDate: '01/01/2020', carrier: 'Aetna', patientName: 'A' },
    { id: '2', dateOfService: '2026-07-01', createdDate: '10/15/2026', carrier: 'Aetna', patientName: 'B' },
    { id: '3', dateOfService: null, carrier: 'MetLife', patientName: 'C' },
  ];
  const groups = groupOutstandingClaims(claims, 'dos', 'carrier', new Date('2026-10-16T12:00:00'));
  expect(groups.map((group) => group.label)).toEqual([
    '0-30 days / Aetna', '>90 days / Aetna', 'Unknown service date / MetLife',
  ]);
  expect(groups.flatMap((group) => group.claims.map((claim) => claim.id))).toEqual(['1', '2', '3']);
});
