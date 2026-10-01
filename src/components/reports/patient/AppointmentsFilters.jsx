import React, { useState, useMemo } from 'react';
import { Box, Typography, RadioGroup, FormControlLabel, Radio } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';
import { ReportFilterBar, ReportSelect, ReportCheckbox } from '../ui';
import { useSelector } from 'react-redux';
import { selectProviderDropdownList } from '../../../store/slices/providerSlice';

const AppointmentsFilters = ({
  onApplyFilters,
  onCreateTemplate
}) => {
  const providerList = useSelector(selectProviderDropdownList);

  const providerOptions = useMemo(() => [
    { value: 'all', label: 'Select Provider' },
    ...(providerList || []).map((p) => {
      const first = p.userId?.firstName || p.firstName || p.FName || '';
      const last = p.userId?.lastName || p.lastName || p.LName || '';
      const name = `${first} ${last}`.trim() || p.providerCode || p._id || 'Unknown';
      return { value: p._id || p.id || p.ProvNum || name, label: name };
    }),
  ], [providerList]);

  const apptStatusOptions = [
    { value: 'all', label: 'Select Status' },
    { value: 'scheduled', label: 'Scheduled' },
    { value: 'complete', label: 'CheckedoutCompleted' },
    { value: 'broken', label: 'Broken' },
    { value: 'cancelled', label: 'Cancelled' },
  ];

  const [draftFilters, setDraftFilters] = useState({
    dateType: 'aptDate',
    startDate: dayjs('2026-04-08'),
    endDate: dayjs('2026-05-08'),
    provider: 'all',
    status: 'all',
    locationType: 'office',
    includeShortlisted: false,
    flagFilter: 'all'
  });

  const handleApply = () => {
    if (onApplyFilters) onApplyFilters(draftFilters);
  };

  const updateFilter = (key, value) => {
    setDraftFilters(prev => ({ ...prev, [key]: value }));
  };

  const topFilters = (
    <>
      <Box sx={{ display: 'flex', alignItems: 'flex-end', gap: 1 }}>
        <RadioGroup row value={draftFilters.dateType} onChange={(e) => updateFilter('dateType', e.target.value)} sx={{ flexWrap: 'nowrap' }}>
          <FormControlLabel 
            value="aptDate" 
            control={<Radio size="small" />} 
            label={<Typography sx={{ fontSize: '0.8rem', fontWeight: 600, color: '#1e293b', whiteSpace: 'nowrap' }}>Appointment Date:</Typography>} 
            sx={{ m: 0 }}
          />
          <FormControlLabel 
            value="created" 
            control={<Radio size="small" />} 
            label={<Typography sx={{ fontSize: '0.8rem', fontWeight: 600, color: '#1e293b', whiteSpace: 'nowrap' }}>Created Date:</Typography>} 
            sx={{ m: 0 }}
          />
        </RadioGroup>
        
        <ReportSelect defaultValue="range" options={[{ value: 'range', label: 'Range' }, { value: 'today', label: 'Today' }, { value: 'yesterday', label: 'Yesterday' }, { value: 'last7', label: 'Last 7 Days' }]} width="100px" />
        
        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
          <Typography variant="caption" sx={{ fontWeight: 600, color: '#4a5568', mb: 0.5, display: 'block', textTransform: 'capitalize' }}>
            start date
          </Typography>
          <DatePicker
            value={draftFilters.startDate}
            onChange={(newValue) => updateFilter('startDate', newValue)}
            format="MM/DD/YYYY"
            slotProps={{ 
              popper: { sx: { zIndex: 1400 } },
              textField: { 
                size: 'small', 
                sx: { 
                  width: '130px',
                  '& .MuiInputBase-root': { 
                    fontFamily: 'Inter', 
                    fontSize: '13px', 
                    borderRadius: '4px', 
                    height: '32px', 
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
            value={draftFilters.endDate}
            onChange={(newValue) => updateFilter('endDate', newValue)}
            format="MM/DD/YYYY"
            slotProps={{ 
              popper: { sx: { zIndex: 1400 } },
              textField: { 
                size: 'small', 
                sx: { 
                  width: '130px',
                  '& .MuiInputBase-root': { 
                    fontFamily: 'Inter', 
                    fontSize: '13px', 
                    borderRadius: '4px', 
                    height: '32px', 
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
      </Box>

      <ReportSelect 
        value={draftFilters.provider} 
        onChange={(e) => updateFilter('provider', e.target.value)} 
        options={providerOptions} 
        width="160px" 
      />
      <ReportSelect 
        value={draftFilters.status} 
        onChange={(e) => updateFilter('status', e.target.value)} 
        options={apptStatusOptions} 
        width="160px" 
      />
    </>
  );

  const bottomFilters = (
    <>
      <ReportSelect 
        value={draftFilters.locationType} 
        onChange={(e) => updateFilter('locationType', e.target.value)} 
        options={[{ value: 'office', label: 'Office View' }]} 
        width="150px" 
      />
      <ReportCheckbox 
        label="Include Shortlisted" 
        checked={draftFilters.includeShortlisted} 
        onChange={(e) => updateFilter('includeShortlisted', e.target.checked)} 
      />
      <Box sx={{ flexGrow: 1 }} />
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <Typography variant="caption" sx={{ fontWeight: 600, color: '#4a5568' }}>Flag filter:</Typography>
        <ReportSelect 
          value={draftFilters.flagFilter} 
          onChange={(e) => updateFilter('flagFilter', e.target.value)} 
          options={[
            { value: 'all', label: 'All Flags' },
            { value: 'withFlags', label: 'With Flags' },
            { value: 'withoutFlags', label: 'Without Flags' }
          ]} 
          width="130px" 
        />
      </Box>
    </>
  );

  return (
    <ReportFilterBar 
      topRowFilters={topFilters}
      bottomRowFilters={bottomFilters}
      onApplyFilters={handleApply}
      onCreateTemplate={onCreateTemplate}
    />
  );
};

export default AppointmentsFilters;
