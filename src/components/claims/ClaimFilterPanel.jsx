import React from 'react';
import { Box, Typography, Autocomplete, CircularProgress, InputAdornment, TextField } from '@mui/material';
import { Search as SearchIcon } from '@mui/icons-material';
import { ReportFilterBar, ReportSelect, ReportCheckbox, ReportSearchInput } from '../reports/ui';

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
}) => {
  const topFilters = filters.map((filter) => (
    <ReportSelect
      key={filter.key}
      label={filter.label}
      options={filter.options}
      value={filter.value}
      onChange={(e) => filter.onChange(e.target.value)}
      width={filter.width || '150px'}
    />
  ));

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
