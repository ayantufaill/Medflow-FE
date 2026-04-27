import React, { useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Box,
  Typography,
  Button,
  Grid,
  Divider,
  Switch,
  FormControlLabel,
  Checkbox,
  Radio,
  RadioGroup,
  TextField,
  Paper,
  IconButton,
  Tooltip,
} from '@mui/material';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';

// Reusable component for the repeated "Label + Switch + Required/Optional" pattern
const ConfigRow = ({ label, hasInfo = false, showStatus = true, defaultRequired = "optional" }) => (
  <Box sx={{ mb: 3 }}>
    <Box display="flex" justifyContent="space-between" alignItems="center">
      <Box display="flex" alignItems="center">
        <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>{label}</Typography>
        {hasInfo && (
          <Tooltip title="Information">
            <InfoOutlinedIcon sx={{ fontSize: 16, ml: 0.5, color: 'text.secondary' }} />
          </Tooltip>
        )}
      </Box>
      <Switch size="small" defaultChecked />
    </Box>
    {showStatus && (
      <Box sx={{ ml: 0.5 }}>
        <Typography variant="caption" color="textSecondary">Required Settings:</Typography>
        <RadioGroup row defaultValue={defaultRequired}>
          <FormControlLabel value="required" control={<Radio size="small" />} label={<Typography variant="body2">Required</Typography>} />
          <FormControlLabel value="optional" control={<Radio size="small" />} label={<Typography variant="body2">Optional</Typography>} />
        </RadioGroup>
      </Box>
    )}
  </Box>
);

const MyChartConfiguration = () => {
  return (
    <Box sx={{ 
      p: { xs: 2, md: 4 }, 
      bgcolor: '#f4f6f8', 
      minHeight: '100vh', 
      fontFamily: "'Manrope', 'Segoe UI', sans-serif",
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center'
    }}>
      <Box sx={{ width: '100%', maxWidth: 1400 }}>
      <Box sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 0.5 }}>
        <Typography
          variant="caption"
          component={RouterLink}
          to="/admin/practice-setup"
          sx={{ color: 'primary.main', textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}
        >
          Practice Setup
        </Typography>
        <Typography variant="caption" color="textSecondary">{'>'}</Typography>
        <Typography variant="caption" color="textSecondary">MyChart Configuration</Typography>
      </Box>

      <Grid container spacing={3}>
        {/* LEFT COLUMN: Visuals & Payments */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, mb: 3, borderRadius: 2 }}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
              <Typography variant="h6" fontWeight="bold">Colors</Typography>
              <Button variant="outlined" size="small" sx={{ textTransform: 'none' }}>Reset Colors</Button>
            </Box>
            
            {['Primary Font Color', 'Secondary Font Color', 'Page Background Color', 'Section Background Color', 'Primary Color', 'Secondary Color'].map((label) => (
              <Box key={label} display="flex" justifyContent="space-between" alignItems="center" mb={1.5}>
                <Typography variant="body2">{label}</Typography>
                <Box sx={{ width: 24, height: 24, border: '1px solid #ddd', borderRadius: 0.5, bgcolor: label.includes('Primary') ? '#333' : '#fff' }} />
              </Box>
            ))}

            <Divider sx={{ my: 3 }} />

            <Typography variant="h6" fontWeight="bold" gutterBottom>Patient Payment</Typography>
            <Box display="flex" flexDirection="column">
              <FormControlLabel control={<Checkbox defaultChecked />} label={<Typography variant="body2">Include ACH Payment</Typography>} />
              <FormControlLabel control={<Checkbox />} label={<Typography variant="body2">Add payment as a quick deposit</Typography>} />
              <FormControlLabel control={<Checkbox defaultChecked />} label={<Typography variant="body2">Allow patient to edit quick payment amount</Typography>} />
            </Box>

            <Divider sx={{ my: 3 }} />

            <Typography variant="h6" fontWeight="bold" gutterBottom>Google Measurement ID Setup</Typography>
            <TextField fullWidth size="small" placeholder="G-XXXXXXXXXX" sx={{ maxWidth: 350, mt: 1 }} />
          </Paper>
        </Grid>

        {/* RIGHT COLUMN: Patient Info & General Sections */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, borderRadius: 2 }}>
            <Typography variant="h6" fontWeight="bold">Confidential Information</Typography>
            <Typography variant="caption" color="textSecondary" sx={{ mb: 3, display: 'block' }}>
              Setting up the configuration here will apply to MyChart and Oryx Docs
            </Typography>

            <ConfigRow label="Patient's Legal Name" hasInfo defaultRequired="optional" />
            
            <ConfigRow label="Preferred Pronouns" showStatus={false} />

            <Divider sx={{ my: 2 }} />

            <Box sx={{ mb: 4 }}>
              <Box display="flex" justifyContent="space-between" alignItems="center">
                <Box display="flex" alignItems="center">
                  <Typography variant="subtitle2" fontWeight="bold">Patient's Information</Typography>
                  <InfoOutlinedIcon sx={{ fontSize: 16, ml: 0.5, color: 'text.secondary' }} />
                </Box>
                <Switch size="small" defaultChecked />
              </Box>
              
              <Box sx={{ ml: 3, mt: 2 }}>
                <Box display="flex" justifyContent="space-between" alignItems="center">
                  <Typography variant="body2" fontWeight="500">Gender Identity (for adults only)</Typography>
                  <Switch size="small" defaultChecked />
                </Box>
                <Typography variant="caption" color="textSecondary">Select gender options:</Typography>
                <Grid container>
                  {['Male/Man', 'Female/Woman', 'Trans Male', 'Trans Female', 'Nonbinary', 'Another Gender', 'Decline'].map((g) => (
                    <Grid item xs={6} key={g}>
                      <FormControlLabel control={<Checkbox size="small" defaultChecked />} label={<Typography variant="caption">{g}</Typography>} />
                    </Grid>
                  ))}
                </Grid>
              </Box>

              <ConfigRow label="Marital Status" hasInfo defaultRequired="optional" />
            </Box>

            <Typography variant="h6" fontWeight="bold" sx={{ mt: 4, mb: 2 }}>Patient's Phone Number</Typography>
            <ConfigRow label="Home Phone Number" defaultRequired="required" />
            <ConfigRow label="Work Phone Number" defaultRequired="optional" />

            <Typography variant="h6" fontWeight="bold" sx={{ mt: 4, mb: 2 }}>General Sections</Typography>
            <ConfigRow label="Additional Info (for pedo only)" hasInfo defaultRequired="optional" />
            <ConfigRow label="Emergency Contact Information" hasInfo defaultRequired="required" />
            <ConfigRow label="Release Information" hasInfo defaultRequired="required" />
            <ConfigRow label="Spouse Information" hasInfo defaultRequired="optional" />
            
            <Box display="flex" justifyContent="space-between" alignItems="center" mt={2}>
               <Box display="flex" alignItems="center">
                 <Typography variant="subtitle2" fontWeight="bold">Dental Insurance And Financial Information</Typography>
                 <InfoOutlinedIcon sx={{ fontSize: 16, ml: 0.5, color: 'text.secondary' }} />
               </Box>
               <Switch size="small" defaultChecked />
            </Box>
          </Paper>
        </Grid>
      </Grid>
      </Box>
    </Box>
  );
};

export default MyChartConfiguration;
