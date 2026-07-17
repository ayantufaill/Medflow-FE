import React from 'react';
import { Box, Typography } from '@mui/material';
import { ReportFilterBar, ReportSelect, ReportDivider } from '../../../reports/ui';
import { COLORS } from '../../../../constants/colors';

const AppointmentHistoryFilters = ({
  filterType,
  setFilterType,
  statusFilter,
  setStatusFilter,
  sortBy,
  setSortBy,
  uniqueStatuses,
  filteredCount
}) => {
  return (
    <Box sx={{ p: '16px 24px 0 24px' }}>
      <ReportFilterBar 
        topRowFilters={
          <>
            <Typography sx={{ fontSize: '0.85rem', color: COLORS.TEXT_PRIMARY, fontWeight: 600, mr: 1 }}>Filter by:</Typography>
            <ReportSelect 
              value={filterType} 
              onChange={(e) => setFilterType(e.target.value)} 
              options={[
                { label: 'All', value: 'all' },
                { label: 'Past', value: 'past' },
                { label: 'Future', value: 'future' }
              ]} 
              sx={{ width: 120 }} 
            />
            
            <ReportDivider />

            <Typography sx={{ fontSize: '0.85rem', color: COLORS.TEXT_PRIMARY, fontWeight: 600, mr: 1 }}>Status:</Typography>
            <ReportSelect 
              value={statusFilter} 
              onChange={(e) => setStatusFilter(e.target.value)} 
              options={uniqueStatuses.map(s => ({ label: s === 'all' ? 'All Statuses' : s, value: s }))} 
              sx={{ width: 150 }} 
            />
          </>
        }
        topRowActions={
          <>
            <Typography sx={{ fontSize: '0.85rem', color: COLORS.TEXT_PRIMARY, fontWeight: 600, mr: 1 }}>Sort by:</Typography>
            <ReportSelect 
              value={sortBy} 
              onChange={(e) => setSortBy(e.target.value)} 
              options={[
                { label: 'Appointment Date', value: 'date' },
                { label: 'Last Status Change', value: 'lastStatusChange' }
              ]} 
              sx={{ width: 180 }} 
            />
            <ReportDivider />
            <Typography sx={{ fontSize: '0.8rem', fontWeight: 600, color: COLORS.TEXT_MUTED, fontStyle: "italic" }}>
              {filteredCount} Record(s)
            </Typography>
          </>
        }
      />
    </Box>
  );
};

export default AppointmentHistoryFilters;
