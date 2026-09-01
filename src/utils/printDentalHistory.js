/**
 * Generates a print-ready HTML document from dental history Redux state.
 * Injects content into the current page and triggers window.print() — no new tabs, no API calls.
 */
export function printDentalHistoryFromData(dentalHistory, patient, returnHtmlOnly = false) {
  const patientName = patient
    ? `${patient.firstName || ''} ${patient.lastName || ''}`.trim()
    : 'Patient';

  const dob = patient?.dateOfBirth
    ? new Date(patient.dateOfBirth).toLocaleDateString()
    : '';

  const generalInfo = dentalHistory?.generalInfo || {};
  const review = dentalHistory?.review || {};

  const reviewedDate = review?.reviewedAt
    ? new Date(review.reviewedAt).toLocaleDateString()
    : '';

  const yesNoColor = (answer) => {
    const a = (answer || '').toString().toLowerCase().trim();
    if (a === 'yes') return '#d32f2f';
    if (a === 'no') return '#388e3c';
    return '#555';
  };

  const renderSection = (title, rows = []) => {
    if (!rows || rows.length === 0) return '';
    const grouped = {};
    rows.forEach(item => {
      const key = item?.group || 'General';
      if (!grouped[key]) grouped[key] = [];
      grouped[key].push(item);
    });

    const groupHtml = Object.entries(grouped).map(([groupName, items]) => {
      const rowsHtml = items.map(item => {
        const answer = item.answer || 'Not Answered';
        const notes = Array.isArray(item.additionalInfo)
          ? item.additionalInfo.filter(Boolean).join(', ')
          : item.additionalInfo || '';
        return `
          <tr>
            <td style="padding:6px 10px; border-bottom:1px solid #eee; font-size:12px;">${item.question || item.name || ''}</td>
            <td style="padding:6px 10px; border-bottom:1px solid #eee; font-size:12px; font-weight:600; color:${yesNoColor(answer)}">${answer}</td>
            <td style="padding:6px 10px; border-bottom:1px solid #eee; font-size:12px; color:#555;">${notes}</td>
          </tr>`;
      }).join('');

      const groupHeader = groupName !== 'General' ? `<tr><td colspan="3" style="padding:5px 10px 2px; font-size:11px; font-weight:700; color:#64748b; text-transform:uppercase; letter-spacing:0.4px; background:#f8fafc;">${groupName}</td></tr>` : '';
      return groupHeader + rowsHtml;
    }).join('');

    return `
      <h2 style="font-size:13px; font-weight:700; text-transform:uppercase; letter-spacing:0.5px; border-bottom:2px solid #3B5998; padding-bottom:4px; margin:16px 0 6px;">${title}</h2>
      <table style="width:100%; border-collapse:collapse; margin-bottom:12px;">
        <thead><tr>
          <th style="background:#f1f5f9; padding:7px 10px; text-align:left; font-size:11px; font-weight:600; color:#475569; text-transform:uppercase;">Question</th>
          <th style="background:#f1f5f9; padding:7px 10px; text-align:left; font-size:11px; font-weight:600; color:#475569; text-transform:uppercase;">Answer</th>
          <th style="background:#f1f5f9; padding:7px 10px; text-align:left; font-size:11px; font-weight:600; color:#475569; text-transform:uppercase;">Notes</th>
        </tr></thead>
        <tbody>${groupHtml}</tbody>
      </table>`;
  };

  const generalRows = Object.entries(generalInfo)
    .filter(([, v]) => v !== null && v !== undefined && v !== '')
    .map(([k, v]) => {
      const label = k.replace(/([A-Z])/g, ' $1').replace(/^./, s => s.toUpperCase());
      const val = typeof v === 'boolean' ? (v ? 'Yes' : 'No') : v;
      return `<tr>
        <td style="padding:5px 10px; border-bottom:1px solid #eee; font-size:12px; color:#555;">${label}</td>
        <td style="padding:5px 10px; border-bottom:1px solid #eee; font-size:12px; font-weight:500;">${val}</td>
      </tr>`;
    }).join('');

  const innerHtml = `
    <div style="font-family:Arial,sans-serif; color:#1e293b; padding:24px;">
      <div style="display:flex; justify-content:space-between; align-items:flex-start; border-bottom:2px solid #3B5998; padding-bottom:12px; margin-bottom:16px;">
        <div>
          <h1 style="font-size:18px; font-weight:700; margin:0 0 6px;">Dental History</h1>
          <span style="display:inline-block; background:#eff6ff; color:#1d4ed8; padding:3px 10px; border-radius:12px; font-size:11px; font-weight:600; margin-right:6px;">${patientName}</span>
          ${dob ? `<span style="display:inline-block; background:#eff6ff; color:#1d4ed8; padding:3px 10px; border-radius:12px; font-size:11px; font-weight:600; margin-right:6px;">DOB: ${dob}</span>` : ''}
          ${reviewedDate ? `<span style="display:inline-block; background:#eff6ff; color:#1d4ed8; padding:3px 10px; border-radius:12px; font-size:11px; font-weight:600;">Reviewed: ${reviewedDate}</span>` : ''}
        </div>
        <div style="font-size:11px; color:#64748b;">Printed: ${new Date().toLocaleString()}</div>
      </div>

      ${generalRows ? `
      <h2 style="font-size:13px; font-weight:700; text-transform:uppercase; letter-spacing:0.5px; border-bottom:2px solid #3B5998; padding-bottom:4px; margin:0 0 6px;">General Information</h2>
      <table style="width:100%; border-collapse:collapse; margin-bottom:12px;">
        <thead><tr>
          <th style="background:#f1f5f9; padding:7px 10px; text-align:left; font-size:11px; font-weight:600; color:#475569; text-transform:uppercase;">Field</th>
          <th style="background:#f1f5f9; padding:7px 10px; text-align:left; font-size:11px; font-weight:600; color:#475569; text-transform:uppercase;">Value</th>
        </tr></thead>
        <tbody>${generalRows}</tbody>
      </table>` : ''}

      ${renderSection('Personal History', dentalHistory?.personalHistory)}
      ${renderSection('Gum & Bone', dentalHistory?.gumAndBone)}
      ${renderSection('Bite & Jaw Joint', dentalHistory?.biteAndJawJoint)}
      ${renderSection('Tooth Structure', dentalHistory?.toothStructure)}
      ${renderSection('Smile Characteristics', dentalHistory?.smileCharacteristics)}

      ${review?.signatureDataUrl ? `
      <h2 style="font-size:13px; font-weight:700; text-transform:uppercase; letter-spacing:0.5px; border-bottom:2px solid #3B5998; padding-bottom:4px; margin:16px 0 6px;">Patient Signature</h2>
      <img src="${review.signatureDataUrl}" style="max-height:60px; border:1px solid #e2e8f0; border-radius:4px; margin-top:4px;"/>` : ''}
    </div>`;

  if (returnHtmlOnly) {
    return innerHtml;
  }

  const styleId = '__dental-history-print-style__';
  const divId = '__dental-history-print-div__';

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

  const cleanup = () => {
    document.getElementById(styleId)?.remove();
    document.getElementById(divId)?.remove();
    window.removeEventListener('afterprint', cleanup);
  };
  window.addEventListener('afterprint', cleanup);
}
