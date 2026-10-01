import React, { useState, useEffect } from 'react';
import { Box, Typography, Autocomplete, TextField, Chip } from '@mui/material';
import { ReportFilterBar, ReportSelect, ReportDivider } from '../ui';
import { useSelector, useDispatch } from 'react-redux';
import { fetchCurrentPracticeInfo, selectPracticeInfo } from '../../../store/slices/practiceInfoSlice';

const PatientFlagsFilters = ({
  onApplyFilters,
  onClearAll,
  onCreateTemplate
}) => {
  const dispatch = useDispatch();
  const practiceInfo = useSelector(selectPracticeInfo);
  
  useEffect(() => {
    dispatch(fetchCurrentPracticeInfo());
  }, [dispatch]);

  const allFlags = practiceInfo?.patientFlags || [];

  const [draftFilters, setDraftFilters] = useState({
    filterBy: 'active',
    includeFlags: [],
    excludeFlags: []
  });

  const handleFilterChange = (key, value) => {
    setDraftFilters(prev => ({ ...prev, [key]: value }));
  };

  const handleApply = () => {
    if (onApplyFilters) onApplyFilters(draftFilters);
  };

  const handleClear = () => {
    const defaultFilters = {
      filterBy: 'active',
      includeFlags: [],
      excludeFlags: []
    };
    setDraftFilters(defaultFilters);
    if (onClearAll) onClearAll();
  };

  const renderFlagOption = (props, option) => (
    <Box component="li" {...props} sx={{ display: 'flex', alignItems: 'center' }}>
      <Box sx={{ width: 14, height: 14, bgcolor: option.color || '#ccc', borderRadius: '3px', mr: 1.5, flexShrink: 0 }} />
      {option.name}
    </Box>
  );

  const renderFlagTags = (value, getTagProps) =>
    value.map((option, index) => (
      <Chip
        {...getTagProps({ index })}
        size="small"
        icon={<Box sx={{ width: 10, height: 10, bgcolor: option.color || '#ccc', borderRadius: '50%', ml: 1 }} />}
        label={option.name}
        sx={{ bgcolor: '#fff', border: '1px solid #e2e8f0', borderRadius: '4px' }}
      />
    ));

  const topFilters = (
    <>
      <ReportSelect 
        label="Active Patients Only" 
        prefix="Filter Report By" 
        value={draftFilters.filterBy} 
        onChange={(e) => handleFilterChange('filterBy', e.target.value)} 
        options={[
          { value: 'active', label: 'Active Patients Only' },
          { value: 'all', label: 'All Patients' },
          { value: 'inactive', label: 'Inactive Patients Only' }
        ]} 
        width="180px"
      />

      <ReportDivider />

      <Box sx={{ display: 'flex', flexDirection: 'column' }}>
        <Typography variant="caption" sx={{ fontWeight: 600, color: '#4a5568', mb: 0.5, display: 'block', textTransform: 'uppercase' }}>Including Flags:</Typography>
        <Autocomplete
          multiple
          size="small"
          options={allFlags}
          groupBy={(option) => option.category}
          getOptionLabel={(option) => option.name}
          value={draftFilters.includeFlags}
          onChange={(e, newValue) => handleFilterChange('includeFlags', newValue)}
          renderOption={renderFlagOption}
          renderTags={renderFlagTags}
          renderInput={(params) => (
            <TextField 
              {...params} 
              placeholder="Select flags" 
              sx={{ 
                width: '280px',
                '& .MuiInputBase-root': { 
                  fontFamily: 'Inter', 
                  fontSize: '13px', 
                  borderRadius: '4px', 
                  backgroundColor: '#fafbfe',
                  color: '#09121f'
                },
                '& fieldset': { borderColor: '#e2e8f0' }
              }}
            />
          )}
        />
      </Box>

      <ReportDivider />

      <Box sx={{ display: 'flex', flexDirection: 'column' }}>
        <Typography variant="caption" sx={{ fontWeight: 600, color: '#4a5568', mb: 0.5, display: 'block', textTransform: 'uppercase' }}>Excluding Flags:</Typography>
        <Autocomplete
          multiple
          size="small"
          options={allFlags}
          groupBy={(option) => option.category}
          getOptionLabel={(option) => option.name}
          value={draftFilters.excludeFlags}
          onChange={(e, newValue) => handleFilterChange('excludeFlags', newValue)}
          renderOption={renderFlagOption}
          renderTags={renderFlagTags}
          renderInput={(params) => (
            <TextField 
              {...params} 
              placeholder="Select flags" 
              sx={{ 
                width: '280px',
                '& .MuiInputBase-root': { 
                  fontFamily: 'Inter', 
                  fontSize: '13px', 
                  borderRadius: '4px', 
                  backgroundColor: '#fafbfe',
                  color: '#09121f'
                },
                '& fieldset': { borderColor: '#e2e8f0' }
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
      onApplyFilters={handleApply}
      onClearAll={handleClear}
      onCreateTemplate={onCreateTemplate}
    />
  );
};

export default PatientFlagsFilters;
