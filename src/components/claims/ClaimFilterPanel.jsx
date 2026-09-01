import React from 'react';
import { Box, Typography, Autocomplete, CircularProgress, InputAdornment, TextField } from '@mui/material';
import { Search as SearchIcon } from '@mui/icons-material';
import { ReportFilterBar, ReportSelect, ReportCheckbox, ReportSearchInput } from '../reports/ui';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

/**
 * Configurable filter panel shared across all claim tabs.
 *
 * Props:
 *  - filters: Array of { key, label, options:[{value,label}], value, onChange }
 *  - bottomRowFilters: Array of { key, label, options:[{value,label}], value, onChange }
 *  - searchValue, onSearchChange, searchPlaceholder
 *  - checkboxes: Array of { label, checked, onChange }
 *  - onRefresh: function to trigger refresh
 *  - onClearAll: function to clear all filters
 *  - patientSearchProps: { value, onInputChange, options, loading } (optional, for autocomplete)
 *  - extraSearchInputs: Array of { placeholder, value, onChange }
 */
const ClaimFilterPanel = ({
  filters = [],
  bottomRowFilters = [],
  searchValue = '',
  onSearchChange,
  searchPlaceholder = 'Search by name, claim number or date',
  extraSearchInputs = [],
  checkboxes = [],
  onRefresh,
  patientSearchProps,
  onClearAll,
  customDateRange,
  onCustomDateRangeChange,
}) => {
  const topFilters = filters.map((filter) => {
    const isFilterDateRange = filter.key === 'filterDate' && filter.value === 'range';
    
    return (
      <Box key={filter.key} sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
        <ReportSelect
          label={filter.label}
          options={filter.options}
          value={filter.value}
          onChange={(e) => filter.onChange(e.target.value)}
          width={filter.width || '150px'}
        />
        {isFilterDateRange && onCustomDateRangeChange && (
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <Box sx={{ display: 'flex', gap: 1, alignItems: 'flex-start' }}>
              <Box sx={{ display: 'flex', flexDirection: 'column', minWidth: 140 }}>
                <Typography variant="caption" sx={{ fontWeight: 600, color: '#4a5568', mb: 0.5, display: 'block', textTransform: 'capitalize', whiteSpace: 'nowrap' }}>
                  start date
                </Typography>
                <DatePicker
                  value={customDateRange?.start || null}
                  onChange={(newValue) => onCustomDateRangeChange({ ...(customDateRange || {}), start: newValue })}
                  slotProps={{ 
                    textField: { 
                      size: 'small', 
                      sx: { 
                        width: 150, 
                        backgroundColor: '#fafbfe',
                        borderRadius: '4px',
                        '& .MuiInputBase-root': {
                           height: 36,
                           fontSize: '13px',
                           fontFamily: 'Inter',
                           fontWeight: 500,
                           color: '#09121f',
                        },
                        '& .MuiInputBase-input': {
                           padding: '8px 14px',
                           boxSizing: 'border-box',
                           '&::placeholder': {
                             color: '#94a3b8',
                             opacity: 1
                           }
                        },
                        '& .MuiOutlinedInput-notchedOutline': {
                          borderColor: '#e2e8f0'
                        },
                        '&:hover .MuiOutlinedInput-notchedOutline': {
                          borderColor: '#e2e8f0'
                        },
                        '& .MuiIconButton-root': {
                          padding: '4px'
                        },
                        '& .MuiSvgIcon-root': {
                          fontSize: '20px',
                          color: '#4a5568'
                        }
                      } 
                    } 
                  }}
                />
              </Box>
              <Typography variant="body2" color="textSecondary" sx={{ mt: 3 }}>-</Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', minWidth: 140 }}>
                <Typography variant="caption" sx={{ fontWeight: 600, color: '#4a5568', mb: 0.5, display: 'block', textTransform: 'capitalize', whiteSpace: 'nowrap' }}>
                  end date
                </Typography>
                <DatePicker
                  value={customDateRange?.end || null}
                  onChange={(newValue) => onCustomDateRangeChange({ ...(customDateRange || {}), end: newValue })}
                  slotProps={{ 
                    textField: { 
                      size: 'small', 
                      sx: { 
                        width: 140, 
                        backgroundColor: '#fafbfe',
                        borderRadius: '4px',
                        '& .MuiInputBase-root': {
                           height: 36,
                           fontSize: '13px',
                           fontFamily: 'Inter',
                           fontWeight: 500,
                           color: '#09121f',
                        },
                        '& .MuiInputBase-input': {
                           padding: '8.5px 14px',
                        },
                        '& .MuiOutlinedInput-notchedOutline': {
                          borderColor: '#e2e8f0'
                        }
                      } 
                    } 
                  }}
                />
              </Box>
            </Box>
          </LocalizationProvider>
        )}
      </Box>
    );
  });

  const middleFilters = bottomRowFilters.map((filter) => (
    <ReportSelect
      key={filter.key}
      label={filter.label}
      options={filter.options}
      value={filter.value}
      onChange={(e) => filter.onChange(e.target.value)}
      width={filter.width || '150px'}
    />
  ));

  const bottomFilters = (
    <>
      {patientSearchProps ? (
        <Autocomplete
          freeSolo
          options={patientSearchProps.options || []}
          getOptionLabel={(option) => {
            if (typeof option === 'string') return option;
            return `${option.firstName || ''} ${option.lastName || ''}`.trim();
          }}
          filterOptions={(x) => x}
          loading={patientSearchProps.loading}
          inputValue={patientSearchProps.value}
          onInputChange={(e, newValue) => patientSearchProps.onInputChange(newValue)}
          renderOption={(props, option) => (
            <Box component="li" {...props} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', py: 1, borderBottom: '1px solid #f0f0f0' }}>
              <Typography variant="body2" sx={{ fontWeight: 600, color: '#2b3445' }}>
                {option.firstName} {option.lastName} {option.patientCode ? `(#${option.patientCode})` : ''}
              </Typography>
              {option.dateOfBirth && (
                <Typography variant="caption" sx={{ color: '#718096' }}>
                  {new Date(option.dateOfBirth).toLocaleDateString()}
                </Typography>
              )}
            </Box>
          )}
          renderInput={(params) => (
            <TextField
              {...params}
              placeholder={searchPlaceholder}
              size="small"
              InputProps={{
                ...params.InputProps,
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon sx={{ color: '#94a3b8', fontSize: 18 }} />
                  </InputAdornment>
                ),
                endAdornment: (
                  <>
                    {patientSearchProps.loading ? <CircularProgress color="inherit" size={16} /> : null}
                    {params.InputProps.endAdornment}
                  </>
                ),
              }}
              sx={{ '& .MuiOutlinedInput-root': { backgroundColor: '#f8fafc', fontSize: '0.75rem', height: '36px', borderRadius: '8px', '& fieldset': { borderColor: '#e2e8f0' } } }}
            />
          )}
          sx={{ width: '220px' }}
        />
      ) : (
        <ReportSearchInput
          placeholder={searchPlaceholder}
          value={searchValue}
          onChange={(e) => onSearchChange(e.target.value)}
          width="220px"
        />
      )}

      {extraSearchInputs.map((inputProps, i) => (
        <ReportSearchInput
          key={`extra-search-${i}`}
          placeholder={inputProps.placeholder}
          value={inputProps.value}
          onChange={(e) => inputProps.onChange(e.target.value)}
          width="180px"
        />
      ))}

      {checkboxes.map((cb, i) => (
        <ReportCheckbox
          key={`cb-${i}`}
          label={cb.label}
          checked={cb.checked}
          onChange={(e) => cb.onChange(e.target.checked)}
        />
      ))}
    </>
  );

  return (
    <ReportFilterBar
      topRowFilters={filters.length > 0 ? topFilters : null}
      middleRowFilters={bottomRowFilters.length > 0 ? middleFilters : null}
      bottomRowFilters={bottomFilters}
      onApplyFilters={onRefresh}
      onClearAll={onClearAll}
    />
  );
};

export default ClaimFilterPanel;
