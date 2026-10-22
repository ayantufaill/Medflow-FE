import { buildHistoryPrintHtml, printHistoryHtml } from './historyPrintReport';

export function printMedicalHistoryFromData(medicalHistory, patient, returnHtmlOnly = false, options = {}) {
  const html = buildHistoryPrintHtml({ type: 'medical', history: medicalHistory, patient, ...options });
  return returnHtmlOnly ? html : printHistoryHtml(html);
}
