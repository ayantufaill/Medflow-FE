import medflowLogo from '../assets/medflow-logo.png';

const escapeHtml = (value) => String(value ?? '').replace(/[&<>"']/g, (character) => ({
  '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
}[character]));

let activePrint = null;

// Snapshot displayed values so printing never recalculates financial data or
// depends on MUI's screen-only styles in the separate print document.
export function printLedgerReport({ table, title, subtitle }) {
  if (activePrint) return activePrint;
  const rows = Array.from(table?.querySelectorAll('tbody tr') ?? []);
  if (!rows.length) return Promise.reject(new Error('No ledger transactions are available to print.'));

  const headings = Array.from(table.querySelectorAll('thead th'), (cell) =>
    `<th scope="col">${escapeHtml(cell.textContent)}</th>`).join('');
  const body = rows.map((row) => `<tr>${Array.from(row.cells, (cell) =>
    `<td>${escapeHtml(cell.textContent)}</td>`).join('')}</tr>`).join('');
  const logoUrl = new URL(medflowLogo, document.baseURI).href;
  const html = `<!doctype html>
    <html lang="en">
      <head>
        <meta charset="utf-8" />
        <title>${escapeHtml(title)} - ${escapeHtml(subtitle)}</title>
        <style>
          @page { size: A4 portrait; margin: 12mm; }
          * { box-sizing: border-box; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
          body { margin: 0; font-family: Arial, sans-serif; font-size: 12px; color: #1e293b; background: #fff; }
          header { text-align: center; margin-bottom: 24px; break-inside: avoid; break-after: avoid; }
          .logo { height: 45px; max-width: 100%; object-fit: contain; margin-bottom: 16px; }
          h1 { font-size: 22px; line-height: 1.3; margin: 0 0 8px; }
          .subtitle { margin: 0; font-size: 13px; overflow-wrap: anywhere; }
          /* Keep edge borders inside the table width so print clipping cannot cut them off. */
          table { width: 100%; table-layout: fixed; border-collapse: separate; border-spacing: 0; font-size: 12px; line-height: 1.45; }
          th, td { border: 0; border-right: 1px solid #d7dde5; border-bottom: 1px solid #d7dde5; padding: 8px 7px; text-align: left; vertical-align: top; overflow-wrap: anywhere; }
          th:first-child, td:first-child { border-left: 1px solid #d7dde5; }
          thead th { border-top: 1px solid #d7dde5; }
          th { background: #f8f9fa; font-weight: 700; }
          th:nth-child(4), th:nth-child(5), td:nth-child(4), td:nth-child(5) { text-align: right; font-variant-numeric: tabular-nums; }
          td:nth-child(5) { font-weight: 700; }
          thead { display: table-header-group; }
          tr { break-inside: avoid; page-break-inside: avoid; }
        </style>
      </head>
      <body>
        <header>
          <img class="logo" src="${escapeHtml(logoUrl)}" alt="Medflow Logo" />
          <h1>${escapeHtml(title)}</h1>
          <p class="subtitle">${escapeHtml(subtitle)}</p>
        </header>
        <table>
          <colgroup><col style="width: 14%" /><col style="width: 18%" /><col style="width: 32%" /><col style="width: 13%" /><col style="width: 13%" /><col style="width: 10%" /></colgroup>
          <thead><tr>${headings}</tr></thead>
          <tbody>${body}</tbody>
        </table>
      </body>
    </html>`;

  activePrint = new Promise((resolve, reject) => {
    const iframe = document.createElement('iframe');
    const previousFocus = document.activeElement;
    iframe.title = 'Ledger print document';
    iframe.setAttribute('aria-hidden', 'true');
    iframe.tabIndex = -1;
    Object.assign(iframe.style, {
      position: 'fixed', left: '-10000px', top: '0',
      width: '794px', height: '1123px', border: '0',
    });

    const cleanup = () => {
      clearTimeout(loadTimer);
      iframe.onload = null;
      if (iframe.contentWindow) iframe.contentWindow.onafterprint = null;
      iframe.remove();
      if (previousFocus?.isConnected) previousFocus.focus();
    };
    const fail = () => {
      cleanup();
      reject(new Error('The ledger could not be prepared for printing. Please try again.'));
    };
    const loadTimer = setTimeout(fail, 15000);

    iframe.onload = async () => {
      // Ignore duplicate load events while images/fonts are being prepared.
      iframe.onload = null;
      try {
        const frameWindow = iframe.contentWindow;
        const doc = iframe.contentDocument;
        if (!frameWindow || !doc) throw new Error('Print document unavailable');
        await Promise.all(Array.from(doc.images, (img) => img.decode?.()));
        if (doc.fonts?.ready) await doc.fonts.ready;
        if (!iframe.isConnected) return;
        clearTimeout(loadTimer);

        // Do not remove the document on a timer: the user may keep preview open.
        frameWindow.onafterprint = () => {
          cleanup();
          resolve();
        };
        frameWindow.focus();
        frameWindow.print();
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
