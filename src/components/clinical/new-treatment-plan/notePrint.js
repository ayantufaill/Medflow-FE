const escapeHtml = (value) => String(value ?? '').replace(/[&<>"']/g, (character) => ({
  '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
}[character]));

const label = (key) => String(key)
  .replace(/([a-z0-9])([A-Z])/g, '$1 $2')
  .replace(/[_-]/g, ' ')
  .replace(/\b\w/g, (letter) => letter.toUpperCase());

const excluded = new Set(['formType', 'schemaVersion', 'templateName', 'isBlankNote', 'htmlContent']);

export const noteFields = (note, source) => {
  if (source === 'general') return [
    ['Note', note.description],
    ['Procedures', Array.isArray(note.procedures) ? note.procedures.join(', ') : note.procedures],
    ['Tags', Array.isArray(note.tags) ? note.tags.join(', ') : note.tags],
  ].filter(([, value]) => value != null && value !== '' && (!Array.isArray(value) || value.length));
  const fields = [];
  const add = (name, value) => {
    if (value == null || value === '' || (Array.isArray(value) && !value.length)) return;
    if (Array.isArray(value)) {
      if (value.every((item) => typeof item !== 'object' || item == null)) fields.push([name, value.join(', ')]);
      else value.forEach((item, index) => add(`${name} ${index + 1}`, item));
    } else if (typeof value === 'object') {
      if ('label' in value && 'value' in value) add(value.label || name, value.value);
      else Object.entries(value).forEach(([key, child]) => {
        if (!excluded.has(key)) add(key === 'content' ? 'Content' : label(key), child);
      });
    } else fields.push([name, String(value)]);
  };
  ['chiefComplaint', 'subjective', 'objective', 'assessment', 'plan', 'content', 'historyOfPresentIllness', 'physicalExam', 'diagnosisCodes', 'requiresFollowUp', 'followUpDate'].forEach((key) => add(label(key), note[key]));
  add('Note Details', note.structuredData);
  return fields;
};

export function createNotePrintHtml({ note, source, patientName, title, providerName }) {
  const date = note.updatedAt || note.date || note.createdAt;
  const status = note.isArchived ? 'Archived' : (note.isSigned || note.status === 'signed') ? 'Completed' : source === 'general' ? 'Saved' : 'Draft';
  const type = source === 'general' ? 'General Note' : note.structuredData?.templateName || (note.structuredData?.isBlankNote ? 'Blank Note' : 'Clinical Note');
  const fields = noteFields(note, source);
  const sections = fields.map(([name, value]) => `<section><h2>${escapeHtml(name)}</h2><p>${escapeHtml(value)}</p></section>`).join('');
  return `<!doctype html><html lang="en"><head><meta charset="utf-8"><title>${escapeHtml(title || 'Note')}</title>
    <style>@page{size:A4 portrait;margin:15mm}body{font:12px/1.5 Arial,sans-serif;color:#1e293b;margin:0}header{border-bottom:2px solid #2563eb;padding-bottom:12px;margin-bottom:18px}h1{font-size:22px;margin:0 0 10px}h2{font-size:12px;margin:0 0 4px;color:#334155}p{margin:0;white-space:pre-wrap;overflow-wrap:anywhere}section{padding:10px 0;border-bottom:1px solid #dbe3ef;break-inside:avoid}.meta{display:grid;grid-template-columns:1fr 1fr;gap:5px 20px}</style>
    </head><body><header><h1>${escapeHtml(title || 'Note')}</h1><div class="meta"><span>Patient: ${escapeHtml(patientName)}</span><span>Type: ${escapeHtml(type)}</span><span>Provider: ${escapeHtml(providerName || 'Unknown')}</span><span>Status: ${escapeHtml(status)}</span><span>Date: ${escapeHtml(date ? new Date(date).toLocaleString() : 'Unavailable')}</span>${note.signedAt ? `<span>Signed: ${escapeHtml(new Date(note.signedAt).toLocaleString())}</span>` : ''}</div></header>${sections}</body></html>`;
}

export function printNote(args) {
  const html = createNotePrintHtml(args);
  return new Promise((resolve, reject) => {
    const iframe = document.createElement('iframe');
    const previousFocus = document.activeElement;
    iframe.title = 'Note print document';
    iframe.setAttribute('aria-hidden', 'true');
    iframe.tabIndex = -1;
    Object.assign(iframe.style, { position: 'fixed', left: '-10000px', width: '794px', height: '1123px', border: '0' });
    let cleanupTimer;
    const cleanup = () => {
      clearTimeout(loadTimer);
      clearTimeout(cleanupTimer);
      iframe.onload = null;
      if (iframe.contentWindow) iframe.contentWindow.onafterprint = null;
      const printFrameHasFocus = document.activeElement === iframe;
      iframe.remove();
      if (printFrameHasFocus && previousFocus?.isConnected) previousFocus.focus();
    };
    const fail = (error) => { cleanup(); reject(error); };
    const loadTimer = setTimeout(() => fail(new Error('Print document could not be prepared.')), 15000);
    iframe.onload = () => {
      iframe.onload = null;
      try {
        const frameWindow = iframe.contentWindow;
        if (!frameWindow) throw new Error('Print document unavailable');
        clearTimeout(loadTimer);
        frameWindow.onafterprint = cleanup;
        frameWindow.focus();
        frameWindow.print();
        // Cancel may close the dialog without firing afterprint on the iframe.
        // print() returns when the dialog closes in blocking browsers, so the
        // drawer must not wait for that event to clear its loading state.
        if (iframe.isConnected) cleanupTimer = setTimeout(cleanup, 120000);
        resolve();
      } catch (error) { fail(error); }
    };
    iframe.srcdoc = html;
    document.body.appendChild(iframe);
  });
}
