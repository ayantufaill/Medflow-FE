import React from 'react';
import { render, screen } from '@testing-library/react';
import EditFeesDrawer from './EditFeesDrawer';

const renderDrawer = (procedure) =>
  render(
    <EditFeesDrawer
      open
      procedure={procedure}
      onClose={() => {}}
      onSave={() => {}}
      saving={false}
      downgradeCodes={[]}
    />
  );

describe('EditFeesDrawer coverage-blocked notice', () => {
  it('shows the human-readable reason when the estimate was blocked', () => {
    renderDrawer({
      description: 'Prophylaxis',
      estimateSource: 'Auto',
      insuranceEstimate: 0,
      patientEstimate: 50,
      coverageBlockedReason: 'frequency',
    });

    expect(screen.getByText(/Insurance not applied/)).toBeInTheDocument();
    expect(screen.getByText(/Frequency limit/)).toBeInTheDocument();
  });

  it('renders the mapped label for a not-covered block', () => {
    renderDrawer({ description: 'Crown', estimateSource: 'Auto', coverageBlockedReason: 'not-covered' });

    expect(screen.getByText(/Insurance not applied/)).toBeInTheDocument();
    expect(screen.getByText(/Not covered/)).toBeInTheDocument();
  });

  it('shows no block notice when the reason is cleared', () => {
    renderDrawer({
      description: 'Filling',
      estimateSource: 'Auto',
      insuranceEstimate: 25,
      patientEstimate: 25,
      coverageBlockedReason: null,
    });

    expect(screen.queryByText(/Insurance not applied/)).toBeNull();
  });
});
