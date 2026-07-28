import React from 'react';
import { Box, Typography, Button, FormControlLabel, RadioGroup, Radio } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import { ReportFilterBar, ReportSelect, ReportDivider, ReportCheckbox, ReportSearchInput } from '../ui';

const RecareListFilters = ({
  filterType,
  startDate,
  endDate,
  dentist,
  hygienist,
  dentistOptions = [],
  hygienistOptions = [],
  includeAppointed,
  flagFilter,
  showFlagsCol,
  searchQuery,
  setFilterType,
  setStartDate,
  setEndDate,
  setDentist,
  setHygienist,
  setIncludeAppointed,
  setFlagFilter,
  setShowFlagsCol,
  setSearchQuery,
  handleApplyFilters,
  handleClearFilters,
  getProviderName
}) => {
  const topFilters = (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <RadioGroup row value={filterType} onChange={(e) => setFilterType(e.target.value)}>
          <FormControlLabel value="range" control={<Radio size="small" />} label={<Typography sx={{ fontSize: '0.8rem', fontWeight: 500 }}>Range</Typography>} />
          <FormControlLabel value="monthly" control={<Radio size="small" />} label={<Typography sx={{ fontSize: '0.8rem', fontWeight: 500 }}>Monthly</Typography>} />
        </RadioGroup>
      </Box>

      <Box sx={{ display: 'flex', flexDirection: 'column' }}>
        <Typography variant="caption" sx={{ fontWeight: 600, color: '#4a5568', mb: 0.5, display: 'block', textTransform: 'capitalize' }}>
          from date
        </Typography>
        <DatePicker
          value={startDate ? dayjs(startDate) : null}
          onChange={(newValue) => setStartDate(newValue ? newValue.format('YYYY-MM-DD') : '')}
          format="MM/DD/YYYY"
          slotProps={{ 
            popper: { sx: { zIndex: 1400 } },
            textField: { 
              size: 'small', 
              sx: { 
                width: '135px',
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
          to date
        </Typography>
        <DatePicker
          value={endDate ? dayjs(endDate) : null}
          onChange={(newValue) => setEndDate(newValue ? newValue.format('YYYY-MM-DD') : '')}
          format="MM/DD/YYYY"
          slotProps={{ 
            popper: { sx: { zIndex: 1400 } },
            textField: { 
              size: 'small', 
              sx: { 
                width: '135px',
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
        label="DENTIST" 
        options={[
          { value: 'None', label: 'None' },
          ...dentistOptions.map(p => ({ value: String(p._id || p.id), label: getProviderName(p) }))
        ]} 
        value={dentist} 
        onChange={(e) => setDentist(e.target.value)} 
        width="140px" 
      />

      <ReportSelect 
        label="HYGIENIST" 
        options={[
          { value: 'None', label: 'None' },
          ...hygienistOptions.map(p => ({ value: String(p._id || p.id), label: getProviderName(p) }))
        ]} 
        value={hygienist} 
        onChange={(e) => setHygienist(e.target.value)} 
        width="140px" 
      />
    </LocalizationProvider>
  );

  const bottomFilters = (
    <>
      <ReportSelect 
        label="FILTER BY FLAGS" 
        options={[
          { value: 'both', label: 'Pts With Or Without Flags' },
          { value: 'with', label: 'Pts With Flags' },
          { value: 'without', label: 'Pts Without Flags' }
        ]} 
        value={flagFilter} 
        onChange={(e) => setFlagFilter(e.target.value)} 
        width="200px" 
      />

      <ReportDivider />

      <ReportCheckbox 
        label="Include Appointed" 
        checked={includeAppointed} 
        onChange={(e) => setIncludeAppointed(e.target.checked)} 
      />

      <ReportCheckbox 
        label={showFlagsCol ? "Show Flags in Report" : "Hide Flags in Report"} 
        checked={showFlagsCol} 
        onChange={(e) => setShowFlagsCol(e.target.checked)} 
      />

      <ReportDivider />

      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
        <Typography sx={{ fontSize: '0.75rem', fontWeight: 600, color: '#4a5568', whiteSpace: 'nowrap', textTransform: 'uppercase' }}>Search Patient:</Typography>
        <ReportSearchInput 
          placeholder="Search Patient"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          width="200px"
        />
      </Box>
    </>
  );

  return (
    <ReportFilterBar 
      topRowFilters={topFilters}
      bottomRowFilters={bottomFilters}
      onApplyFilters={handleApplyFilters}
      onClearAll={handleClearFilters}
    />
  );
};

export default RecareListFilters;
