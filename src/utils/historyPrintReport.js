import medflowLogo from '../assets/medflow-logo.png';

const escapeHtml = (value) => String(value ?? '').replace(/[&<>"']/g, (character) => ({
  '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
}[character]));

const textValue = (value) => {
  if (typeof value === 'boolean') return value ? 'Yes' : 'No';
  if (Array.isArray(value)) return value.filter(Boolean).join(', ');
  if (value && typeof value === 'object') return '';
  return String(value ?? '').trim();
};

const dateValue = (value) => {
  if (!value) return '';
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? '' : date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
};

const safeImageUrl = (value) => {
  const url = String(value || '').trim();
  return /^(https?:\/\/|\/|data:image\/(?:png|jpeg|webp);base64,)/i.test(url) ? escapeHtml(url) : '';
};

const section = (title, content) => `<section class="report-section"><h2>${escapeHtml(title)}</h2>${content}</section>`;

const detailsTable = (items) => {
  const rows = Object.entries(items || {}).filter(([, value]) => textValue(value) !== '').map(([key, value]) => {
    const label = key.replace(/([A-Z])/g, ' $1').replace(/^./, (letter) => letter.toUpperCase());
    return `<tr><th scope="row">${escapeHtml(label)}</th><td>${escapeHtml(textValue(value))}</td></tr>`;
  }).join('');
  return rows ? `<table class="details-table"><tbody>${rows}</tbody></table>` : '<p class="empty">No information recorded.</p>';
};

const historyTable = (items, groupRows = false) => {
  if (!Array.isArray(items) || !items.length) return '<p class="empty">No entries recorded.</p>';
  const renderRow = (item) => {
    const extras = [textValue(item.additionalInfo), textValue(item.note), item.scale != null && item.scale !== '' ? `Scale: ${item.scale}` : ''].filter(Boolean);
    const answer = textValue(item.answer) || 'Not answered';
    const answerClass = answer.toLowerCase() === 'yes' ? 'answer-yes' : answer.toLowerCase() === 'no' ? 'answer-no' : 'answer-empty';
    return `<tr><td>${escapeHtml(item.question || item.name || '')}</td><td class="answer ${answerClass}">${escapeHtml(answer)}</td><td>${escapeHtml(extras.join(' · '))}</td></tr>`;
  };
  const rows = groupRows
    ? Array.from(items.reduce((groups, item) => {
      const name = item.group || 'General';
      if (!groups.has(name)) groups.set(name, []);
      groups.get(name).push(item);
      return groups;
    }, new Map()), ([name, groupItems]) => `${name !== 'General' ? `<tr class="group-row"><th colspan="3" scope="rowgroup">${escapeHtml(name)}</th></tr>` : ''}${groupItems.map(renderRow).join('')}`).join('')
    : items.map(renderRow).join('');
  return `<table class="history-table"><colgroup><col style="width:48%" /><col style="width:17%" /><col style="width:35%" /></colgroup><thead><tr><th scope="col">Question / condition</th><th scope="col">Answer</th><th scope="col">Details</th></tr></thead><tbody>${rows}</tbody></table>`;
};

const medicationTable = (items, firstLabel) => {
  if (!Array.isArray(items) || !items.length) return '<p class="empty">None recorded.</p>';
  const rows = items.map((item) => `<tr><td>${escapeHtml(item.drug || item.name || '')}</td><td>${escapeHtml(item.dosage || '')}</td><td>${escapeHtml(item.purpose || '')}</td></tr>`).join('');
  return `<table class="history-table"><colgroup><col style="width:38%" /><col style="width:24%" /><col style="width:38%" /></colgroup><thead><tr><th scope="col">${escapeHtml(firstLabel)}</th><th scope="col">Dosage</th><th scope="col">Purpose</th></tr></thead><tbody>${rows}</tbody></table>`;
};

const renderMedical = (history) => {
  const premed = history?.premed || {};
  const premedNotice = premed.requiresPremed
    ? `<div class="premed"><strong>Premedication required</strong>${premed.premedDetails ? ` — ${escapeHtml(premed.premedDetails)}` : ''}</div>`
    : '';
  return `${premedNotice}
    ${section('General information', detailsTable(history?.generalInfo))}
    ${section('Medical conditions', historyTable(history?.sections))}
    ${section('Medications', medicationTable(history?.medications, 'Medication'))}
    ${section('Supplements and vitamins', medicationTable(history?.supplements, 'Supplement'))}`;
};

const DENTAL_SECTIONS = [
  ['Personal history', 'personalHistory'],
  ['Gum and bone', 'gumAndBone'],
  ['Bite and jaw joint', 'biteAndJawJoint'],
  ['Tooth structure', 'toothStructure'],
  ['Smile characteristics', 'smileCharacteristics'],
];

const renderDental = (history) => `${section('General information', detailsTable(history?.generalInfo))}
  ${DENTAL_SECTIONS.map(([title, key]) => {
    const summary = history?.sectionSummaries?.[key] || {};
    const summaryText = [summary.risk && `Risk: ${summary.risk}`, summary.additionalInfo].filter(Boolean).map(escapeHtml).join(' · ');
    return section(title, `${summaryText ? `<p class="section-summary">${summaryText}</p>` : ''}${historyTable(history?.[key], true)}`);
  }).join('')}`;

export function buildHistoryPrintHtml({ type, history, patient, unsaved = false, printedAt = new Date(), logoUrl = medflowLogo }) {
  const isMedical = type === 'medical';
  const title = isMedical ? 'Medical History' : 'Dental History';
  const patientName = [patient?.firstName || patient?.FName, patient?.lastName || patient?.LName].filter(Boolean).join(' ') || 'Patient';
  const dob = dateValue(patient?.dateOfBirth || patient?.Birthdate);
  const reviewed = dateValue(history?.review?.reviewedAt);
  const signatureUrl = safeImageUrl(history?.review?.signatureDataUrl);

  return `<!doctype html><html lang="en"><head><meta charset="utf-8" /><title>${title} - ${escapeHtml(patientName)}</title>
  <style>
    @page { size: A4 portrait; margin: 12mm; }
    * { box-sizing: border-box; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
    body { margin: 0; background: #fff; color: #1e293b; font: 12px/1.5 Arial, sans-serif; }
    .report-header { text-align: center; margin-bottom: 18px; break-inside: avoid; }
    .logo { display: block; height: 44px; max-width: 100%; object-fit: contain; margin: 0 auto 12px; }
    h1 { font-size: 22px; line-height: 1.25; margin: 0 0 10px; }
    .meta { display: flex; flex-wrap: wrap; justify-content: center; gap: 5px 18px; color: #475569; font-size: 11px; }
    .meta strong { color: #1e293b; }
    .draft { margin: 10px auto 0; padding: 6px 10px; background: #fff7ed; border: 1px solid #fdba74; color: #9a3412; max-width: 500px; }
    .premed { margin: 0 0 16px; padding: 9px 12px; border: 1px solid #f59e0b; background: #fffbeb; color: #92400e; break-inside: avoid; }
    .report-section { margin: 0 0 17px; }
    h2 { font-size: 13px; line-height: 1.35; margin: 0 0 7px; padding: 0 0 5px; border-bottom: 2px solid #2362ef; color: #0f172a; break-after: avoid; }
    table { width: 100%; border-collapse: collapse; table-layout: fixed; font-size: 11px; }
    th, td { border: 1px solid #d7dde5; padding: 7px 8px; text-align: left; vertical-align: top; overflow-wrap: anywhere; white-space: pre-wrap; }
    thead th { background: #f8f9fa; font-weight: 700; }
    thead { display: table-header-group; }
    tr { break-inside: avoid; page-break-inside: avoid; }
    .details-table th { width: 36%; background: #f8f9fa; font-weight: 600; }
    .group-row th { background: #eef3f9; color: #334155; font-size: 11px; break-after: avoid; }
    .answer { font-weight: 700; }
    .answer-yes { color: #b42318; } .answer-no { color: #067647; } .answer-empty { color: #64748b; font-weight: 400; }
    .section-summary { margin: 0 0 8px; padding: 7px 9px; background: #f8fafc; border: 1px solid #d7dde5; white-space: pre-wrap; }
    .empty { margin: 0; padding: 5px 0; color: #64748b; font-style: italic; }
    .signature { margin-top: 18px; break-inside: avoid; }
    .signature img { display: block; max-width: 260px; max-height: 90px; object-fit: contain; margin-top: 7px; }
  </style></head><body>
  <header class="report-header"><img class="logo" src="${safeImageUrl(logoUrl)}" alt="Medflow logo" /><h1>${title}</h1>
    <div class="meta"><span><strong>Patient:</strong> ${escapeHtml(patientName)}</span>${dob ? `<span><strong>DOB:</strong> ${escapeHtml(dob)}</span>` : ''}${reviewed ? `<span><strong>Reviewed:</strong> ${escapeHtml(reviewed)}</span>` : ''}<span><strong>Printed:</strong> ${escapeHtml(dateValue(printedAt))}</span></div>
    ${unsaved ? '<p class="draft">Contains unsaved changes from the current form.</p>' : ''}
  </header>
  ${isMedical ? renderMedical(history) : renderDental(history)}
  ${signatureUrl ? section('Patient signature', `<div class="signature"><img src="${signatureUrl}" alt="Patient signature" /></div>`) : ''}
  </body></html>`;
}

let activePrint = null;

export function printHistoryHtml(html) {
  if (activePrint) return activePrint;
  activePrint = new Promise((resolve, reject) => {
    const iframe = document.createElement('iframe');
    const previousFocus = document.activeElement;
    iframe.title = 'History print document';
    iframe.setAttribute('aria-hidden', 'true');
    iframe.tabIndex = -1;
    Object.assign(iframe.style, { position: 'fixed', left: '-10000px', top: '0', width: '794px', height: '1123px', border: '0' });
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
      reject(new Error('The history report could not be prepared for printing. Please try again.'));
    };
    const loadTimer = setTimeout(fail, 15000);
    iframe.onload = async () => {
      iframe.onload = null;
      try {
        const printWindow = iframe.contentWindow;
        const printDocument = iframe.contentDocument;
        if (!printWindow || !printDocument) throw new Error('Print document unavailable');
        await Promise.all(Array.from(printDocument.images, (img) => img.decode?.()));
        if (printDocument.fonts?.ready) await printDocument.fonts.ready;
        if (!iframe.isConnected) return;
        clearTimeout(loadTimer);
        printWindow.onafterprint = () => { cleanup(); resolve(); };
        printWindow.focus();
        printWindow.print();
        if (iframe.isConnected) previewTimer = setTimeout(() => { cleanup(); resolve(); }, 120000);
      } catch {
        fail();
      }
    };
    iframe.srcdoc = html;
    document.body.appendChild(iframe);
  }).finally(() => { activePrint = null; });
  return activePrint;
}
