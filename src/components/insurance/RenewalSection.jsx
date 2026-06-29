import { Box, Typography, TextField, MenuItem, Stack } from "@mui/material";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";

const RenewalSection = ({ 
  formData, 
  handleRenewalChange,
  inputBg
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
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', bgcolor: '#f8f9fc', p: 2, borderBottom: '1px solid #DFE5EC' }}>
        <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'center' }}>
          <Box sx={{ bgcolor: '#e6f0fd', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', width: 40, height: 40 }}>
             <CalendarTodayIcon sx={{ fontSize: 20, color: '#2563eb' }} />
          </Box>
          <Box>
            <Typography sx={{ fontWeight: 600, color: "#111827", fontSize: "1rem", mb: 0.1, letterSpacing: '-0.3px' }}>
              Renewal
            </Typography>
            <Typography sx={{ fontSize: '0.75rem', color: '#6b7280' }}>
              Policy term and renewal month
            </Typography>
          </Box>
        </Box>
        <Box sx={{ bgcolor: '#e6f0fd', px: 1.5, py: 0.5, borderRadius: '50px', height: 'fit-content' }}>
          <Typography sx={{ fontSize: '0.65rem', fontWeight: 700, color: '#2563eb', letterSpacing: '0.8px', textTransform: 'uppercase' }}>REQUIRED</Typography>
        </Box>
      </Box>
      <Box sx={{ p: 2 }}>
      <Stack spacing={1.5} sx={{ mt: 1 }}>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Box sx={{ flex: 1 }}>
            <Typography sx={{ fontSize: '0.65rem', fontWeight: 700, color: '#555', mb: 0.5, textTransform: 'uppercase' }}>
              Policy Started <span style={{ color: '#d32f2f' }}>*</span>
            </Typography>
            <TextField
              fullWidth
              type="date"
              InputLabelProps={{ shrink: true }}
              value={formData.policyStarted || ''}
              onChange={(e) => handleRenewalChange('policyStarted', e.target.value)}
              size="small"
              sx={{ 
                bgcolor: '#f8f9fc',
                '& .MuiInputBase-root': { fontSize: '0.75rem', height: '36px' },
                '& fieldset': { borderColor: '#DFE5EC' }
              }}
            />
          </Box>
          <Box sx={{ flex: 1 }}>
            <Typography sx={{ fontSize: '0.65rem', fontWeight: 700, color: '#555', mb: 0.5, textTransform: 'uppercase' }}>
              Policy Ends
            </Typography>
            <TextField
              fullWidth
              type="date"
              InputLabelProps={{ shrink: true }}
              value={formData.policyEnds || ''}
              onChange={(e) => handleRenewalChange('policyEnds', e.target.value)}
              size="small"
              sx={{ 
                bgcolor: '#f8f9fc',
                '& .MuiInputBase-root': { fontSize: '0.75rem', height: '36px' },
                '& fieldset': { borderColor: '#DFE5EC' }
              }}
            />
          </Box>
        </Box>

        <Box>
          <Typography sx={{ fontSize: '0.65rem', fontWeight: 700, color: '#555', mb: 0.5, textTransform: 'uppercase' }}>
            Renewal Month <span style={{ color: '#d32f2f' }}>*</span>
          </Typography>
          <TextField
            select
            fullWidth
            value={formData.renewalMonth || ''}
            onChange={(e) => handleRenewalChange('renewalMonth', e.target.value)}
            size="small"
            sx={{ 
              bgcolor: '#f8f9fc',
              '& .MuiInputBase-root': { fontSize: '0.75rem', height: '36px' },
              '& fieldset': { borderColor: '#DFE5EC' }
            }}
          >
            {['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'].map(month => (
              <MenuItem key={month} value={month} sx={{ fontSize: '0.75rem' }}>{month}</MenuItem>
            ))}
          </TextField>
        </Box>
      </Stack>
      </Box>
    </Box>
  );
};

export default RenewalSection;
