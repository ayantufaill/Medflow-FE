import React from 'react';
import { Box, Typography, Autocomplete, TextField, InputAdornment } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import { ReportFilterBar, ReportSelect, ReportSearchInput } from '../ui';

const DATE_PICKER_SX = {
  width: '180px',
  '& .MuiInputBase-root': {
    fontFamily: 'Inter',
    fontSize: '13px',
    borderRadius: '4px',
    height: '36px',
    backgroundColor: '#fafbfe',
    color: '#09121f',
  },
  '& fieldset': { borderColor: '#e2e8f0' },
};

const UnsignedProgressNotesFilters = ({
  startDate,
  endDate,
  kindFilter,
  providerFilter,
  codeFilter,
  codeText,
  setStartDate,
  setEndDate,
  setKindFilter,
  setProviderFilter,
  setCodeFilter,
  setCodeText,
  providers,
  availableCodes = [],
  handleApply,
  handleClear,
}) => {
  const kindOptions = [
    { value: 'All', label: 'All' },
    { value: 'Exam', label: 'Exam' },
    { value: 'Recare', label: 'Recare' },
    { value: 'Treatment', label: 'Treatment' },
    { value: 'Conversation', label: 'Conversation' },
    { value: 'Soap', label: 'Soap' },
    { value: 'Progress', label: 'Progress' },
    { value: 'Clinical Note', label: 'Clinical Note' },
    { value: 'General', label: 'General' },
  ];

  const providerOptions = [
    { value: 'All', label: 'All' },
    ...(providers || []).map((p) => {
      const name = p.userId
        ? `${p.userId.firstName || ''} ${p.userId.lastName || ''}`.trim()
        : `${p.firstName || ''} ${p.lastName || ''}`.trim();
      return { value: p._id, label: name || 'Unnamed Provider' };
    }),
  ];

  const topFilters = (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box sx={{ display: 'flex', flexDirection: 'column' }}>
        <Typography variant="caption" sx={{ fontWeight: 600, color: '#4a5568', mb: 0.5, textTransform: 'capitalize' }}>
          start date
        </Typography>
        <DatePicker
          value={dayjs(startDate)}
          onChange={(v) => setStartDate(v ? v.format('YYYY-MM-DD') : '')}
          format="MM/DD/YYYY"
          slotProps={{ popper: { sx: { zIndex: 1400 } }, textField: { size: 'small', sx: DATE_PICKER_SX } }}
        />
      </Box>
      <Box sx={{ display: 'flex', flexDirection: 'column' }}>
        <Typography variant="caption" sx={{ fontWeight: 600, color: '#4a5568', mb: 0.5, textTransform: 'capitalize' }}>
          end date
        </Typography>
        <DatePicker
          value={dayjs(endDate)}
          onChange={(v) => setEndDate(v ? v.format('YYYY-MM-DD') : '')}
          format="MM/DD/YYYY"
          slotProps={{ popper: { sx: { zIndex: 1400 } }, textField: { size: 'small', sx: DATE_PICKER_SX } }}
        />
      </Box>
      <ReportSelect
        label="KIND"
        options={kindOptions}
        value={kindFilter}
        onChange={(e) => setKindFilter(e.target.value)}
        width="130px"
      />
      <ReportSelect
        label="PROVIDER"
        options={providerOptions}
        value={providerFilter}
        onChange={(e) => setProviderFilter(e.target.value)}
        width="160px"
      />
    </LocalizationProvider>
  );

  const bottomFilters = (
    <>
      <ReportSelect
        label="CODES FILTER"
        options={[
          { value: 'filter', label: 'Filter Codes' },
          { value: 'exclude', label: 'Enter Codes to Exclude' },
        ]}
        value={codeFilter}
        onChange={(e) => setCodeFilter(e.target.value)}
        width="180px"
      />
      <Box sx={{ pt: 2.5 }}>
        <Autocomplete
          freeSolo
          options={availableCodes}
          value={codeText}
          onChange={(event, newValue) => {
            setCodeText(newValue || '');
          }}
          onInputChange={(event, newInputValue) => {
            setCodeText(newInputValue || '');
          }}
          renderInput={(params) => (
            <TextField
              {...params}
              placeholder="Enter code or procedure"
              size="small"
              sx={{
                width: '250px',
                '& .MuiOutlinedInput-root': {
                  borderRadius: '8px',
                  backgroundColor: '#f8fafc',
                  minHeight: 36,
                  paddingTop: 0,
                  paddingBottom: 0,
                  fontSize: '0.75rem',
                  '& fieldset': { borderColor: '#e2e8f0' },
                }
              }}
              InputProps={{
                ...params.InputProps,
                startAdornment: (
                  <>
                    <InputAdornment position="start">
                      <SearchIcon sx={{ fontSize: 18, color: '#94a3b8', ml: 0.5 }} />
                    </InputAdornment>
                    {params.InputProps.startAdornment}
                  </>
                ),
              }}
            />
          )}
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

export default UnsignedProgressNotesFilters;
