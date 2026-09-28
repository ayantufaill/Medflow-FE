import React, { useState, useEffect, useMemo } from 'react';
import { Box, Typography, TextField, Autocomplete } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';
import { ReportFilterBar, ReportSelect, ReportDivider } from '../ui';

const CollectionCodeCarrierFilters = ({
  reportData,
  onApplyFilters,
  onClearAll
}) => {
  const initialStartDate = new Date().toISOString().split('T')[0];
  const initialEndDate = new Date().toISOString().split('T')[0];

  const [draftFilters, setDraftFilters] = useState({
    dateRange: 'daily',
    startDate: initialStartDate,
    endDate: initialEndDate,
    codeFilter: 'filter',
    codeText: ''
  });

  const uniqueCodes = useMemo(() => {
    if (!reportData || !Array.isArray(reportData)) return [];
    const map = new Map();
    reportData.forEach(r => {
      if (r.code) {
        map.set(r.code, { code: r.code, desc: r.procedure || '' });
      }
    });
    return Array.from(map.values()).sort((a, b) => a.code.localeCompare(b.code));
  }, [reportData]);

  const getLocalDateString = (d) => {
    const offset = d.getTimezoneOffset() * 60000;
    return new Date(d.getTime() - offset).toISOString().split('T')[0];
  };

  const handleFilterChange = (key, value) => {
    setDraftFilters(prev => ({ ...prev, [key]: value }));
  };

  const handleFilterModeChange = (e) => {
    const newMode = e.target.value;
    handleFilterChange('dateRange', newMode);
    
    if (newMode === 'range') return;

    const today = new Date();
    let start = new Date(today);
    let end = new Date(today);

    switch (newMode) {
      case 'daily':
        break;
      case 'this_week': {
        const day = today.getDay();
        const diff = today.getDate() - day + (day === 0 ? -6 : 1);
        start = new Date(today);
        start.setDate(diff);
        end = new Date(start);
        end.setDate(start.getDate() + 6);
        break;
      }
      case 'this_month':
      case 'month_to_date': {
        start = new Date(today.getFullYear(), today.getMonth(), 1);
        end = newMode === 'this_month' ? new Date(today.getFullYear(), today.getMonth() + 1, 0) : new Date(today);
        break;
      }
      case 'last_7_days': {
        start = new Date(today);
        start.setDate(today.getDate() - 7);
        break;
      }
      case 'last_week': {
        const day = today.getDay();
        const diffToLastWeekStart = today.getDate() - day - 7 + (day === 0 ? -6 : 1);
        start = new Date(today);
        start.setDate(diffToLastWeekStart);
        end = new Date(start);
        end.setDate(start.getDate() + 6);
        break;
      }
      case 'last_4_weeks': {
        start = new Date(today);
        start.setDate(today.getDate() - 28);
        break;
      }
      case 'last_month': {
        start = new Date(today.getFullYear(), today.getMonth() - 1, 1);
        end = new Date(today.getFullYear(), today.getMonth(), 0);
        break;
      }
      case 'last_3_months': {
        start = new Date(today);
        start.setMonth(today.getMonth() - 3);
        break;
      }
      case 'last_12_months': {
        start = new Date(today);
        start.setFullYear(today.getFullYear() - 1);
        break;
      }
      case 'quarter_to_date': {
        const quarter = Math.floor(today.getMonth() / 3);
        start = new Date(today.getFullYear(), quarter * 3, 1);
        break;
      }
      case 'year_to_date': {
        start = new Date(today.getFullYear(), 0, 1);
        break;
      }
      case 'last_year': {
        start = new Date(today.getFullYear() - 1, 0, 1);
        end = new Date(today.getFullYear() - 1, 11, 31);
        break;
      }
      default:
        break;
    }
    
    setDraftFilters(prev => ({
      ...prev,
      startDate: getLocalDateString(start),
      endDate: getLocalDateString(end)
    }));
  };

  const handleApply = () => {
    if (onApplyFilters) onApplyFilters(draftFilters);
  };

  const handleClear = () => {
    const defaultFilters = {
      dateRange: 'daily',
      startDate: initialStartDate,
      endDate: initialEndDate,
      codeFilter: 'filter',
      codeText: ''
    };
    setDraftFilters(defaultFilters);
    if (onClearAll) onClearAll();
    if (onApplyFilters) onApplyFilters(defaultFilters);
  };

  useEffect(() => {
    if (onApplyFilters) onApplyFilters(draftFilters);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
        value={draftFilters.dateRange}
        onChange={handleFilterModeChange}
      />
      <Box sx={{ display: 'flex', flexDirection: 'column' }}>
        <Typography variant="caption" sx={{ fontWeight: 600, color: '#4a5568', mb: 0.5, display: 'block', textTransform: 'capitalize' }}>
          start date
        </Typography>
        <DatePicker
          value={dayjs(draftFilters.startDate)}
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
          value={dayjs(draftFilters.endDate)}
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
        label="CODES FILTER"
        options={[
          { value: 'filter', label: 'Filter Codes' },
          { value: 'exclude', label: 'Enter Codes to Exclude' },
        ]}
        value={draftFilters.codeFilter}
        onChange={(e) => handleFilterChange('codeFilter', e.target.value)}
      />
      <Box sx={{ display: 'flex', flexDirection: 'column', pt: 2.5, minWidth: 250 }}>
        <Autocomplete
          size="small"
          options={uniqueCodes}
          getOptionLabel={(opt) => `${opt.code} - ${opt.desc}`}
          value={uniqueCodes.find(c => c.code === draftFilters.codeText) || null}
          onChange={(e, newVal) => {
            handleFilterChange('codeText', newVal ? newVal.code : '');
          }}
          renderInput={(params) => (
            <TextField
              {...params}
              placeholder={!draftFilters.codeText ? "Enter code or procedure" : ""}
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
          sx={{ width: '100%' }}
        />
      </Box>
    </>
  );

  return (
    <ReportFilterBar 
      topRowFilters={topFilters}
      onApplyFilters={handleApply}
      onClearAll={handleClear}
      onCreateTemplate={() => {}}
    />
  );
};

export default CollectionCodeCarrierFilters;
