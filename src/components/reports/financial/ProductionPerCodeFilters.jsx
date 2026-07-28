import React from 'react';
import { Box, Typography, TextField } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';
import { 
  ReportFilterBar, 
  ReportSelect, 
  ReportCheckbox, 
  ReportSearchInput,
  ReportDivider 
} from '../ui';

const ProductionPerCodeFilters = ({
  dateRange,
  startDate,
  endDate,
  provider,
  referralProvider,
  groupBy,
  codeFilter,
  codeText,
  showCollection,
  dropdownProviders,
  getProviderLabel,
  handleFilterChange,
  handleFilterModeChange,
  handleApply,
  handleClear
}) => {

  const topFilters = (
    <>
      <ReportSelect 
        label="DATE RANGE"
        options={[
          { value: 'daily', label: 'Daily' },
          { value: 'range', label: 'Range' },
          { value: 'this_week', label: 'This Week' },
          { value: 'this_month', label: 'This Month' },
          { value: 'last_7_days', label: 'Last 7 days' },
          { value: 'last_week', label: 'Last Week' },
          { value: 'last_4_weeks', label: 'Last 4 Weeks' },
          { value: 'last_month', label: 'Last Month' },
          { value: 'last_3_months', label: 'Last 3 Months' },
          { value: 'last_12_months', label: 'Last 12 Months' },
          { value: 'month_to_date', label: 'Month to date' },
          { value: 'quarter_to_date', label: 'Quarter to date' },
          { value: 'year_to_date', label: 'Year to date' },
          { value: 'last_year', label: 'Last Year' },
        ]}
        value={dateRange}
        onChange={handleFilterModeChange}
      />
      <Box sx={{ display: 'flex', flexDirection: 'column' }}>
        <Typography variant="caption" sx={{ fontWeight: 600, color: '#4a5568', mb: 0.5, display: 'block', textTransform: 'capitalize' }}>
          start date
        </Typography>
        <DatePicker
          value={dayjs(startDate)}
          onChange={(newValue) => handleFilterChange('startDate', newValue ? newValue.format('YYYY-MM-DD') : '')}
          format="MM/DD/YYYY"
          slotProps={{ 
            popper: { sx: { zIndex: 1400 } },
            textField: { 
              size: 'small', 
              sx: { width: '180px', '& .MuiInputBase-root': { fontFamily: 'Inter', fontSize: '13px', borderRadius: '4px', height: '32px', backgroundColor: '#fafbfe', color: '#09121f' }, '& .MuiInputBase-input': { padding: '4px 10px' }, '& fieldset': { borderColor: '#e2e8f0' } } 
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
          onChange={(newValue) => handleFilterChange('endDate', newValue ? newValue.format('YYYY-MM-DD') : '')}
          format="MM/DD/YYYY"
          slotProps={{ 
            popper: { sx: { zIndex: 1400 } },
            textField: { 
              size: 'small', 
              sx: { width: '180px', '& .MuiInputBase-root': { fontFamily: 'Inter', fontSize: '13px', borderRadius: '4px', height: '32px', backgroundColor: '#fafbfe', color: '#09121f' }, '& .MuiInputBase-input': { padding: '4px 10px' }, '& fieldset': { borderColor: '#e2e8f0' } } 
            }
          }}
        />
      </Box>

      <ReportDivider />

      <ReportSelect 
        label="FILTER REPORT BY PROVIDER" 
        value={provider}
        onChange={(e) => handleFilterChange('provider', e.target.value)}
        options={[
          { value: 'all', label: 'All' },
          ...dropdownProviders.map((p) => ({
            value: p._id || p.id,
            label: getProviderLabel(p)
          }))
        ]}
      />
      
      <ReportSelect 
        label="REFERRAL PROVIDER" 
        value={referralProvider}
        onChange={(e) => handleFilterChange('referralProvider', e.target.value)}
        options={[{ value: 'all', label: 'All' }]}
      />

      <ReportSelect 
        label="GROUP BY" 
        value={groupBy}
        onChange={(e) => handleFilterChange('groupBy', e.target.value)}
        options={[{ value: 'none', label: 'None' }]}
      />
    </>
  );

  const bottomFilters = (
    <>      
      <ReportSelect 
        label="CODES FILTER"
        labelPosition="left"
        options={[
          { value: 'filter', label: 'Filter Codes' },
          { value: 'exclude', label: 'Enter Codes to Exclude' },
        ]}
        value={codeFilter}
        onChange={(e) => handleFilterChange('codeFilter', e.target.value)}
      />
      <Box sx={{ display: 'flex', flexDirection: 'column'}}>
        <ReportSearchInput 
          placeholder="Enter code or procedure" 
          value={codeText}
          onChange={(e) => handleFilterChange('codeText', e.target.value)}
          width="250px"
        />
      </Box>
      <Box sx={{ display: 'flex', alignItems: 'center'}}>
        <ReportCheckbox 
          label="Show collection per code" 
          checked={showCollection}
          onChange={(e) => handleFilterChange('showCollection', typeof e === 'boolean' ? e : e?.target?.checked)}
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
      onCreateTemplate={() => {}}
    />
  );
};

export default ProductionPerCodeFilters;
