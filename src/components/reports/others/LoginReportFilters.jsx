import React from 'react';
import { Box, Typography } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import { ReportFilterBar, ReportSelect, ReportSearchInput } from '../ui';

const LoginReportFilters = ({
  dateRange,
  startDate,
  endDate,
  searchQuery,
  setDateRange,
  setStartDate,
  setEndDate,
  setSearchQuery,
  handleApply,
  handleClear
}) => {
  const handleRangeChange = (e) => {
    const newMode = e.target.value;
    setDateRange(newMode);
    if (newMode === 'range') return;

    const today = new Date();
    let start = new Date(today);
    let end = new Date(today);

    switch (newMode) {
      case 'Daily':
      case 'daily':
        break;
      case 'this_week': {
        const day = today.getDay();
        const diff = today.getDate() - day + (day === 0 ? -6 : 1);
        start = new Date(new Date().setDate(diff));
        end = new Date(start);
        end.setDate(start.getDate() + 6);
        break;
      }
      case 'this_month': {
        start = new Date(today.getFullYear(), today.getMonth(), 1);
        end = new Date(today.getFullYear(), today.getMonth() + 1, 0);
        break;
      }
      case 'last_7_days': {
        start = new Date(today.getTime());
        start.setDate(today.getDate() - 6);
        break;
      }
      case 'last_week': {
        const day = today.getDay();
        const diffToLastWeekStart = today.getDate() - day - 7 + (day === 0 ? -6 : 1);
        start = new Date(new Date().setDate(diffToLastWeekStart));
        end = new Date(start);
        end.setDate(start.getDate() + 6);
        break;
      }
      case 'last_4_weeks': {
        start = new Date(today.getTime());
        start.setDate(today.getDate() - 28);
        break;
      }
      case 'last_month': {
        start = new Date(today.getFullYear(), today.getMonth() - 1, 1);
        end = new Date(today.getFullYear(), today.getMonth(), 0);
        break;
      }
      case 'last_3_months': {
        start = new Date(today.getTime());
        start.setMonth(today.getMonth() - 3);
        break;
      }
      case 'last_12_months': {
        start = new Date(today.getTime());
        start.setFullYear(today.getFullYear() - 1);
        break;
      }
      case 'year_to_date': {
        start = new Date(today.getFullYear(), 0, 1);
        break;
      }
      default:
        break;
    }

    setStartDate(dayjs(start).format('YYYY-MM-DD'));
    setEndDate(dayjs(end).format('YYYY-MM-DD'));
  };

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
        onChange={handleRangeChange}
        width="180px"
      />
      <Box sx={{ display: 'flex', flexDirection: 'column' }}>
        <Typography variant="caption" sx={{ fontWeight: 600, color: '#4a5568', mb: 0.5, display: 'block', textTransform: 'capitalize' }}>
          start date
        </Typography>
        <DatePicker
          value={dayjs(startDate)}
          onChange={(newValue) => { setStartDate(newValue ? newValue.format('YYYY-MM-DD') : ''); setDateRange('range'); }}
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
          onChange={(newValue) => { setEndDate(newValue ? newValue.format('YYYY-MM-DD') : ''); setDateRange('range'); }}
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
    </LocalizationProvider>
  );

  const bottomFilters = (
    <>
       <ReportSearchInput 
          placeholder="Search User..." 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
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

export default LoginReportFilters;
