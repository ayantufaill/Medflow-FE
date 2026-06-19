/**
 * Formats raw periodontal examData into clean, clinically meaningful HTML
 * for use in generated exam notes.
 *
 * Instead of dumping all 32 teeth × 2 sides × 7 fields as a raw wall of text,
 * this produces a categorised summary showing only abnormal / notable findings.
 *
 * @param {Object} examData - The periodontal exam data (contains chartData and settings)
 * @returns {string} HTML string ready to inject into the notes editor
 */
export function formatPeriodontalNotes(examData) {
  const chartData = examData?.chartData;
  if (!chartData) return '';

  let html = '<p style="margin:8px 0 4px 0"><strong>Periodontal</strong><br><br>';

  // ── 1. Collect summary lists ──────────────────────────────────────────
  const bleedingTeeth = new Set();
  const mobilityTeeth = {};    // tooth → mobility value
  const furcationTeeth = {};   // tooth → furcation value
  const recessionTeeth = new Set();

  // ── 2. Collect detail rows ────────────────────────────────────────────
  const probingRows = [];
  const recessionRows = [];
  const attachmentRows = [];

  for (let t = 1; t <= 32; t++) {
    const tooth = chartData[t];
    if (!tooth) continue;

    // Skip missing teeth (both sides have empty probing values)
    const isMissing = ['facial', 'lingual'].every((side) => {
      const s = tooth[side];
      return !s?.probe || s.probe.every((v) => !v || v === '');
    });
    if (isMissing) continue;

    // ── Summarise each side ──
    for (const side of ['facial', 'lingual']) {
      const s = tooth[side];
      if (!s) continue;

      if (Array.isArray(s.bleeding) && s.bleeding.length > 0) {
        bleedingTeeth.add(t);
      }
      if (s.mobility && s.mobility !== 'none' && s.mobility !== '0') {
        mobilityTeeth[t] = s.mobility;
      }
      if (s.furcation && s.furcation !== 'none' && s.furcation !== '0') {
        furcationTeeth[t] = s.furcation;
      }
      if (Array.isArray(s.recession) && s.recession.some((v) => parseInt(v) > 0)) {
        recessionTeeth.add(t);
      }
    }

    // ── Probing detail (any site ≥ 4 mm) ──
    const facialProbe = tooth.facial?.probe || [];
    const lingualProbe = tooth.lingual?.probe || [];
    if ([...facialProbe, ...lingualProbe].some((v) => parseInt(v) >= 4)) {
      probingRows.push({ tooth: t, facial: facialProbe, lingual: lingualProbe });
    }

    // ── Recession detail (any value > 0) ──
    const facialRec = tooth.facial?.recession || [];
    const lingualRec = tooth.lingual?.recession || [];
    if ([...facialRec, ...lingualRec].some((v) => parseInt(v) > 0)) {
      recessionRows.push({ tooth: t, facial: facialRec, lingual: lingualRec });
    }

    // ── Attachment loss detail (any site ≥ 4 mm) ──
    const facialAtt = tooth.facial?.attachment || [];
    const lingualAtt = tooth.lingual?.attachment || [];
    if ([...facialAtt, ...lingualAtt].some((v) => parseInt(v) >= 4)) {
      attachmentRows.push({ tooth: t, facial: facialAtt, lingual: lingualAtt });
    }
  }

  // ── 3. Render Summary ─────────────────────────────────────────────────
  const formatToothList = (items) => {
    const arr = Array.isArray(items) ? items : [...items];
    const sorted = arr.sort((a, b) => a - b);
    return sorted.length > 0 ? sorted.map((t) => '#' + t).join(', ') : 'None';
  };

  html += '<strong>Summary:</strong><br>';
  html += `• Teeth with bleeding: ${formatToothList(bleedingTeeth)}<br>`;

  // Mobility — show tooth + grade
  const mobilityEntries = Object.entries(mobilityTeeth).sort(([a], [b]) => a - b);
  if (mobilityEntries.length > 0) {
    const mobilityStr = mobilityEntries.map(([t, val]) => `#${t} (Grade ${val})`).join(', ');
    html += `• Teeth with mobility: ${mobilityStr}<br>`;
  } else {
    html += '• Teeth with mobility: None<br>';
  }

  // Furcation — show tooth + class
  const furcationEntries = Object.entries(furcationTeeth).sort(([a], [b]) => a - b);
  if (furcationEntries.length > 0) {
    const furcationStr = furcationEntries.map(([t, val]) => `#${t} (Class ${val})`).join(', ');
    html += `• Teeth with furcation involvement: ${furcationStr}<br>`;
  } else {
    html += '• Teeth with furcation involvement: None<br>';
  }

  html += `• Teeth with recession: ${formatToothList(recessionTeeth)}<br><br>`;

  // ── 4. Render Detail Sections ─────────────────────────────────────────
  const formatSites = (vals) =>
    (vals || []).map((v) => (v && v !== '' ? v : '0')).join(', ');

  if (probingRows.length > 0) {
    html += '<strong>Probing Depths (sites ≥ 4mm):</strong><br>';
    probingRows.forEach((r) => {
      html += `• Tooth #${r.tooth} — Facial: ${formatSites(r.facial)} | Lingual: ${formatSites(r.lingual)}<br>`;
    });
    html += '<br>';
  }

  if (recessionRows.length > 0) {
    html += '<strong>Recession (sites &gt; 0):</strong><br>';
    recessionRows.forEach((r) => {
      html += `• Tooth #${r.tooth} — Facial: ${formatSites(r.facial)} | Lingual: ${formatSites(r.lingual)}<br>`;
    });
    html += '<br>';
  }

  if (attachmentRows.length > 0) {
    html += '<strong>Attachment Loss (sites ≥ 4mm):</strong><br>';
    attachmentRows.forEach((r) => {
      html += `• Tooth #${r.tooth} — Facial: ${formatSites(r.facial)} | Lingual: ${formatSites(r.lingual)}<br>`;
    });
  }

  html += '</p>';
  return html;
}
