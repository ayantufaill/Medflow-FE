import { render, screen } from '@testing-library/react';
import PeriodontalReportChart from './PeriodontalReportChart';
import CategoryTabContent from '../shared/CategoryTabContent';

test('shows a missing chart without a healthy result or sample images', () => {
  render(<><PeriodontalReportChart section={{ assessed: false }} />
    <CategoryTabContent category={{ isPeriodontal: true, assessed: false, issues: [] }} /></>);
  expect(screen.getByText('Not assessed')).toBeInTheDocument();
  expect(screen.getByText('No periodontal measurements recorded.')).toBeInTheDocument();
  expect(screen.queryByText(/No issues detected/)).not.toBeInTheDocument();
  expect(screen.queryByRole('img')).not.toBeInTheDocument();
});

test('renders saved measurements preserving zero and unrecorded sites', () => {
  render(<PeriodontalReportChart section={{ measurements: [{ tooth: '8', side: 'facial',
    probe: [3, 5, null], recession: [0, null, 2], attachment: [3, null, null],
    bleeding: [0, 2], mobility: 'none', furcation: '1', pcs: ['P', 'S'],
  }] }} />);
  expect(screen.getByRole('table', { name: 'Saved periodontal measurements' })).toBeInTheDocument();
  expect(screen.getByText('#8 facial')).toBeInTheDocument();
  expect(screen.getByText('3 / 5 / —')).toBeInTheDocument();
  expect(screen.getByText('0 / — / 2')).toBeInTheDocument();
  expect(screen.getByText('1, 3')).toBeInTheDocument();
});

test('renders the chart source, recorded diagnosis and summary', () => {
  render(<CategoryTabContent category={{ isPeriodontal: true, assessed: true, issues: [],
    source: { examDate: '2026-10-11T08:00:00Z', savedAt: '2026-10-12T08:00:00Z' },
    diagnosis: { type: 'periodontitis', stage: 'stage3', distribution: 'localized', grading: 'gradeC' },
    summary: { measuredSites: 3, totalSites: 186, maxProbingDepth: 6, bleedingSites: 2, recessionSites: 1, deepPocketSites: 2 },
  }} />);
  expect(screen.getByText('Periodontitis · Stage III · Localized · Grade C')).toBeInTheDocument();
  expect(screen.getByText('Probing sites recorded: 3 / 186')).toBeInTheDocument();
  expect(screen.getByText(/Last saved:/)).toBeInTheDocument();
  expect(screen.getByText('Recorded pockets ≥5 mm: 2')).toBeInTheDocument();
});

test('keeps nonperiodontal findings rendering intact', () => {
  render(<CategoryTabContent category={{ title: 'Tooth Structure', issues: [{ id: 1, label: 'Finding', value: 'Tooth 8' }] }} />);
  expect(screen.getByText('Tooth 8')).toBeInTheDocument();
  expect(screen.queryByText('Not assessed')).not.toBeInTheDocument();
});
