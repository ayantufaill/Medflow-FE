export const STATUS_CODE_TO_LABEL = {
  S: 'Scheduled',
  U: 'Unplanned',
  R: 'Rejected', // Or Referred
  C: 'Completed',
  EC: 'Existing Current',
  EO: 'Existing Other',
};

export const normalizeStatusLabel = (status) => STATUS_CODE_TO_LABEL[status] || status || 'Planned';

export const statusLabelToCode = (status) => {
  switch (status) {
    case 'Scheduled':
      return 'S';
    case 'Unplanned':
      return 'U';
    case 'Rejected':
      return 'R';
    case 'Referred':
      return 'R';
    case 'Completed':
      return 'C';
    case 'Existing Current':
      return 'EC';
    case 'Existing Other':
    case 'Existing':
      return 'EO';
    case 'Planned':
    default:
      return 'P';
  }
};

export const mapProcedureToPayloadItem = (item) => {
  const itemFee = item.negRate !== '-' && item.negRate ? Number(String(item.negRate).replace(/[^0-9.-]+/g, "")) : 0;
  const itemIns = item.insEst !== '-' && item.insEst ? Number(String(item.insEst).replace(/[^0-9.-]+/g, "")) : 0;
  const itemPt = item.ptEst !== '-' && item.ptEst ? Number(String(item.ptEst).replace(/[^0-9.-]+/g, "")) : 0;
  return {
    id: item.id,
    procedureCode: item.code,
    description: item.description,
    tooth: item.tooth || '',
    site: item.site,
    fee: itemFee,
    charge: itemFee,
    priority: item.priority,
    status: statusLabelToCode(item.status),
    icd: item.icd,
    provider: item.provider || null,
    prognosis: item.prognosis || '',
    creditToPractice: Boolean(item.creditToPractice),
    siteSelection: item.siteSelection || '',
    scheduled: item.scheduled,
    preAuth: item.preAuth,
    labCase: item.labCase,
    insEst: item.insEst,
    ptEst: item.ptEst,
    insPortion: itemIns,
    ptPortion: itemPt,
    insuranceAmount: `$${itemIns.toFixed(2)}`,
    patientAmount: `$${itemPt.toFixed(2)}`,
  };
};
