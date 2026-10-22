import { Box, Typography, TextField, MenuItem, Stack } from "@mui/material";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import FormInput from './FormInput';

const dateFieldSx = {
  bgcolor: '#f8f9fc',
  '& .MuiInputBase-root': {
    fontSize: '14px',
    height: '36px'
  },
  '& fieldset': { borderColor: '#DFE5EC' },
};

const RenewalSection = ({ 
  formData, 
  handleRenewalChange,
  inputBg,
  errors = {}
}) => {
  return (
    <Box sx={{ 
      border: '1px solid #DFE5EC', 
      borderRadius: '12px', 
      backgroundColor: '#FFFFFF', 
      display: 'flex', 
      flexDirection: 'column',
      width: '100%',
      boxSizing: 'border-box',
      overflow: 'hidden'
    }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', bgcolor: '#f8f9fc', p: 1.5, borderBottom: '1px solid #DFE5EC' }}>
        <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'center' }}>
          <Box sx={{ bgcolor: '#e6f0fd', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', width: 32, height: 32 }}>
             <CalendarTodayIcon sx={{ fontSize: 16, color: '#2563eb' }} />
          </Box>
          <Box>
            <Typography sx={{ fontWeight: 600, color: "#111827", fontSize: "0.9rem", mb: 0.1, letterSpacing: '-0.3px' }}>
              Renewal
            </Typography>
            <Typography sx={{ fontSize: '0.7rem', color: '#6b7280' }}>
              Policy term and renewal month
            </Typography>
          </Box>
        </Box>
        <Box sx={{ bgcolor: '#f3f4f6', px: 1.5, py: 0.5, borderRadius: '50px', height: 'fit-content' }}>
          <Typography sx={{ fontSize: '0.6rem', fontWeight: 700, color: '#2563eb', letterSpacing: '0.8px', textTransform: 'uppercase' }}>REQUIRED</Typography>
        </Box>
      </Box>
      <Box sx={{ p: 1.5 }}>
      <Stack spacing={1.5} sx={{ mt: 1 }}>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Box sx={{ flex: '0 1 210px', maxWidth: 210, minWidth: 0 }}>
            <FormInput
              label="Policy Started"
              required
              renderInput={() => (
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DatePicker
                    format="MM/DD/YYYY"
                    value={formData.policyStarted ? dayjs(formData.policyStarted) : null}
                    onChange={(newValue) => handleRenewalChange('policyStarted', newValue ? newValue.format('YYYY-MM-DD') : '')}
                    slotProps={{
                      textField: {
                        fullWidth: true,
                        size: 'small',
                        error: !!errors.policyStarted,
                        helperText: errors.policyStarted,
                        sx: dateFieldSx
                      }
                    }}
                  />
                </LocalizationProvider>
              )}
            />
          </Box>
          <Box sx={{ flex: '0 1 210px', maxWidth: 210, minWidth: 0 }}>
            <FormInput
              label="Policy Ends"
              renderInput={() => (
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DatePicker
                    format="MM/DD/YYYY"
                    value={formData.policyEnds ? dayjs(formData.policyEnds) : null}
                    onChange={(newValue) => handleRenewalChange('policyEnds', newValue ? newValue.format('YYYY-MM-DD') : '')}
                    slotProps={{
                      textField: {
                        fullWidth: true,
                        size: 'small',
                        error: !!errors.policyEnds,
                        helperText: errors.policyEnds,
                        sx: dateFieldSx
                      }
                    }}
                  />
                </LocalizationProvider>
              )}
            />
          </Box>
        </Box>

        <FormInput
          select
          label="Renewal Month"
          required
          value={formData.renewalMonth || ''}
          onChange={(e) => handleRenewalChange('renewalMonth', e.target.value)}
          error={!!errors.renewalMonth}
          helperText={errors.renewalMonth}
        >
          {['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'].map(month => (
            <MenuItem key={month} value={month} sx={{ fontSize: '14px' }}>{month}</MenuItem>
          ))}
        </FormInput>
      </Stack>
      </Box>
    </Box>
  );
};

export default RenewalSection;
