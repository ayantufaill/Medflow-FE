import { buildPeriodontalChartPrintHtml } from './printPeriodontalChart';

const summaryData = [
  { label: '# of sites', bleeding: '1', p4: '2', p5: '1', p6: '0', recession: '1' },
];

test('prints the selected patient and exam with both arches and recorded measurements', () => {
  const html = buildPeriodontalChartPrintHtml({
    patient: { firstName: 'Ava', lastName: 'Stone', patientCode: 'P-42', dateOfBirth: '1990-04-12' },
    patientId: '42', appointmentId: 'A-7', examDate: '2026-10-12', savedAt: '2026-10-13',
    provider: 'Dr. Lee', diagnosis: { type: 'periodontitis', stage: 'stage2', distribution: 'localized', grading: 'gradeB' },
    summaryData,
    chartData: {
      1: { facial: { probe: ['5', '4', '3'], recession: ['1', '', ''], attachment: ['6', '', ''], bleeding: [0, 2], pcs: ['P', 'C'], furcation: '2', mobility: '1' } },
      32: { lingual: { probe: ['2', '3', '4'] } },
    },
    missingTeeth: [2], isSigned: true, unsaved: true, logoUrl: '/logo.png',
  });

  expect(html).toContain('Ava Stone');
  expect(html).toContain('P-42');
  expect(html).toContain('A-7');
  expect(html).toContain('Dr. Lee');
  expect(html).toContain('Periodontitis · Stage II · Localized · Grade B');
  expect(html).toContain('5 / 4 / 3');
  expect(html).toContain('2 / 3 / 4');
  expect(html).toContain('● / – / ●');
  expect(html).toContain('<small>Missing</small>');
  expect(html).toContain('Upper arch · maxilla');
  expect(html).toContain('Lower arch · mandible');
  expect(html).toContain('This printout includes unsaved edits');
  expect(html).toContain('@page { size: A4 landscape');
});

test('escapes patient and measurement text in the print document', () => {
  const html = buildPeriodontalChartPrintHtml({
    patient: { firstName: '<Ava>', lastName: 'Stone' }, patientId: '42',
    chartData: { 1: { facial: { probe: ['<script>', '', ''] } } },
  });
  expect(html).toContain('&lt;Ava&gt; Stone');
  expect(html).toContain('&lt;script&gt; / – / –');
  expect(html).not.toContain('<script>');
});
