import React from 'react';
import { Box, Typography, Radio, RadioGroup, FormControlLabel, TextField } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import { ReportFilterBar, ReportSelect, ReportDivider } from '../ui';

const CollectionCarrierFilters = ({
  dateRange,
  startDate,
  endDate,
  setStartDate,
  setEndDate,
  handleFilterModeChange,
  networkFilter,
  setNetworkFilter,
  payerFilter,
  setPayerFilter,
  payerText,
  setPayerText,
  planText,
  setPlanText,
  provider,
  setProvider,
  providers,
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
                width: '180px',
                '& .MuiInputBase-root': { 
                  fontFamily: 'Inter', 
                  fontSize: '13px', 
                  borderRadius: '4px', 
                  height: '36px', 
                  backgroundColor: '#fafbfe',
                  color: '#09121f'
                }, 
                '& .MuiInputBase-input': { padding: '4px 10px' }, 
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
                '& .MuiInputBase-input': { padding: '4px 10px' }, 
                '& fieldset': { borderColor: '#e2e8f0' } 
              } 
            }
          }}
        />
      </Box>

      <ReportDivider />

      <ReportSelect 
        label="PROVIDER" 
        options={providers || [{ value: 'All', label: 'All' }]} 
        value={provider} 
        onChange={(e) => setProvider(e.target.value)} 
        width="150px" 
      />
      <ReportSelect 
        label="FILTER BY NETWORK" 
        options={[
          { value: 'None', label: 'None' },
          { value: 'In', label: 'In Network' },
          { value: 'Out', label: 'Out of Network' }
        ]} 
        value={networkFilter} 
        onChange={(e) => setNetworkFilter(e.target.value)} 
        width="160px" 
      />
    </LocalizationProvider>
  );

  const bottomFilters = (
    <>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
        <RadioGroup row value={payerFilter} onChange={(e) => setPayerFilter(e.target.value)} sx={{ flexWrap: 'nowrap' }}>
          <FormControlLabel value="Payer" control={<Radio size="small" />} label={<Typography sx={{ fontSize: '0.8rem', fontWeight: 600, color: '#4a5568', whiteSpace: 'nowrap', textTransform: 'uppercase' }}>Filter by Payer:</Typography>} sx={{ m: 0 }} />
        </RadioGroup>
        <TextField 
          size="small" 
          variant="outlined" 
          placeholder="Enter Name" 
          value={payerText}
          onChange={(e) => setPayerText(e.target.value)}
          disabled={payerFilter !== 'Payer'}
          sx={{ width: 180, '& .MuiOutlinedInput-root': { height: 36, fontSize: '0.75rem', backgroundColor: '#fff', borderRadius: '4px', '& fieldset': { borderColor: '#e2e8f0' } } }} 
        />
      </Box>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
        <RadioGroup row value={payerFilter} onChange={(e) => setPayerFilter(e.target.value)} sx={{ flexWrap: 'nowrap' }}>
          <FormControlLabel value="Plan" control={<Radio size="small" />} label={<Typography sx={{ fontSize: '0.8rem', fontWeight: 600, color: '#4a5568', whiteSpace: 'nowrap', textTransform: 'uppercase' }}>Filter by Plan:</Typography>} sx={{ m: 0 }} />
        </RadioGroup>
        <TextField 
          size="small" 
          variant="outlined" 
          placeholder="Enter Name" 
          value={planText}
          onChange={(e) => setPlanText(e.target.value)}
          disabled={payerFilter !== 'Plan'}
          sx={{ width: 180, '& .MuiOutlinedInput-root': { height: 36, fontSize: '0.75rem', backgroundColor: '#fff', borderRadius: '4px', '& fieldset': { borderColor: '#e2e8f0' } } }} 
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

export default CollectionCarrierFilters;
