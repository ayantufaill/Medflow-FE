import { createNotePrintHtml, noteFields, printNote } from './notePrint';

it('keeps all saved emergency and hygiene fields for printing', () => {
  const emergency = noteFields({ structuredData: { formType: 'emergencyTrauma', emergencyTrauma: {
    chiefComplaint: 'Tooth injury', diagnosis: 'Fracture', treatmentPlan: 'Restore tooth',
  } } }, 'clinical');
  expect(emergency).toEqual(expect.arrayContaining([
    ['Chief Complaint', 'Tooth injury'], ['Diagnosis', 'Fracture'], ['Treatment Plan', 'Restore tooth'],
  ]));
  const hygiene = noteFields({ structuredData: { formType: 'hygiene', hygiene: {
    exam: 'Exam findings', prevention: 'Fluoride', treatmentNotes: 'Scaling',
  } } }, 'clinical');
  expect(hygiene).toEqual(expect.arrayContaining([
    ['Exam', 'Exam findings'], ['Prevention', 'Fluoride'], ['Treatment Notes', 'Scaling'],
  ]));
});

it('prints the saved content and escapes note text', () => {
  const html = createNotePrintHtml({
    note: { description: '<script>alert(1)</script>', tags: ['Recall'], patientId: '42', date: '2026-10-20T10:00:00Z' },
    source: 'general', patientName: 'Test Patient', title: 'Visit note', providerName: 'Dr. Test',
  });
  expect(html).toContain('Test Patient');
  expect(html).toContain('Visit note');
  expect(html).toContain('&lt;script&gt;alert(1)&lt;/script&gt;');
  expect(html).not.toContain('<script>alert(1)</script>');
});

it('keeps the print document available while preview opens and finishes without afterprint', async () => {
  jest.useFakeTimers();
  try {
    const printTask = printNote({
      note: { description: 'Follow up' }, source: 'general',
      patientName: 'Test Patient', title: 'Visit note', providerName: 'Dr. Test',
    });
    const iframe = document.querySelector('iframe[title="Note print document"]');
    expect(iframe).not.toBeNull();
    iframe.contentWindow.focus = jest.fn();
    iframe.contentWindow.print = jest.fn();

    iframe.dispatchEvent(new Event('load'));
    expect(iframe.contentWindow.print).toHaveBeenCalledTimes(1);
    await expect(printTask).resolves.toBeUndefined();

    // Browser focus can change as preview opens; it must not remove the document.
    window.dispatchEvent(new Event('focus'));
    expect(iframe.isConnected).toBe(true);

    // Some browsers return from print() without dispatching afterprint on cancel.
    jest.advanceTimersByTime(120000);
    expect(iframe.isConnected).toBe(false);
    expect(jest.getTimerCount()).toBe(0);
  } finally {
    document.querySelectorAll('iframe[title="Note print document"]').forEach((iframe) => iframe.remove());
    jest.useRealTimers();
  }
});
