import React from 'react';
import { Box, Typography } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import { ReportFilterBar, ReportSelect, ReportSearchInput, ReportDivider } from '../ui';

const ProceduresInsuranceFilters = ({
  dateRange,
  startDate,
  endDate,
  provider,
  payerName,
  providers,
  setStartDate,
  setEndDate,
  setProvider,
  setPayerName,
  handleFilterModeChange,
  handleApply,
  handleClear
}) => {
  const topFilters = (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <ReportSelect 
        label="DATE RANGE"
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
        onChange={handleFilterModeChange}
        width="130px"
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
                width: '150px',
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
                width: '150px',
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

      <ReportDivider />

      <ReportSelect 
        label="PROVIDER" 
        options={providers || [{ value: 'All', label: 'All Providers' }]} 
        value={provider} 
        onChange={(e) => setProvider(e.target.value)} 
        width="150px" 
      />
    </LocalizationProvider>
  );

  const bottomFilters = (
    <>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
        <Typography sx={{ fontSize: '0.75rem', fontWeight: 600, color: '#4a5568', whiteSpace: 'nowrap', textTransform: 'uppercase' }}>Search by Payer:</Typography>
        <ReportSearchInput 
          placeholder="Enter Name"
          value={payerName}
          onChange={(e) => setPayerName(e.target.value)}
          width="220px"
        />
      </Box>
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

export default ProceduresInsuranceFilters;
