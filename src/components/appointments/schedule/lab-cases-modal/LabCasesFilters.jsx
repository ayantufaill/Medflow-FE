import React, { useState } from 'react';
import { Box, Typography } from '@mui/material';
import dayjs from 'dayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

import { ReportFilterBar, ReportSelect, ReportCheckbox } from '../../../reports/ui';

const LabCasesFilters = () => {
  const [includeInactive, setIncludeInactive] = useState(false);
  const [dateRange, setDateRange] = useState('Range');
  const [startDate, setStartDate] = useState(dayjs());
  const [endDate, setEndDate] = useState(dayjs());

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

  const topFilters = (
    <>
      <Typography sx={{ fontSize: '0.9rem', color: '#445164', fontWeight: 600, mr: 1 }}>Filter By:</Typography>
      <ReportSelect defaultValue="Select Status" options={['New', 'Printed', 'Completed']} sx={{ width: 160 }} />
      <Box sx={{ ml: 2 }}>
        <ReportCheckbox 
          label="Include Inactive" 
          checked={includeInactive} 
          onChange={(e) => setIncludeInactive(e.target.checked)} 
        />
      </Box>
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
      
      <ReportSelect defaultValue="Lab Due Date" options={['Lab Due Date']} sx={{ width: 150, ml: 1 }} />
    </LocalizationProvider>
  );

  return (
    <ReportFilterBar 
      topRowFilters={topFilters}
      bottomRowFilters={bottomFilters}
      onApplyFilters={() => {}}
    />
  );
};

export default LabCasesFilters;
