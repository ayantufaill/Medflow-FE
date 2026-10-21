import { buildHistoryPrintHtml, printHistoryHtml } from './historyPrintReport';

export function printDentalHistoryFromData(dentalHistory, patient, returnHtmlOnly = false, options = {}) {
  const html = buildHistoryPrintHtml({ type: 'dental', history: dentalHistory, patient, ...options });
  return returnHtmlOnly ? html : printHistoryHtml(html);
}
