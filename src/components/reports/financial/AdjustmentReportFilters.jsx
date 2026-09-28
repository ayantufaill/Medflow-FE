import React, { useMemo } from 'react';
import { Box, Typography, Autocomplete, TextField, InputAdornment } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';
import { ReportFilterBar, ReportSelect, ReportCheckbox, ReportSearchInput, ReportDivider } from '../ui';

const AdjustmentReportFilters = ({
  dateRange, startDate, endDate, provider, adjustmentType, grouping,
  codeFilter, codeText, filterByProductionDate, showFlags, showDOB,
  showProviderColumn, filterByDOS, flagFilter, sortBy, reportData, dropdownProviders, adjustmentTypes,
  getProviderLabel, handleFilterChange, handleFilterModeChange, handleApply, handleClear
}) => {

  const uniqueCodes = useMemo(() => {
    if (!reportData) return [];
    const map = new Map();
    const rows = Array.isArray(reportData) ? reportData : [];
    
    rows.forEach(r => {
      if (r.code) {
        map.set(r.code, { code: r.code, desc: r.procedure || '' });
      }
    });
    return Array.from(map.values()).sort((a, b) => a.code.localeCompare(b.code));
  }, [reportData]);

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
        label="ADJUSTMENT TYPE" 
        value={adjustmentType}
        onChange={(e) => handleFilterChange('adjustmentType', e.target.value)}
        options={[
          { value: 'all', label: 'All' },
          ...(adjustmentTypes || []).map((t) => ({ value: t.type, label: t.type }))
        ]}
      />

      <ReportSelect 
        label="GROUP BY" 
        value={grouping}
        onChange={(e) => handleFilterChange('grouping', e.target.value)}
        options={[
          { value: 'no-grouping', label: 'No Grouping' },
          { value: 'group-provider', label: 'Group By Provider' },
          { value: 'group-adj', label: 'Group By Adjustment' }
        ]}
      />
    </>
  );

  const middleFilters = (
    <>
      <ReportSelect 
        label="CODES FILTER"
        options={[
          { value: 'filter', label: 'Filter Codes' },
          { value: 'exclude', label: 'Enter Codes to Exclude' },
        ]}
        value={codeFilter}
        onChange={(e) => handleFilterChange('codeFilter', e.target.value)}
      />
      <Box sx={{ display: 'flex', flexDirection: 'column', minWidth: 250 }}>
        <Typography variant="caption" sx={{ fontWeight: 600, color: '#4a5568', mb: 0.5, display: 'block', textTransform: 'capitalize', whiteSpace: 'nowrap', visibility: 'hidden' }}>
          code or procedure
        </Typography>
        <Autocomplete
          size="small"
          options={uniqueCodes}
          getOptionLabel={(opt) => `${opt.code} - ${opt.desc}`}
          value={uniqueCodes.find(c => c.code === codeText) || null}
          onChange={(e, newVal) => {
            handleFilterChange('codeText', newVal ? newVal.code : '');
          }}
          renderInput={(params) => (
            <TextField
              {...params}
              placeholder={!codeText ? "Enter code or procedure" : ""}
              sx={{
                '& .MuiOutlinedInput-root': {
                  backgroundColor: '#fafbfe',
                  minHeight: 36,
                  padding: '2px 8px',
                  borderRadius: '4px',
                  fontFamily: 'Inter',
                  fontSize: '13px',
                  color: '#09121f',
                  fontWeight: 500,
                  '& fieldset': { borderColor: '#e2e8f0' },
                }
              }}
            />
          )}
          ListboxProps={{
            sx: {
              '& .MuiAutocomplete-option': {
                fontFamily: 'Inter',
                fontSize: '13px',
              }
            }
          }}
          sx={{ width: '100%' }}
        />
      </Box>

      <ReportDivider />

      <ReportSelect 
        label="Flag Filter"
        options={[
          { value: 'pts', label: 'Pts With Or Without Flags' },
          { value: 'with_flags', label: 'Pts With Flags Only' },
          { value: 'without_flags', label: 'Pts Without Flags Only' },
        ]}
        value={flagFilter}
        onChange={(e) => handleFilterChange('flagFilter', e.target.value)}
      />
      
      <ReportSelect 
        label="SORT REPORT BY"
        options={[
          { value: 'default', label: 'Default' },
          { value: 'date_asc', label: 'Date: Ascending' },
          { value: 'date_desc', label: 'Date: Descending' },
          { value: 'patient', label: 'Patient Name' },
          { value: 'amount_desc', label: 'Amount: High to Low' },
        ]}
        value={sortBy}
        onChange={(e) => handleFilterChange('sortBy', e.target.value)}
      />
    </>
  );

  const bottomFilters = (
    <>
      <ReportCheckbox 
        label="Filter by Production Date" 
        checked={filterByProductionDate}
        onChange={(e) => handleFilterChange('filterByProductionDate', typeof e === 'boolean' ? e : e?.target?.checked)}
      />
      <ReportCheckbox 
        label="Show Flags in Report" 
        checked={showFlags}
        onChange={(e) => handleFilterChange('showFlags', typeof e === 'boolean' ? e : e?.target?.checked)}
      />
      <ReportCheckbox 
        label="Show Date of Birth" 
        checked={showDOB}
        onChange={(e) => handleFilterChange('showDOB', typeof e === 'boolean' ? e : e?.target?.checked)}
      />
      <ReportCheckbox 
        label="Show Provider" 
        checked={showProviderColumn}
        onChange={(e) => handleFilterChange('showProviderColumn', typeof e === 'boolean' ? e : e?.target?.checked)}
      />
      <ReportCheckbox 
        label="Filter by DOS" 
        checked={filterByDOS}
        onChange={(e) => handleFilterChange('filterByDOS', typeof e === 'boolean' ? e : e?.target?.checked)}
      />
    </>
  );

  return (
    <ReportFilterBar 
      topRowFilters={topFilters}
      middleRowFilters={middleFilters}
      bottomRowFilters={bottomFilters}
      onApplyFilters={handleApply}
      onClearAll={handleClear}
      onCreateTemplate={() => {}}
    />
  );
};

export default AdjustmentReportFilters;
