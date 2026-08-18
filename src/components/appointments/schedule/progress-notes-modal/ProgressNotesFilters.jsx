import React from 'react';
import { Box, Typography } from '@mui/material';
import dayjs from 'dayjs';

import { ReportFilterBar, ReportSelect } from '../../../reports/ui';
import DateNavigation from '../DateNavigation';

const ProgressNotesFilters = ({
  dateRange,
  setDateRange,
  startDate,
  setStartDate,
  endDate,
  setEndDate,
  kind,
  setKind,
  providerId,
  setProviderId,
  providers = [],
  onApply
}) => {
  const handleDateRangeChange = (e) => {
    const val = e.target.value;
    setDateRange(val);
    if (val === 'Today') {
      setStartDate(dayjs());
      setEndDate(dayjs());
    } else if (val === 'This Week') {
      setStartDate(dayjs().startOf('week'));
      setEndDate(dayjs().endOf('week'));
    } else if (val === 'This Month') {
      setStartDate(dayjs().startOf('month'));
      setEndDate(dayjs().endOf('month'));
    } else if (val === 'Range') {
      setEndDate(dayjs());
    }
  };

  const providerOptions = ['All', ...providers.map(p => {
    let name = p.name;
    if (!name) name = `${p.firstName || ""} ${p.lastName || ""}`.trim();
    if (!name) name = `${p.userId?.firstName || ""} ${p.userId?.lastName || ""}`.trim();
    if (!name) name = p.providerCode || `Provider #${p._id || p.id}`;
    return name;
  })];

  const providerValues = ['All', ...providers.map(p => p._id || p.id)];

  const handleProviderChange = (e) => {
    // Find the index of the selected option name and map to its ID
    const selectedIndex = providerOptions.indexOf(e.target.value);
    if (selectedIndex !== -1) {
      setProviderId(providerValues[selectedIndex]);
    }
  };

  const currentProviderOption = providerOptions[providerValues.indexOf(providerId)] || 'All';

  const topFilters = (
    <>
      <Typography sx={{ fontSize: '0.9rem', color: '#445164', fontWeight: 600, mr: 1 }}>Filter By:</Typography>
      <ReportSelect
        value={kind}
        onChange={(e) => setKind(e.target.value)}
        options={['All', 'Treatment', 'Recare', 'Exam', 'Emergency']}
        sx={{ width: 140 }}
      />

      <Typography sx={{ fontSize: '0.9rem', color: '#445164', fontWeight: 600, ml: 2, mr: 1 }}>Provider:</Typography>
      <ReportSelect
        value={currentProviderOption}
        onChange={handleProviderChange}
        options={providerOptions}
        sx={{ width: 160 }}
      />
    </>
  );

  const bottomFilters = (
    <>
      <Typography sx={{ fontSize: '0.85rem', color: '#64748b' }}>Date Range:</Typography>
      <ReportSelect value={dateRange} onChange={handleDateRangeChange} options={['Range', 'Today', 'This Week', 'This Month']} sx={{ width: 120 }} />

      <Box sx={{ display: 'flex', alignItems: 'center', ml: 1 }}>
        <Typography sx={{ fontSize: '0.85rem', color: '#64748b' }}>Start Date:</Typography>
        <Box sx={{ ml: 1 }}>
          <DateNavigation 
            date={startDate} 
            onPrev={() => { setStartDate(startDate.subtract(1, 'day')); setDateRange('Range'); }}
            onNext={() => { setStartDate(startDate.add(1, 'day')); setDateRange('Range'); }}
            onDateSelect={(newValue) => { setStartDate(newValue); setDateRange('Range'); }}
          />
        </Box>
      </Box>

      <Box sx={{ display: 'flex', alignItems: 'center', ml: 2 }}>
        <Typography sx={{ fontSize: '0.85rem', color: '#64748b' }}>End Date:</Typography>
        <Box sx={{ ml: 1 }}>
          <DateNavigation 
            date={endDate} 
            onPrev={() => { setEndDate(endDate.subtract(1, 'day')); setDateRange('Range'); }}
            onNext={() => { setEndDate(endDate.add(1, 'day')); setDateRange('Range'); }}
            onDateSelect={(newValue) => { setEndDate(newValue); setDateRange('Range'); }}
          />
        </Box>
      </Box>
    </>
  );

  return (
    <ReportFilterBar
      topRowFilters={topFilters}
      bottomRowFilters={bottomFilters}
      onApplyFilters={onApply}
    />
  );
};

export default ProgressNotesFilters;
