import React, { useState } from 'react';
import { Box, Typography } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';
import { ReportFilterBar, ReportCheckbox } from '../ui';

const CancelledAppointmentsFilters = ({
  onApplyFilters,
  onCreateTemplate
}) => {
  const [draftFilters, setDraftFilters] = useState({
    startDate: dayjs(),
    endDate: dayjs(),
    showInactive: false
  });

  const handleApply = () => {
    if (onApplyFilters) onApplyFilters(draftFilters);
  };

  const topFilters = (
    <>
      <Box sx={{ display: 'flex', alignItems: 'flex-end', gap: 1 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
          <Typography variant="caption" sx={{ fontWeight: 600, color: '#4a5568', mb: 0.5, display: 'block', textTransform: 'capitalize' }}>
            start date
          </Typography>
          <DatePicker
            value={draftFilters.startDate}
            onChange={(newValue) => setDraftFilters(prev => ({ ...prev, startDate: newValue }))}
            format="MM/DD/YYYY"
            slotProps={{ 
              popper: { sx: { zIndex: 1400 } },
              textField: { 
                size: 'small', 
                sx: { 
                  width: '180px',
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
      
      <Box sx={{ display: 'flex', alignItems: 'flex-end', gap: 1 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
          <Typography variant="caption" sx={{ fontWeight: 600, color: '#4a5568', mb: 0.5, display: 'block', textTransform: 'capitalize' }}>
            end date
          </Typography>
          <DatePicker
            value={draftFilters.endDate}
            onChange={(newValue) => setDraftFilters(prev => ({ ...prev, endDate: newValue }))}
            format="MM/DD/YYYY"
            slotProps={{ 
              popper: { sx: { zIndex: 1400 } },
              textField: { 
                size: 'small', 
                sx: { 
                  width: '180px',
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

      <ReportCheckbox 
        label="Show Inactive Patients" 
        checked={draftFilters.showInactive} 
        onChange={(e) => setDraftFilters(prev => ({ ...prev, showInactive: e.target.checked }))} 
      />
    </>
  );

  return (
    <ReportFilterBar 
      topRowFilters={topFilters}
      onApplyFilters={handleApply}
      onCreateTemplate={onCreateTemplate}
      hideClearButton={true}
    />
  );
};

export default CancelledAppointmentsFilters;
