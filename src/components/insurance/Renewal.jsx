import React from "react";
import { Box, Typography, Grid, Select, MenuItem, Checkbox, FormControlLabel } from "@mui/material";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";

const Renewal = ({ 
  formData, 
  handleRenewalChange,
  inputBg
}) => {
  return (
    <Box>
      <Typography sx={{ fontWeight: 700, mt: 3, mb: 1.5, color: "#333", fontSize: '0.8rem' }}>Renewal</Typography>
      <Grid container spacing={2}>
        <Grid item xs={4}>
          <Typography sx={{ fontSize: '0.65rem', fontWeight: 600, color: '#666', mb: 0.5 }}>Policy Started *</Typography>
          <input
            type="date"
            value={formData.policyStarted}
            onChange={(e) => handleRenewalChange('policyStarted', e.target.value)}
            style={{
              padding: '8px 12px',
              fontSize: '0.7rem',
              border: '1px solid #ccc',
              borderRadius: '4px',
              backgroundColor: inputBg,
              width: '100%',
              fontFamily: 'inherit',
              color: '#333'
            }}
          />
        </Grid>
        <Grid item xs={4}>
          <Typography sx={{ fontSize: '0.65rem', fontWeight: 600, color: '#666', mb: 0.5 }}>Policy Ends</Typography>
          <input
            type="date"
            value={formData.policyEnds}
            onChange={(e) => handleRenewalChange('policyEnds', e.target.value)}
            style={{
              padding: '8px 12px',
              fontSize: '0.7rem',
              border: '1px solid #ccc',
              borderRadius: '4px',
              backgroundColor: inputBg,
              width: '100%',
              fontFamily: 'inherit',
              color: '#333'
            }}
          />
        </Grid>
      </Grid>
      <Grid container spacing={2} sx={{ mt: 0.5 }}>
        <Grid item xs={4}>
          <Typography sx={{ fontSize: '0.65rem', fontWeight: 600, color: '#666', mb: 0.5 }}>Renewal Month *</Typography>
          <Select 
            fullWidth 
            size="small" 
            value={formData.renewalMonth}
            onChange={(e) => handleRenewalChange('renewalMonth', e.target.value)}
            sx={{ 
              bgcolor: inputBg,
              fontSize: '0.7rem',
              '& .MuiSelect-select': { 
                py: 0.8,
                display: 'flex', 
                alignItems: 'center',
                fontSize: '0.7rem'
              }
            }}
          >
            {['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'].map(month => (
              <MenuItem key={month} value={month} sx={{ fontSize: '0.7rem' }}>{month}</MenuItem>
            ))}
          </Select>
        </Grid>
      </Grid>
      
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
