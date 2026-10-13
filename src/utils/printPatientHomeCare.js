import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import HomeCarePrintReport from '../components/patient-reports/HomeCarePrintReport';

export function printPatientHomeCare(data) {
  const html = '<!doctype html>' + renderToStaticMarkup(createElement(HomeCarePrintReport, {
    ...data,
    baseUrl: window.location.origin,
    printedAt: new Date(),
  }));

  return new Promise((resolve, reject) => {
    const iframe = document.createElement('iframe');
    iframe.title = 'Patient home care print document';
    iframe.setAttribute('aria-hidden', 'true');
    Object.assign(iframe.style, {
      position: 'fixed',
      left: '-10000px',
      top: '0',
      width: '794px',
      height: '1123px',
      border: '0',
    });

    let cleanupTimer;
    const cleanup = () => {
      clearTimeout(loadTimer);
      clearTimeout(cleanupTimer);
      iframe.onload = null;
      iframe.remove();
    };

    const fail = (message) => {
      cleanup();
      reject(new Error(message));
    };

    const loadTimer = setTimeout(
      () => fail('The report images could not finish loading. Please try printing again.'),
      15000
    );

    iframe.onload = async () => {
      try {
        const frameWindow = iframe.contentWindow;
        const doc = iframe.contentDocument;
        if (!frameWindow || !doc) throw new Error('The print document could not be opened.');

        await Promise.all(Array.from(doc.images, (img) => img.decode()));
        if (doc.fonts?.ready) await doc.fonts.ready;
        if (!iframe.isConnected) return;

        clearTimeout(loadTimer);
        frameWindow.onafterprint = cleanup;
        frameWindow.focus();
        frameWindow.print();

        // Some browsers omit afterprint. Retain the document while their preview opens.
        if (iframe.isConnected) cleanupTimer = setTimeout(cleanup, 120000);
        resolve();
      } catch {
        fail('The report could not be prepared for printing. Please check that its images have loaded and try again.');
      }
    };

    iframe.srcdoc = html;
    document.body.appendChild(iframe);
  });
}
