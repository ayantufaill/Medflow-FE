import { describe, expect, it } from 'vitest';
import { normalizeIcd10Code, getProcedureIcd, findAppointmentProcedureIndex } from './icd10';

describe('appointment diagnosis reload and identity', () => {
  it('reads saved diagnoses and respects an explicit clear', () => {
    expect(getProcedureIcd({ icd: 'K02.9' })).toBe('K02.9');
    expect(getProcedureIcd({ DiagnosticCode: 'K04.7' })).toBe('K04.7');
    expect(getProcedureIcd({ icd: null, DiagnosticCode: 'K04.7' })).toBe('');
    expect(getProcedureIcd({ icd: 'D2392' })).toBe('D2392');
  });
  it('finds the clicked procedure by database ID when codes repeat', () => {
    const rows = [{ _id: '90', code: 'D2392' }, { _id: '91', code: 'D2392' }];
    expect(findAppointmentProcedureIndex(rows, '91')).toBe(1);
    expect(findAppointmentProcedureIndex(rows, '90')).toBe(0);
    expect(findAppointmentProcedureIndex(rows, '999')).toBe(-1);
    expect(findAppointmentProcedureIndex(rows, '0')).toBe(-1);
    expect(findAppointmentProcedureIndex([{ code: 'D2392' }], '0')).toBe(0);
  });
  it('accepts either code format and clearing', () => {
    expect(normalizeIcd10Code(' k029 ')).toBe('K02.9');
    expect(normalizeIcd10Code('K02.9')).toBe('K02.9');
    expect(normalizeIcd10Code('-')).toBe('');
  });
});
