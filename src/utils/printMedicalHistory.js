/**
 * Generates a print-ready HTML document from medical history Redux state.
 * Opens a popup window and triggers print instantly — no page navigation or API calls.
 */
export function printMedicalHistoryFromData(medicalHistory, patient, returnHtmlOnly = false) {
  const patientName = patient
    ? `${patient.firstName || ''} ${patient.lastName || ''}`.trim()
    : 'Patient';

  const dob = patient?.dateOfBirth
    ? new Date(patient.dateOfBirth).toLocaleDateString()
    : '';

  const generalInfo = medicalHistory?.generalInfo || {};
  const sections = Array.isArray(medicalHistory?.sections) ? medicalHistory.sections : [];
  const medications = Array.isArray(medicalHistory?.medications) ? medicalHistory.medications : [];
  const supplements = Array.isArray(medicalHistory?.supplements) ? medicalHistory.supplements : [];
  const premed = medicalHistory?.premed || {};
  const review = medicalHistory?.review || {};

  const yesNoColor = (answer) => {
    const a = (answer || '').toString().toLowerCase().trim();
    if (a === 'yes') return '#d32f2f';
    if (a === 'no') return '#388e3c';
    return '#555';
  };

  const sectionRows = sections.map(section => {
    const answer = section.answer || 'Not Answered';
    const additionalInfo = Array.isArray(section.additionalInfo)
      ? section.additionalInfo.filter(Boolean).join(', ')
      : section.additionalInfo || '';
    return `
      <tr>
        <td style="padding:6px 10px; border-bottom:1px solid #eee; font-size:12px;">${section.question || section.name || ''}</td>
        <td style="padding:6px 10px; border-bottom:1px solid #eee; font-size:12px; font-weight:600; color:${yesNoColor(answer)}">${answer}</td>
        <td style="padding:6px 10px; border-bottom:1px solid #eee; font-size:12px; color:#555;">${additionalInfo}</td>
      </tr>`;
  }).join('');

  const medRows = medications.map(m => `
    <tr>
      <td style="padding:5px 10px; border-bottom:1px solid #eee; font-size:12px;">${m.drug || ''}</td>
      <td style="padding:5px 10px; border-bottom:1px solid #eee; font-size:12px;">${m.dosage || ''}</td>
      <td style="padding:5px 10px; border-bottom:1px solid #eee; font-size:12px;">${m.purpose || ''}</td>
    </tr>`).join('');

  const suppRows = supplements.map(s => `
    <tr>
      <td style="padding:5px 10px; border-bottom:1px solid #eee; font-size:12px;">${s.name || ''}</td>
      <td style="padding:5px 10px; border-bottom:1px solid #eee; font-size:12px;">${s.dosage || ''}</td>
    </tr>`).join('');

  const generalRows = Object.entries(generalInfo)
    .filter(([, v]) => v !== null && v !== undefined && v !== '')
    .map(([k, v]) => `
      <tr>
        <td style="padding:5px 10px; border-bottom:1px solid #eee; font-size:12px; color:#555; text-transform:capitalize;">${k.replace(/([A-Z])/g, ' $1')}</td>
        <td style="padding:5px 10px; border-bottom:1px solid #eee; font-size:12px; font-weight:500;">${v}</td>
      </tr>`).join('');

  const reviewedDate = review?.reviewedAt
    ? new Date(review.reviewedAt).toLocaleDateString()
    : '';

  const innerHtml = `
    <div style="font-family:Arial,sans-serif; color:#1e293b; padding:24px;">
      <div style="display:flex; justify-content:space-between; align-items:flex-start; border-bottom:2px solid #3B5998; padding-bottom:12px; margin-bottom:16px;">
        <div>
          <h1 style="font-size:18px; font-weight:700; margin:0 0 6px;">Medical History</h1>
          <span style="display:inline-block; background:#eff6ff; color:#1d4ed8; padding:3px 10px; border-radius:12px; font-size:11px; font-weight:600; margin-right:6px;">${patientName}</span>
          ${dob ? `<span style="display:inline-block; background:#eff6ff; color:#1d4ed8; padding:3px 10px; border-radius:12px; font-size:11px; font-weight:600; margin-right:6px;">DOB: ${dob}</span>` : ''}
          ${reviewedDate ? `<span style="display:inline-block; background:#eff6ff; color:#1d4ed8; padding:3px 10px; border-radius:12px; font-size:11px; font-weight:600;">Reviewed: ${reviewedDate}</span>` : ''}
        </div>
        <div style="font-size:11px; color:#64748b;">Printed: ${new Date().toLocaleString()}</div>
      </div>

      ${premed?.requiresPremed ? `<div style="background:#fff3e0; border:1px solid #fb8c00; border-radius:6px; padding:8px 12px; font-size:12px; color:#e65100; margin-bottom:12px; font-weight:600;">⚠ This patient requires pre-medication${premed.premedDetails ? ': ' + premed.premedDetails : ''}.</div>` : ''}

      ${generalInfo && Object.keys(generalInfo).length > 0 ? `
      <h2 style="font-size:13px; font-weight:700; text-transform:uppercase; letter-spacing:0.5px; border-bottom:2px solid #3B5998; padding-bottom:4px; margin:16px 0 6px;">General Information</h2>
      <table style="width:100%; border-collapse:collapse; margin-bottom:12px;">
        <thead><tr><th style="background:#f1f5f9; padding:7px 10px; text-align:left; font-size:11px; font-weight:600; color:#475569; text-transform:uppercase;">Field</th><th style="background:#f1f5f9; padding:7px 10px; text-align:left; font-size:11px; font-weight:600; color:#475569; text-transform:uppercase;">Value</th></tr></thead>
        <tbody>${generalRows}</tbody>
      </table>` : ''}

      ${sections.length > 0 ? `
      <h2 style="font-size:13px; font-weight:700; text-transform:uppercase; letter-spacing:0.5px; border-bottom:2px solid #3B5998; padding-bottom:4px; margin:16px 0 6px;">Medical Conditions</h2>
      <table style="width:100%; border-collapse:collapse; margin-bottom:12px;">
        <thead><tr>
          <th style="background:#f1f5f9; padding:7px 10px; text-align:left; font-size:11px; font-weight:600; color:#475569; text-transform:uppercase;">Condition / Question</th>
          <th style="background:#f1f5f9; padding:7px 10px; text-align:left; font-size:11px; font-weight:600; color:#475569; text-transform:uppercase;">Answer</th>
          <th style="background:#f1f5f9; padding:7px 10px; text-align:left; font-size:11px; font-weight:600; color:#475569; text-transform:uppercase;">Notes</th>
        </tr></thead>
        <tbody>${sectionRows}</tbody>
      </table>` : ''}

      ${medications.length > 0 ? `
      <h2 style="font-size:13px; font-weight:700; text-transform:uppercase; letter-spacing:0.5px; border-bottom:2px solid #3B5998; padding-bottom:4px; margin:16px 0 6px;">Medications</h2>
      <table style="width:100%; border-collapse:collapse; margin-bottom:12px;">
        <thead><tr>
          <th style="background:#f1f5f9; padding:7px 10px; text-align:left; font-size:11px; font-weight:600; color:#475569; text-transform:uppercase;">Drug</th>
          <th style="background:#f1f5f9; padding:7px 10px; text-align:left; font-size:11px; font-weight:600; color:#475569; text-transform:uppercase;">Dosage</th>
          <th style="background:#f1f5f9; padding:7px 10px; text-align:left; font-size:11px; font-weight:600; color:#475569; text-transform:uppercase;">Purpose</th>
        </tr></thead>
        <tbody>${medRows}</tbody>
      </table>` : ''}

      ${supplements.length > 0 ? `
      <h2 style="font-size:13px; font-weight:700; text-transform:uppercase; letter-spacing:0.5px; border-bottom:2px solid #3B5998; padding-bottom:4px; margin:16px 0 6px;">Supplements / Vitamins</h2>
      <table style="width:100%; border-collapse:collapse; margin-bottom:12px;">
        <thead><tr>
          <th style="background:#f1f5f9; padding:7px 10px; text-align:left; font-size:11px; font-weight:600; color:#475569; text-transform:uppercase;">Name</th>
          <th style="background:#f1f5f9; padding:7px 10px; text-align:left; font-size:11px; font-weight:600; color:#475569; text-transform:uppercase;">Dosage</th>
        </tr></thead>
        <tbody>${suppRows}</tbody>
      </table>` : ''}

      ${review?.signatureDataUrl ? `
      <h2 style="font-size:13px; font-weight:700; text-transform:uppercase; letter-spacing:0.5px; border-bottom:2px solid #3B5998; padding-bottom:4px; margin:16px 0 6px;">Patient Signature</h2>
      <img src="${review.signatureDataUrl}" style="max-height:60px; border:1px solid #e2e8f0; border-radius:4px; margin-top:4px;"/>` : ''}
    </div>`;

  if (returnHtmlOnly) {
    return innerHtml;
  }

  // Inject a print-only overlay into the current page — no new tab or window
  const styleId = '__med-history-print-style__';
  const divId = '__med-history-print-div__';

  // Remove any leftover from previous prints
  document.getElementById(styleId)?.remove();
  document.getElementById(divId)?.remove();

  const style = document.createElement('style');
  style.id = styleId;
  style.textContent = `
    @media print {
      body > *:not(#${divId}) { display: none !important; }
      #${divId} { display: block !important; position: static !important; }
    }
  `;
  document.head.appendChild(style);

  const div = document.createElement('div');
  div.id = divId;
  div.style.cssText = 'display:none; position:absolute; top:0; left:0; width:100%; background:white; z-index:999999; min-height:100%;';
  div.innerHTML = innerHtml;
  document.body.appendChild(div);

  window.print();

  // Cleanup after print dialog closes
  const cleanup = () => {
    document.getElementById(styleId)?.remove();
    document.getElementById(divId)?.remove();
    window.removeEventListener('afterprint', cleanup);
  };
  window.addEventListener('afterprint', cleanup);
}

