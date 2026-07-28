import React from 'react';
import { Box, Typography } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import { ReportFilterBar, ReportSelect, ReportSearchInput } from '../ui';

const AuditReportFilters = ({
  dateRange,
  startDate,
  endDate,
  searchUser,
  searchPatient,
  actionFilter,
  categoryFilter,
  setDateRange,
  setStartDate,
  setEndDate,
  setSearchUser,
  setSearchPatient,
  setActionFilter,
  setCategoryFilter,
  handleApply,
  handleClear
}) => {
  const topFilters = (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <ReportSelect 
        label="DATE RANGE FILTER"
        options={[
          { value: 'Daily', label: 'Daily' },
          { value: 'range', label: 'Range' },
          { value: 'this_week', label: 'This Week' },
          { value: 'this_month', label: 'This Month' },
          { value: 'last_7_days', label: 'Last 7 days' },
          { value: 'last_week', label: 'Last Week' },
          { value: 'last_4_weeks', label: 'Last 4 Weeks' },
          { value: 'last_month', label: 'Last Month' },
          { value: 'last_3_months', label: 'Last 3 Months' },
          { value: 'last_12_months', label: 'Last 12 Months' },
          { value: 'year_to_date', label: 'Year to date' },
        ]}
        value={dateRange}
        onChange={(e) => setDateRange(e.target.value)}
        width="180px"
      />
      <Box sx={{ display: 'flex', flexDirection: 'column' }}>
        <Typography variant="caption" sx={{ fontWeight: 600, color: '#4a5568', mb: 0.5, display: 'block', textTransform: 'capitalize' }}>
          start date
        </Typography>
        <DatePicker
          value={dayjs(startDate)}
          onChange={(newValue) => setStartDate(newValue ? newValue.format('YYYY-MM-DD') : '')}
          format="MM/DD/YYYY"
          slotProps={{ 
            popper: { sx: { zIndex: 1400 } },
            textField: { 
              size: 'small', 
              sx: { 
                width: '180px',
                '& .MuiInputBase-root': { 
                  fontFamily: 'Inter', 
                  fontSize: '13px', 
                  borderRadius: '4px', 
                  height: '36px', 
                  backgroundColor: '#fafbfe',
                  color: '#09121f'
                }, 
                '& fieldset': { borderColor: '#e2e8f0' } 
              } 
            }
          }}
        />
      </Box>
      <Box sx={{ display: 'flex', flexDirection: 'column' }}>
        <Typography variant="caption" sx={{ fontWeight: 600, color: '#4a5568', mb: 0.5, display: 'block', textTransform: 'capitalize' }}>
          end date
        </Typography>
        <DatePicker
          value={dayjs(endDate)}
          onChange={(newValue) => setEndDate(newValue ? newValue.format('YYYY-MM-DD') : '')}
          format="MM/DD/YYYY"
          slotProps={{ 
            popper: { sx: { zIndex: 1400 } },
            textField: { 
              size: 'small', 
              sx: { 
                width: '180px',
                '& .MuiInputBase-root': { 
                  fontFamily: 'Inter', 
                  fontSize: '13px', 
                  borderRadius: '4px', 
                  height: '36px', 
                  backgroundColor: '#fafbfe',
                  color: '#09121f'
                }, 
                '& fieldset': { borderColor: '#e2e8f0' } 
              } 
            }
          }}
        />
      </Box>

      <ReportSelect 
        label="Action" 
        options={[{ value: 'None', label: 'None' }, { value: 'Action Performed', label: 'Action Performed' }, { value: 'Create', label: 'Create' }, { value: 'Update', label: 'Update' }, { value: 'Delete', label: 'Delete' }]}
        value={actionFilter}
        onChange={(e) => setActionFilter(e.target.value)}
        width="130px"
      />

      <ReportSelect 
        label="Category" 
        options={[{ value: 'None', label: 'None' }, { value: 'Report', label: 'Report' }, { value: 'Patient', label: 'Patient' }, { value: 'Schedule', label: 'Schedule' }]}
        value={categoryFilter}
        onChange={(e) => setCategoryFilter(e.target.value)}
        width="130px"
      />
    </LocalizationProvider>
  );

  const bottomFilters = (
    <>
      <ReportSearchInput 
        placeholder="Search User..." 
        value={searchUser}
        onChange={(e) => setSearchUser(e.target.value)}
      />
      
      <ReportSearchInput 
        placeholder="Search Patient..." 
        value={searchPatient}
        onChange={(e) => setSearchPatient(e.target.value)}
      />
    </>
  );

  return (
    <ReportFilterBar 
      topRowFilters={topFilters}
      bottomRowFilters={bottomFilters}
      onApplyFilters={handleApply}
      onClearAll={handleClear}
    />
  );
};

export default AuditReportFilters;
