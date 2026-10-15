import { buildCarrierSearchRows } from './carrierSearchRows';

const carrier = {
  _id: '17',
  name: 'Example Dental',
  payerId: 'A1234',
  addressLine1: '10 Main Street',
  city: 'Boston',
  state: 'MA',
  zipCode: '02108',
  plans: [
    { id: '91', groupName: 'Standard Plan', groupNumber: 'G1', employerName: 'Acme Inc' },
    { id: '92', groupName: 'Premium Plan', groupNumber: 'G2', employerName: 'Beta LLC' },
  ],
};

test('keeps real plan and employer values attached to the selected carrier address', () => {
  const rows = buildCarrierSearchRows([carrier]);
  expect(rows).toHaveLength(2);
  expect(rows.map((row) => [row._rowKey, row.employerName, row.groupNumber])).toEqual([
    ['17-plan-91', 'Acme Inc', 'G1'],
    ['17-plan-92', 'Beta LLC', 'G2'],
  ]);
  expect(rows.every((row) => row.resolvedAddress === '10 Main Street, Boston, MA 02108')).toBe(true);
});

test('an employer search returns only the matching saved plan row', () => {
  expect(buildCarrierSearchRows([carrier], 'beta').map((row) => row._rowKey)).toEqual(['17-plan-92']);
});

test('a carrier without plans still has a selectable address row', () => {
  expect(buildCarrierSearchRows([{ _id: '18', name: 'Solo', addressLine1: '2 Oak Road', plans: [] }]))
    .toEqual([expect.objectContaining({ _rowKey: '18-carrier', resolvedAddress: '2 Oak Road' })]);
});
