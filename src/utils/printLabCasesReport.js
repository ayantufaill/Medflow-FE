import medflowLogo from '../assets/medflow-logo.png';
import { money } from '../components/labcases/labCasesConstants';

const escapeHtml = (value) => String(value ?? '').replace(/[&<>"']/g, (character) => ({
  '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
}[character]));

const printNotes = (labCase) => {
  const notes = String(labCase.notes || '').trim();
  if (!labCase.isBackend) return notes;
  // Backend instructions also contain fields already shown in the report.
  const lines = notes.split(/\r?\n/);
  const isFieldLine = (line) => /^(Type|Provider|Procedures|Shipping|Tracking|Status):/i.test(line.trim());
  if (lines.filter(isFieldLine).length < 2) return notes;
  return lines
    .filter((line) => !isFieldLine(line))
    .join('\n').trim();
};

const detail = (label, value) => value
  ? `<div class="detail"><span class="detail-label">${escapeHtml(label)}:</span> ${escapeHtml(value)}</div>`
  : '';

export function buildLabCasesPrintHtml({ cases, patientName, search = '', statusFilter = '', logoUrl }) {
  const filters = [
    search.trim() && `Search: ${search.trim()}`,
    statusFilter && `Status: ${statusFilter}`,
  ].filter(Boolean);
  const rows = cases.map((labCase) => {
    const notes = printNotes(labCase);
    return `<tbody class="case-group">
      <tr>
        <td>${escapeHtml(labCase.date || '')}</td>
        <td><div class="primary">${escapeHtml(labCase.procedure || '')}</div>${detail('Type', labCase.type)}</td>
        <td><div class="primary">${escapeHtml(labCase.lab || '')}</div>${detail('Tracking #', labCase.trackingNumber)}</td>
        <td>${detail('Est. receive', labCase.estReceiveDate)}${detail('Appointment', labCase.apptDate)}</td>
        <td>${escapeHtml(labCase.provider || '')}</td>
        <td>${escapeHtml(labCase.status || '')}</td>
        <td class="amounts">${detail('Shipping', money(labCase.shipping))}${detail('Lab fee', money(labCase.labFee))}
          <div class="total">Total: ${escapeHtml(money(labCase.total))}</div></td>
      </tr>
      ${notes ? `<tr class="notes-row"><td colspan="7"><span class="detail-label">Notes:</span> ${escapeHtml(notes)}</td></tr>` : ''}
    </tbody>`;
  }).join('');

  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <title>Lab Cases Report</title>
  <style>
    @page { size: A4 landscape; margin: 12mm; }
    * { box-sizing: border-box; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
    body { margin: 0; background: #fff; color: #1e293b; font: 11px/1.4 Arial, sans-serif; }
    header { text-align: center; margin-bottom: 22px; break-inside: avoid; break-after: avoid; }
    .logo { display: block; height: 45px; max-width: 100%; object-fit: contain; margin: 0 auto 14px; }
    h1 { margin: 0 0 6px; font-size: 22px; line-height: 1.3; }
    .subtitle { margin: 0; color: #475569; font-size: 12px; }
    .filters { margin: 5px 0 0; color: #64748b; font-size: 11px; }
    table { width: 100%; border-collapse: collapse; table-layout: fixed; }
    th, td { border: 1px solid #d7dde5; padding: 7px 8px; text-align: left; vertical-align: top; overflow-wrap: anywhere; }
    th { background: #f8f9fa; font-size: 11px; font-weight: 700; }
    thead { display: table-header-group; }
    .case-group { break-inside: avoid; page-break-inside: avoid; }
    .case-group:nth-of-type(even) td { background: #fcfdff; }
    .primary { font-weight: 600; }
    .detail { margin-top: 3px; }
    .detail-label { color: #64748b; font-weight: 600; }
    .amounts { font-variant-numeric: tabular-nums; }
    .total { margin-top: 5px; font-weight: 700; }
    .notes-row td { white-space: pre-wrap; }
    .empty { text-align: center; padding: 16px; }
  </style>
</head>
<body>
  <header>
    <img class="logo" src="${escapeHtml(logoUrl)}" alt="Medflow Logo" />
    <h1>Lab Cases Report</h1>
    <p class="subtitle">${escapeHtml(patientName || 'Selected Patient')} &middot; ${cases.length} case(s)</p>
    ${filters.length ? `<p class="filters">${filters.map(escapeHtml).join(' &middot; ')}</p>` : ''}
  </header>
  <table>
    <colgroup><col style="width: 9%" /><col style="width: 20%" /><col style="width: 16%" /><col style="width: 17%" /><col style="width: 12%" /><col style="width: 9%" /><col style="width: 17%" /></colgroup>
    <thead><tr><th scope="col">Date</th><th scope="col">Procedure</th><th scope="col">Lab</th><th scope="col">Dates</th><th scope="col">Provider</th><th scope="col">Status</th><th scope="col">Cost</th></tr></thead>
    ${rows || '<tbody><tr><td class="empty" colspan="7">No lab cases match the current filters.</td></tr></tbody>'}
  </table>
</body>
</html>`;
}

let activePrint = null;

export function printLabCasesReport({ cases, patientName, search, statusFilter }) {
  if (activePrint) return activePrint;
  const logoUrl = new URL(medflowLogo, document.baseURI).href;
  const html = buildLabCasesPrintHtml({ cases, patientName, search, statusFilter, logoUrl });

  activePrint = new Promise((resolve, reject) => {
    const iframe = document.createElement('iframe');
    const previousFocus = document.activeElement;
    iframe.title = 'Lab cases print document';
    iframe.setAttribute('aria-hidden', 'true');
    iframe.tabIndex = -1;
    Object.assign(iframe.style, {
      position: 'fixed', left: '-10000px', top: '0',
      width: '1123px', height: '794px', border: '0',
    });

    let previewTimer;
    const cleanup = () => {
      clearTimeout(loadTimer);
      clearTimeout(previewTimer);
      iframe.onload = null;
      if (iframe.contentWindow) iframe.contentWindow.onafterprint = null;
      iframe.remove();
      if (previousFocus?.isConnected) previousFocus.focus();
    };
    const fail = () => {
      cleanup();
      reject(new Error('The lab cases report could not be prepared for printing. Please try again.'));
    };
    const loadTimer = setTimeout(fail, 15000);

    iframe.onload = async () => {
      iframe.onload = null;
      try {
        const frameWindow = iframe.contentWindow;
        const doc = iframe.contentDocument;
        if (!frameWindow || !doc) throw new Error('Print document unavailable');
        await Promise.all(Array.from(doc.images, (img) => img.decode?.()));
        if (doc.fonts?.ready) await doc.fonts.ready;
        if (!iframe.isConnected) return;
        clearTimeout(loadTimer);
        frameWindow.onafterprint = () => {
          cleanup();
          resolve();
        };
        frameWindow.focus();
        frameWindow.print();
        if (iframe.isConnected) previewTimer = setTimeout(() => {
          cleanup();
          resolve();
        }, 120000);
      } catch {
        fail();
      }
    };

    iframe.srcdoc = html;
    document.body.appendChild(iframe);
  }).finally(() => {
    activePrint = null;
  });

  return activePrint;
}
