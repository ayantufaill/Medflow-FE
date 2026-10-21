import medflowLogo from '../assets/medflow-logo.png';

const escapeHtml = (value) => String(value ?? '').replace(/[&<>"']/g, (character) => ({
  '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
}[character]));

const displayDate = (value) => {
  if (!value) return 'Not recorded';
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? 'Not recorded' : date.toLocaleDateString('en-US', {
    year: 'numeric', month: 'short', day: 'numeric',
  });
};

const displayDiagnosis = (diagnosis = {}) => {
  const labels = {
    healthy: 'Healthy', gingivitis: 'Gingivitis', periodontitis: 'Periodontitis',
    stage1: 'Stage I', stage2: 'Stage II', stage3: 'Stage III', stage4: 'Stage IV',
    gradeA: 'Grade A', gradeB: 'Grade B', gradeC: 'Grade C',
    localized: 'Localized', generalized: 'Generalized', 'molar-incisor': 'Molar-incisor',
  };
  if (!diagnosis.type) return 'Not recorded';
  const fields = diagnosis.type === 'periodontitis'
    ? [diagnosis.type, diagnosis.stage, diagnosis.distribution, diagnosis.grading]
    : [diagnosis.type];
  return fields.filter(Boolean).map((field) => labels[field] || field).join(' · ');
};

const triplet = (values) => Array.from({ length: 3 }, (_, index) => {
  const value = values?.[index];
  return value === '' || value == null ? '–' : String(value);
}).join(' / ');

const bleedingTriplet = (values) => Array.from({ length: 3 }, (_, index) =>
  values?.includes(index) ? '●' : '–').join(' / ');

const scalar = (value) => value && value !== 'none' ? String(value) : '–';
const pcs = (values) => Array.isArray(values) && values.length ? values.join(', ') : '–';

const metrics = [
  ['Probing depth, mm', (side) => triplet(side?.probe)],
  ['Recession, mm', (side) => triplet(side?.recession)],
  ['Attachment loss, mm', (side) => triplet(side?.attachment)],
  ['Bleeding', (side) => bleedingTriplet(side?.bleeding)],
  ['Plaque / calc. / supp.', (side) => pcs(side?.pcs)],
  ['Furcation', (side) => scalar(side?.furcation)],
  ['Mobility', (side) => scalar(side?.mobility)],
];

const renderArch = (title, teeth, chartData, missingTeeth, pageClass, pageContext = '') => {
  const missing = new Set((missingTeeth || []).map(Number));
  const head = teeth.map((number) => `<th scope="col" class="tooth-heading ${missing.has(number) ? 'missing' : ''}">${number}${missing.has(number) ? '<small>Missing</small>' : ''}</th>`).join('');
  const section = (side, label) => `<tr class="side-heading"><th colspan="17" scope="colgroup">${label}</th></tr>${metrics.map(([name, read]) => `<tr><th scope="row" class="metric">${name}</th>${teeth.map((number) => {
    if (missing.has(number)) return '<td class="missing">—</td>';
    const value = read(chartData?.[number]?.[side]);
    return `<td>${escapeHtml(value)}</td>`;
  }).join('')}</tr>`).join('')}`;
  return `<section class="arch ${pageClass}">${pageContext ? `<div class="page-context">${pageContext}</div>` : ''}<div class="arch-header"><h2>${title}</h2><span>Teeth ${teeth[0]}–${teeth[teeth.length - 1]}</span></div>
    <table class="chart"><colgroup><col class="metric-col" />${teeth.map(() => '<col />').join('')}</colgroup>
      <thead><tr><th scope="col" class="metric">Measurement</th>${head}</tr></thead>
      <tbody>${section('facial', 'Facial / buccal')}${section('lingual', 'Lingual / palatal')}</tbody>
    </table>
    <p class="legend">Site values follow chart entry order (1 / 2 / 3). ● indicates bleeding; P = plaque, C = calculus, S = suppuration. A dash means no value was recorded.</p>
  </section>`;
};

export function buildPeriodontalChartPrintHtml({ patient, patientId, appointmentId, examDate, savedAt, provider, diagnosis, summaryData, chartData, missingTeeth, isSigned = false, unsaved = false, printedAt = new Date(), logoUrl = medflowLogo }) {
  const patientName = [patient?.firstName || patient?.FName, patient?.lastName || patient?.LName].filter(Boolean).join(' ') || 'Name unavailable';
  const patientCode = patient?.patientCode || patientId;
  const summaryRows = (summaryData || []).map((row) => `<tr><th scope="row">${escapeHtml(row.label)}</th><td>${escapeHtml(row.bleeding)}</td><td>${escapeHtml(row.p4)}</td><td>${escapeHtml(row.p5)}</td><td>${escapeHtml(row.p6)}</td><td>${escapeHtml(row.recession)}</td></tr>`).join('');
  const header = `<header class="report-header"><img class="logo" src="${escapeHtml(logoUrl)}" alt="Medflow logo" /><h1>Periodontal Chart</h1>
    <div class="meta"><span><strong>Patient:</strong> ${escapeHtml(patientName)}</span><span><strong>Patient ID:</strong> ${escapeHtml(patientCode)}</span><span><strong>DOB:</strong> ${escapeHtml(displayDate(patient?.dateOfBirth || patient?.Birthdate))}</span>
    <span><strong>Exam date:</strong> ${escapeHtml(displayDate(examDate))}</span>${provider ? `<span><strong>Provider:</strong> ${escapeHtml(provider)}</span>` : ''}<span><strong>Appointment ID:</strong> ${escapeHtml(appointmentId || 'Not recorded')}</span></div>
    <div class="record-meta"><span><strong>Status:</strong> ${isSigned ? 'Signed' : savedAt ? 'Saved, unsigned' : 'Draft'}</span><span><strong>Last saved:</strong> ${escapeHtml(displayDate(savedAt))}</span><span><strong>Printed:</strong> ${escapeHtml(displayDate(printedAt))}</span></div>
    ${unsaved ? '<p class="draft">This printout includes unsaved edits currently displayed in the chart.</p>' : ''}</header>`;
  const summary = `<section class="overview"><div class="diagnosis"><h2>Recorded diagnosis</h2><p>${escapeHtml(displayDiagnosis(diagnosis))}</p></div><div class="summary"><h2>Chart summary</h2><table><thead><tr><th scope="col">Metric</th><th scope="col">Bleeding</th><th scope="col">Probe ≤4 mm</th><th scope="col">Probe 5 mm</th><th scope="col">Probe ≥6 mm</th><th scope="col">Recession</th></tr></thead><tbody>${summaryRows}</tbody></table></div></section>`;
  return `<!doctype html><html lang="en"><head><meta charset="utf-8" /><title>Periodontal Chart - ${escapeHtml(patientName)}</title><style>
    @page { size: A4 landscape; margin: 9mm; }
    * { box-sizing: border-box; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
    body { margin: 0; background: #fff; color: #1e293b; font: 10px/1.35 Arial, sans-serif; }
    .report-header { text-align: center; border-bottom: 2px solid #2362ef; padding-bottom: 6px; margin-bottom: 8px; break-inside: avoid; }
    .logo { display: block; height: 38px; max-width: 175px; object-fit: contain; margin: 0 auto 7px; }
    h1 { margin: 0 0 7px; font-size: 20px; line-height: 1.2; }
    .meta, .record-meta { display: flex; flex-wrap: wrap; justify-content: center; gap: 3px 14px; color: #475569; }
    .record-meta { margin-top: 4px; font-size: 9px; }
    strong { color: #1e293b; }
    .draft { display: inline-block; margin: 7px 0 0; padding: 5px 9px; border: 1px solid #fdba74; background: #fff7ed; color: #9a3412; }
    .overview { display: grid; grid-template-columns: 25% 1fr; gap: 12px; margin-bottom: 8px; break-inside: avoid; }
    h2 { margin: 0 0 5px; font-size: 12px; color: #0f172a; }
    .diagnosis, .summary { border: 1px solid #d7dde5; padding: 8px; }
    .diagnosis p { margin: 0; font-size: 11px; font-weight: 600; }
    table { width: 100%; border-collapse: collapse; table-layout: fixed; }
    th, td { border: 1px solid #d7dde5; padding: 4px 3px; text-align: center; vertical-align: middle; }
    th { background: #f1f5f9; font-weight: 700; }
    .summary th, .summary td { padding: 3px 4px; font-size: 9px; }
    .summary th:first-child { width: 16%; text-align: left; }
    .arch { break-inside: avoid; page-break-inside: avoid; }
    .lower { break-before: page; page-break-before: always; }
    .arch-header { display: flex; justify-content: space-between; align-items: baseline; margin: 0 0 5px; padding-bottom: 4px; border-bottom: 2px solid #2362ef; }
    .arch-header h2 { margin: 0; font-size: 13px; }
    .arch-header span { color: #64748b; }
    .chart { font-size: 9px; font-variant-numeric: tabular-nums; }
    .metric-col { width: 13%; }
    .chart th, .chart td { height: 21px; padding: 2px; white-space: nowrap; }
    .chart .metric { text-align: left; padding-left: 5px; white-space: normal; }
    .chart .tooth-heading { font-size: 10px; }
    .chart small { display: block; font-size: 7px; font-weight: 400; }
    .side-heading th { background: #eaf1fc; color: #1e3a5f; text-align: left; padding: 3px 6px; height: 18px; }
    .missing { background: #f8fafc; color: #64748b; }
    .legend { margin: 7px 0 0; font-size: 9px; color: #475569; }
    .page-context { display: flex; justify-content: space-between; margin-bottom: 9px; padding-bottom: 6px; border-bottom: 1px solid #d7dde5; color: #475569; font-size: 10px; }
    .report-footer { margin-top: 10px; border-top: 1px solid #d7dde5; padding-top: 5px; color: #64748b; font-size: 9px; }
  </style></head><body><main>${header}${summary}
    ${renderArch('Upper arch · maxilla', Array.from({ length: 16 }, (_, i) => i + 1), chartData, missingTeeth, 'upper')}
    ${renderArch('Lower arch · mandible', Array.from({ length: 16 }, (_, i) => 32 - i), chartData, missingTeeth, 'lower', `<span><strong>Periodontal Chart:</strong> ${escapeHtml(patientName)} · ${escapeHtml(patientCode)}</span><span><strong>Exam:</strong> ${escapeHtml(displayDate(examDate))}</span>`)}
    <footer class="report-footer">Medflow · Periodontal Chart · ${escapeHtml(patientName)} · ${escapeHtml(patientCode)}</footer>
  </main></body></html>`;
}

export function printPeriodontalChart(html) {
  return new Promise((resolve, reject) => {
    const iframe = document.createElement('iframe');
    const previousFocus = document.activeElement;
    iframe.title = 'Periodontal chart print document';
    iframe.setAttribute('aria-hidden', 'true');
    iframe.tabIndex = -1;
    Object.assign(iframe.style, { position: 'fixed', left: '-10000px', top: '0', width: '1123px', height: '794px', border: '0' });
    let cleanupTimer;
    const cleanup = () => {
      clearTimeout(loadTimer);
      clearTimeout(cleanupTimer);
      iframe.onload = null;
      if (iframe.contentWindow) iframe.contentWindow.onafterprint = null;
      iframe.remove();
      if (previousFocus?.isConnected) previousFocus.focus();
    };
    const fail = () => { cleanup(); reject(new Error('The periodontal chart could not be prepared for printing. Please try again.')); };
    const loadTimer = setTimeout(fail, 15000);
    iframe.onload = async () => {
      iframe.onload = null;
      try {
        const printWindow = iframe.contentWindow;
        const document = iframe.contentDocument;
        if (!printWindow || !document) throw new Error('Print document unavailable');
        await Promise.all(Array.from(document.images, (image) => image.decode?.()));
        if (document.fonts?.ready) await document.fonts.ready;
        if (!iframe.isConnected) return;
        clearTimeout(loadTimer);
        printWindow.onafterprint = () => { cleanup(); resolve(); };
        printWindow.focus();
        printWindow.print();
        if (iframe.isConnected) cleanupTimer = setTimeout(() => { cleanup(); resolve(); }, 120000);
      } catch { fail(); }
    };
    iframe.srcdoc = html;
    document.body.appendChild(iframe);
  });
}
