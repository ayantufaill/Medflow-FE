import React, { useState, useEffect } from 'react';
import { Box, Typography, Checkbox, FormControlLabel } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';
import { ReportFilterBar, ReportSelect, ReportDivider } from '../ui';

const ReferralProductionFilters = ({
  onApplyFilters,
  onClearAll
}) => {
  const initialStartDate = new Date(new Date().getFullYear(), 0, 1).toISOString().split('T')[0];
  const initialEndDate = new Date().toISOString().split('T')[0];

  const [draftFilters, setDraftFilters] = useState({
    dateRange: 'this_year',
    startDate: initialStartDate,
    endDate: initialEndDate,
    showTrend: false
  });

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
      case 'today':
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
      case 'this_month': {
        start = new Date(today.getFullYear(), today.getMonth(), 1);
        end = new Date(today.getFullYear(), today.getMonth() + 1, 0);
        break;
      }
      case 'this_year': {
        start = new Date(today.getFullYear(), 0, 1);
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
      dateRange: 'this_year',
      startDate: initialStartDate,
      endDate: initialEndDate,
      showTrend: false
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
          { value: 'today', label: 'Today' },
          { value: 'this_week', label: 'This Week' },
          { value: 'this_month', label: 'This Month' },
          { value: 'this_year', label: 'This Year' },
          { value: 'range', label: 'Range' },
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

      <Box sx={{ display: 'flex', alignItems: 'center', height: '100%', pt: 2.5 }}>
        <FormControlLabel
          control={
            <Checkbox
              size="small"
              checked={draftFilters.showTrend}
              onChange={(e) => handleFilterChange('showTrend', e.target.checked)}
              sx={{ color: '#94a3b8', '&.Mui-checked': { color: '#3b82f6' } }}
            />
          }
          label={<Typography sx={{ fontSize: '13px', fontWeight: 500, color: '#1e293b' }}>Show Trend</Typography>}
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

export default ReferralProductionFilters;
