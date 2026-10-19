import { expandStandardSelection, updateDeductibleSelection } from './deductibleStandardSelection';

const rows = [
  { type: 'Standard', standard: false, individual: '100' },
  { type: 'Preventative', standard: false, individual: '200' },
  { type: 'Basic', standard: false, individual: '300' },
  { type: 'Major', standard: false, individual: '400' },
  { type: 'Orthodontics', standard: false, individual: '500' },
  { type: 'D2391', standard: false, individual: '25' },
];

test('Standard checkbox selects every category without changing amounts or procedure overrides', () => {
  const checked = updateDeductibleSelection(rows, 0, 'standard', true);
  expect(checked.slice(0, 5).every((row) => row.standard)).toBe(true);
  expect(checked.map((row) => row.individual)).toEqual(rows.map((row) => row.individual));
  expect(checked[5].standard).toBe(false);
  expect(updateDeductibleSelection(checked, 0, 'standard', false).slice(0, 5)
    .every((row) => !row.standard)).toBe(true);
});

test('manually unchecking a category turns off the global Standard selection', () => {
  const checked = updateDeductibleSelection(rows, 0, 'standard', true);
  const updated = updateDeductibleSelection(checked, 2, 'standard', false);
  expect(updated[0].standard).toBe(false);
  expect(updated[1].standard).toBe(true);
  expect(updated[2].standard).toBe(false);
});

test('expands an older saved grid whose Standard row alone was checked', () => {
  const loaded = expandStandardSelection([{ ...rows[0], standard: true }, ...rows.slice(1)]);
  expect(loaded.slice(0, 5).every((row) => row.standard)).toBe(true);
  expect(loaded[5].standard).toBe(false);
});
