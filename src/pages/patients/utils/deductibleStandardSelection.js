const isStandardRow = (row) => String(row?.type || '').trim().toLowerCase() === 'standard';
const isProcedureCodeRow = (row) =>
  row?.isCodeRow || String(row?.typeKey || '').toLowerCase().startsWith('code:') ||
  /^D?\d{4,5}$/i.test(String(row?.type || '').trim());

export const expandStandardSelection = (rows = []) => {
  if (!rows.some((row) => isStandardRow(row) && row.standard)) return rows;
  return rows.map((row) => isProcedureCodeRow(row) ? row : { ...row, standard: true });
};

export const updateDeductibleSelection = (rows, index, field, value) => {
  const selected = rows[index];
  if (!selected) return rows;
  if (field === 'standard' && isStandardRow(selected)) {
    return rows.map((row) => isProcedureCodeRow(row) ? row : { ...row, standard: value });
  }
  return rows.map((row, i) => {
    if (i === index) return { ...row, [field]: value };
    if (field === 'standard' && value === false && !isProcedureCodeRow(selected) && isStandardRow(row)) {
      return { ...row, standard: false };
    }
    return row;
  });
};
