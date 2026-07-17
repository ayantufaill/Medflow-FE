import React from 'react';
import { Typography } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';

import { ReportFilterBar, ReportSelect } from '../../../reports/ui';

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
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Typography sx={{ fontSize: '0.85rem', color: '#64748b' }}>Date Range:</Typography>
      <ReportSelect value={dateRange} onChange={handleDateRangeChange} options={['Range', 'Today', 'This Week', 'This Month']} sx={{ width: 120 }} />
      
      <Typography sx={{ fontSize: '0.85rem', color: '#64748b', ml: 1 }}>Start Date:</Typography>
      <DatePicker 
        value={startDate} 
        onChange={(newValue) => setStartDate(newValue)}
        disabled={dateRange !== 'Range'}
        views={['year', 'month', 'day']}
        slotProps={{
          textField: {
            size: 'small',
            sx: { width: "165px", '& .MuiInputBase-root': { height: "40px", fontSize: "13px", fontFamily: "Inter", borderRadius: "8px", bgcolor: '#fff' } }
          },
          popper: { sx: { zIndex: 1600 } }
        }}
      />
      
      <Typography sx={{ fontSize: '0.85rem', color: '#64748b', ml: 1 }}>End Date:</Typography>
      <DatePicker 
        value={endDate} 
        onChange={(newValue) => setEndDate(newValue)}
        disabled={dateRange !== 'Range'}
        views={['year', 'month', 'day']}
        slotProps={{
          textField: {
            size: 'small',
            sx: { width: "165px", '& .MuiInputBase-root': { height: "40px", fontSize: "13px", fontFamily: "Inter", borderRadius: "8px", bgcolor: '#fff' } }
          },
          popper: { sx: { zIndex: 1600 } }
        }}
      />
    </LocalizationProvider>
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
