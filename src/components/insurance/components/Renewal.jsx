import { Box, Typography, Grid, Select, MenuItem, Checkbox, FormControlLabel, TextField } from "@mui/material";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";

const Renewal = ({ 
  formData, 
  handleRenewalChange,
  inputBg
}) => {
  const hasDateError = formData.policyStarted && formData.policyEnds && new Date(formData.policyStarted) > new Date(formData.policyEnds);

  return (
    <Box>
      <Typography sx={{ fontWeight: 700, mt: 3, mb: 1.5, color: "#333", fontSize: '0.8rem' }}>Renewal</Typography>
      <Box sx={{ display: 'flex', gap: 2 }}>
        <TextField
          fullWidth
          type="date"
          label="Policy Started *"
          InputLabelProps={{ shrink: true }}
          value={formData.policyStarted || ''}
          onChange={(e) => {
            const val = e.target.value;
            if (val && formData.policyEnds && new Date(val) > new Date(formData.policyEnds)) {
              handleRenewalChange('policyStarted', formData.policyEnds);
            } else {
              handleRenewalChange('policyStarted', val);
            }
          }}
          size="small"
          error={!!hasDateError}
          helperText={hasDateError ? "Cannot be after End Date" : ""}
          InputProps={{ inputProps: { max: formData.policyEnds || undefined } }}
          sx={{ 
            flex: 1,
            bgcolor: inputBg,
            '& .MuiInputBase-root': { fontSize: '0.7rem' },
            '& .MuiInputLabel-root': { fontSize: '0.7rem' },
            '& .MuiFormHelperText-root': { fontSize: '0.6rem' }
          }}
        />
        <TextField
          fullWidth
          type="date"
          label="Policy Ends"
          InputLabelProps={{ shrink: true }}
          value={formData.policyEnds || ''}
          onChange={(e) => {
            const val = e.target.value;
            if (val && formData.policyStarted && new Date(val) < new Date(formData.policyStarted)) {
              handleRenewalChange('policyEnds', formData.policyStarted);
            } else {
              handleRenewalChange('policyEnds', val);
            }
          }}
          size="small"
          error={!!hasDateError}
          helperText={hasDateError ? "Cannot be before Start Date" : ""}
          InputProps={{ inputProps: { min: formData.policyStarted || undefined } }}
          sx={{ 
            flex: 1,
            bgcolor: inputBg,
            '& .MuiInputBase-root': { fontSize: '0.7rem' },
            '& .MuiInputLabel-root': { fontSize: '0.7rem' },
            '& .MuiFormHelperText-root': { fontSize: '0.6rem' }
          }}
        />
      </Box>
      <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
        <TextField
          select
          fullWidth
          label="Renewal Month *"
          size="small"
          value={formData.renewalMonth || ''}
          onChange={(e) => handleRenewalChange('renewalMonth', e.target.value)}
          sx={{ 
            flex: 1,
            bgcolor: inputBg,
            '& .MuiInputBase-root': { fontSize: '0.7rem' },
            '& .MuiInputLabel-root': { fontSize: '0.7rem' }
          }}
        >
          {['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'].map(month => (
            <MenuItem key={month} value={month} sx={{ fontSize: '0.7rem' }}>{month}</MenuItem>
          ))}
        </TextField>
        <Box sx={{ flex: 1 }} />
      </Box>
      
      {/* Auto Renewal Checkbox */}
      <Grid container sx={{ mt: 1.5 }}>
        <Grid item>
          <FormControlLabel
            control={
              <Checkbox
                checked={formData.autoRenewal || false}
                onChange={(e) => handleRenewalChange('autoRenewal', e.target.checked)}
                size="small"
                sx={{ 
                  padding: '4px',
                  '& .MuiSvgIcon-root': { fontSize: '0.9rem' }
                }}
              />
            }
            label={
              <Typography sx={{ 
                fontSize: '0.7rem', 
                fontWeight: 600, 
                color: '#666',
                ml: 0.5
              }}>
                Auto Renewal
              </Typography>
            }
            sx={{ 
              ml: 0,
              '& .MuiFormControlLabel-label': {
                fontSize: '0.7rem'
              }
            }}
          />
        </Grid>
      </Grid>
    </Box>
  );
};

export default Renewal;
