import { printLedgerReport } from './printLedgerReport';

const makeTable = (values) => {
  const table = document.createElement('table');
  table.innerHTML = '<thead><tr><th>Date</th><th>Patient</th><th>Description</th><th>Amount</th><th>Balance</th><th>User</th></tr></thead><tbody></tbody>';
  values.forEach((values) => {
    const row = table.tBodies[0].insertRow();
    values.forEach((value) => { row.insertCell().textContent = value; });
  });
  return table;
};

const prepareFrame = () => {
  const frame = document.querySelector('iframe');
  // jsdom does not load srcdoc or implement the browser's native print dialog.
  frame.contentDocument.documentElement.innerHTML = new DOMParser()
    .parseFromString(frame.srcdoc, 'text/html').documentElement.innerHTML;
  frame.contentWindow.print = jest.fn();
  frame.contentWindow.focus = jest.fn();
  return frame;
};

describe('ledger printing', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    jest.spyOn(window, 'open').mockImplementation(() => { throw new Error('Unexpected popup'); });
  });

  afterEach(() => {
    document.body.innerHTML = '';
    jest.useRealTimers();
    jest.restoreAllMocks();
  });

  it.each(['Individual', 'Family'])('preserves all displayed %s ledger values and escapes patient text', async (mode) => {
    const values = [
      ['10/13/2026', 'Pat <Example> & Family', '<img src=x onerror=alert(1)>', '$30.00', '$-469.00', 'STAFF'],
      ['09/10/2026', 'Alex Example', 'Payment - Cash', '-$349.00', '$-499.00', 'STAFF'],
    ];
    const task = printLedgerReport({
      table: makeTable(values), title: `${mode} Ledger Report`, subtitle: 'Pat <Example> & Family',
    });
    const frame = prepareFrame();
    const doc = frame.contentDocument;
    expect(doc.querySelector('h1').textContent).toBe(`${mode} Ledger Report`);
    expect(doc.querySelector('.subtitle').textContent).toBe('Pat <Example> & Family');
    expect(Array.from(doc.querySelectorAll('tbody tr'), (row) =>
      Array.from(row.cells, (cell) => cell.textContent))).toEqual(values);
    expect(doc.querySelectorAll('img')).toHaveLength(1);
    expect(doc.querySelectorAll('[onerror], script')).toHaveLength(0);
    await frame.onload();
    expect(frame.contentWindow.print).toHaveBeenCalledTimes(1);
    expect(window.open).not.toHaveBeenCalled();
    frame.contentWindow.onafterprint();
    await task;
    expect(document.querySelector('iframe')).toBeNull();
  });

  it('waits for the logo, prevents duplicate previews, and allows printing after cancellation', async () => {
    const options = { table: makeTable([['10/13/2026', 'Pat', 'Charge', '$30.00', '$30.00', 'STAFF']]), title: 'Individual Ledger Report', subtitle: 'Pat' };
    const task = printLedgerReport(options);
    expect(printLedgerReport(options)).toBe(task);
    expect(document.querySelectorAll('iframe')).toHaveLength(1);
    const frame = prepareFrame();
    let finishDecode;
    frame.contentDocument.images[0].decode = () => new Promise((resolve) => { finishDecode = resolve; });
    const loading = frame.onload();
    expect(frame.contentWindow.print).not.toHaveBeenCalled();
    finishDecode();
    await loading;
    expect(frame.contentWindow.print).toHaveBeenCalledTimes(1);
    jest.advanceTimersByTime(120000);
    expect(frame.isConnected).toBe(true);
    // afterprint fires for both printing and cancelling in the supported browser.
    frame.contentWindow.onafterprint();
    await task;

    const retry = printLedgerReport(options);
    const nextFrame = prepareFrame();
    await nextFrame.onload();
    nextFrame.contentWindow.onafterprint();
    await retry;
    expect(document.querySelector('iframe')).toBeNull();
  });

  it('cleans up a failed document load and permits a retry', async () => {
    const options = { table: makeTable([['', 'Pat', '', '$0.00', '$0.00', 'STAFF']]), title: 'Family Ledger Report', subtitle: 'Family' };
    const failed = printLedgerReport(options);
    const failure = expect(failed).rejects.toThrow('could not be prepared');
    jest.advanceTimersByTime(15000);
    await failure;
    expect(document.querySelector('iframe')).toBeNull();
    const retry = printLedgerReport(options);
    const frame = prepareFrame();
    await frame.onload();
    frame.contentWindow.onafterprint();
    await retry;
  });

  it('rejects an empty ledger without opening a print frame', async () => {
    await expect(printLedgerReport({ table: makeTable([]), title: 'Individual Ledger Report' }))
      .rejects.toThrow('No ledger transactions');
    expect(document.querySelector('iframe')).toBeNull();
  });
});
