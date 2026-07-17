import React from 'react';
import {
  Box, Typography, Paper, TextField, FormControl, Select, MenuItem,
  FormControlLabel, Checkbox, Button, InputAdornment, Autocomplete, CircularProgress,
} from '@mui/material';
import { Search as SearchIcon, RadioButtonUnchecked as RadioButtonUncheckedIcon, RadioButtonChecked as RadioButtonCheckedIcon } from '@mui/icons-material';
import refreshIcon from '../../assets/claimicons/refreshicon.svg';

/**
 * Configurable filter panel shared across all claim tabs.
 *
 * Props:
 *  - filters: Array of { key, label, options:[{value,label}], value, onChange }
 *  - searchValue, onSearchChange, searchPlaceholder
 *  - checkboxes: Array of { label, checked, onChange }
 *  - onRefresh
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
}) => {
  return (
    <Paper
      sx={{
        p: 2,
        mb: 2,
        backgroundColor: '#ffffff',
        borderRadius: '8px',
        boxShadow: 'none',
        border: '1px solid #e0e6ed',
      }}
    >
      {/* Row 1: Dropdowns */}
      <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', mb: filters.length > 0 ? 1.5 : 0 }}>
        {filters.map((filter) => (
          <Box key={filter.key} sx={{ flex: filter.width ? 'none' : 1, width: filter.width, minWidth: filter.width || '150px' }}>
            <Typography
              variant="caption"
              sx={{ fontWeight: 600, color: '#4a5568', mb: 0.5, display: 'block' }}
            >
              {filter.label}
            </Typography>
            <FormControl fullWidth size="small">
              <Select
                value={filter.value}
                onChange={(e) => filter.onChange(e.target.value)}
                sx={{
                  backgroundColor: '#fafbfe',
                  borderRadius: '6px',
                  fontSize: '0.85rem',
                  height: '36px',
                }}
              >
                {filter.options.map((opt) => (
                  <MenuItem key={opt.value} value={opt.value} sx={{ fontSize: '0.85rem' }}>
                    {opt.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
        ))}
      </Box>


      {/* Row 1.5: Bottom Dropdowns (Optional) */}
      {bottomRowFilters.length > 0 && (
        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', mb: 1.5 }}>
          {bottomRowFilters.map((filter) => (
            <Box key={filter.key} sx={{ flex: filter.width ? 'none' : 1, width: filter.width, minWidth: filter.width || '150px' }}>
              <Typography
                variant="caption"
                sx={{ fontWeight: 600, color: '#4a5568', mb: 0.5, display: 'block' }}
              >
                {filter.label}
              </Typography>
              <FormControl fullWidth size="small">
                <Select
                  value={filter.value}
                  onChange={(e) => filter.onChange(e.target.value)}
                  sx={{
                    backgroundColor: '#fafbfe',
                    borderRadius: '6px',
                    fontSize: '0.85rem',
                    height: '36px',
                  }}
                >
                  {filter.options.map((opt) => (
                    <MenuItem key={opt.value} value={opt.value} sx={{ fontSize: '0.85rem' }}>
                      {opt.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>
          ))}
        </Box>
      )}

      {/* Row 2: Search + Checkboxes + Refresh */}
      <Box sx={{ display: 'flex', alignItems: 'flex-end', gap: 2, flexWrap: 'wrap' }}>
        {/* Patient Autocomplete Search */}
        {patientSearchProps ? (
          <Box sx={{ flex: '0 0 504px', width: '504px' }}>
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
                        <SearchIcon sx={{ color: '#a0aec0', fontSize: 18 }} />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <>
                        {patientSearchProps.loading ? <CircularProgress color="inherit" size={16} /> : null}
                        {params.InputProps.endAdornment}
                      </>
                    ),
                  }}
                  sx={{ '& .MuiOutlinedInput-root': { backgroundColor: '#ffffff', fontSize: '0.85rem', height: '40px', borderRadius: '6px' } }}
                />
              )}
            />
          </Box>
        ) : (
          <Box sx={{ flex: '0 0 504px', width: '504px' }}>
            <TextField
              fullWidth
              size="small"
              placeholder={searchPlaceholder}
              value={searchValue}
              onChange={(e) => onSearchChange(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon sx={{ color: '#a0aec0', fontSize: 18 }} />
                  </InputAdornment>
                ),
              }}
              sx={{ '& .MuiOutlinedInput-root': { backgroundColor: '#ffffff', fontSize: '0.85rem', height: '40px', borderRadius: '6px' } }}
            />
          </Box>
        )}

        {extraSearchInputs.map((inputProps, i) => (
          <Box key={`extra-search-${i}`} sx={{ flex: '1 1 280px', maxWidth: 400 }}>
            <TextField
              fullWidth
              size="small"
              placeholder={inputProps.placeholder}
              value={inputProps.value}
              onChange={(e) => inputProps.onChange(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon sx={{ color: '#a0aec0', fontSize: 18 }} />
                  </InputAdornment>
                ),
              }}
              sx={{ '& .MuiOutlinedInput-root': { backgroundColor: '#ffffff', fontSize: '0.85rem' } }}
            />
          </Box>
        ))}

        {/* Checkboxes */}
        {checkboxes.map((cb, i) => (
          <FormControlLabel
            key={i}
            control={
              <Checkbox
                size="small"
                checked={cb.checked}
                onChange={(e) => cb.onChange(e.target.checked)}
                icon={<RadioButtonUncheckedIcon sx={{ fontSize: 20 }} />}
                checkedIcon={<RadioButtonCheckedIcon sx={{ fontSize: 20 }} />}
                sx={{ color: '#8898aa', '&.Mui-checked': { color: '#3b82f6' }, padding: '4px' }}
              />
            }
            label={
              <Typography sx={{ fontSize: '0.8rem', fontWeight: 500, color: '#4a5568' }}>
                {cb.label}
              </Typography>
            }
          />
        ))}

        {/* Refresh link */}
        <Button
          onClick={onRefresh}
          sx={{
            textTransform: 'none',
            fontSize: '0.8rem',
            fontWeight: 600,
            color: '#1a3a6b',
            padding: '4px 8px',
            minWidth: 'auto',
            gap: 0.5,
            '&:hover': { background: 'none', textDecoration: 'underline' },
          }}
        >
          <Box component="img" src={refreshIcon} alt="refresh" sx={{ width: 14, height: 14 }} />
          Refresh
        </Button>
      </Box>
    </Paper>
  );
};

export default ClaimFilterPanel;
