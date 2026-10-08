export const normalizeIcd10Code = (value) => {
  const code = String(value ?? '').trim().toUpperCase();
  if (!code || code === '-') return '';
  if (!/^[A-Z][0-9][A-Z0-9](?:\.?[A-Z0-9]{1,4})?$/.test(code)) return code;
  const compact = code.replace('.', '');
  return compact.length > 3 ? `${compact.slice(0, 3)}.${compact.slice(3)}` : compact;
};

export const getProcedureIcd = (procedure) => {
  const value = Object.hasOwn(procedure, 'icd') ? procedure.icd : (procedure.diagnosticCode ?? procedure.DiagnosticCode);
  return value == null || value === '-' ? '' : String(value);
};

export const findAppointmentProcedureIndex = (procedures, procedureId) => {
  const index = procedures.findIndex(p => String(p.id ?? p._id) === String(procedureId));
  if (index >= 0) return index;
  const fallback = Number(procedureId);
  return /^\d+$/.test(String(procedureId)) && fallback < procedures.length
    && procedures[fallback].id == null && procedures[fallback]._id == null ? fallback : -1;
};
