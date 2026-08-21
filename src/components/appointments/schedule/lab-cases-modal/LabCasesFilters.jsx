import React, { useState } from 'react';
import { Box, Typography } from '@mui/material';
import dayjs from 'dayjs';

import { ReportFilterBar, ReportSelect, ReportCheckbox } from '../../../reports/ui';
import DateNavigation from '../DateNavigation';

const LabCasesFilters = ({ filters, onFiltersChange, onApplyFilters }) => {
  const handleDateRangeChange = (e) => {
    const val = e.target.value;
    let newStart = dayjs();
    let newEnd = dayjs();

    if (val === 'Today') {
      newStart = dayjs();
      newEnd = dayjs();
    } else if (val === 'This Week') {
      newStart = dayjs().startOf('week');
      newEnd = dayjs().endOf('week');
    } else if (val === 'This Month') {
      newStart = dayjs().startOf('month');
      newEnd = dayjs().endOf('month');
    }

    onFiltersChange({
      ...filters,
      dateRange: val,
      startDate: newStart,
      endDate: newEnd
    });
  };

  const handleStatusChange = (e) => {
    onFiltersChange({ ...filters, status: e.target.value });
  };

  const topFilters = (
    <>
      <Typography sx={{ fontSize: '0.9rem', color: '#445164', fontWeight: 600, mr: 1 }}>Filter By:</Typography>
      <ReportSelect 
        value={filters.status} 
        onChange={handleStatusChange} 
        options={['Select Status', 'New', 'Printed', 'Completed']} 
        sx={{ width: 160 }} 
      />
      <Box sx={{ ml: 2 }}>
        <ReportSelect defaultValue="Lab Due Date" options={['Lab Due Date']} sx={{ width: 150 }} />
      </Box>
      <Box sx={{ ml: 2 }}>
        <ReportCheckbox 
          label="Include Inactive" 
          checked={filters.includeInactive} 
          onChange={(e) => onFiltersChange({ ...filters, includeInactive: e.target.checked })}
          disabled // Backend support not yet available
        />
      </Box>
    </>
  );

  const bottomFilters = (
    <>
      <Typography sx={{ fontSize: '0.85rem', color: '#64748b' }}>Date Range:</Typography>
      <ReportSelect value={filters.dateRange} onChange={handleDateRangeChange} options={['Range', 'Today', 'This Week', 'This Month']} sx={{ width: 120 }} />
      
      <Box sx={{ display: 'flex', alignItems: 'center', ml: 1 }}>
        <Typography sx={{ fontSize: '0.85rem', color: '#64748b' }}>Start Date:</Typography>
        <Box sx={{ 
          pointerEvents: filters.dateRange !== 'Range' ? 'none' : 'auto', 
          opacity: filters.dateRange !== 'Range' ? 0.5 : 1,
          ml: 1
        }}>
          <DateNavigation 
            date={filters.startDate} 
            onPrev={() => onFiltersChange({ ...filters, startDate: filters.startDate.subtract(1, 'day') })}
            onNext={() => onFiltersChange({ ...filters, startDate: filters.startDate.add(1, 'day') })}
            onDateSelect={(newValue) => onFiltersChange({ ...filters, startDate: newValue })}
          />
        </Box>
      </Box>
      
      <Box sx={{ display: 'flex', alignItems: 'center', ml: 2 }}>
        <Typography sx={{ fontSize: '0.85rem', color: '#64748b' }}>End Date:</Typography>
        <Box sx={{ 
          pointerEvents: filters.dateRange !== 'Range' ? 'none' : 'auto', 
          opacity: filters.dateRange !== 'Range' ? 0.5 : 1,
          ml: 1
        }}>
          <DateNavigation 
            date={filters.endDate} 
            onPrev={() => onFiltersChange({ ...filters, endDate: filters.endDate.subtract(1, 'day') })}
            onNext={() => onFiltersChange({ ...filters, endDate: filters.endDate.add(1, 'day') })}
            onDateSelect={(newValue) => onFiltersChange({ ...filters, endDate: newValue })}
          />
        </Box>
      </Box>
    </>
  );

  return (
    <ReportFilterBar 
      topRowFilters={topFilters}
      bottomRowFilters={bottomFilters}
      onApplyFilters={onApplyFilters}
    />
  );
};

export default LabCasesFilters;
