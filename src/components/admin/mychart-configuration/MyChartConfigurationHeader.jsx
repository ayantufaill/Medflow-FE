import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Box,
  Typography,
  Button,
} from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';

const MyChartConfigurationHeader = ({ onSave }) => {
  return (
    <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
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
      <Button 
        variant="contained" 
        color="success" 
        startIcon={<SaveIcon />}
        onClick={onSave}
        sx={{ borderRadius: 5, textTransform: 'none', px: 3 }}
      >
        Save Configuration
      </Button>
    </Box>
  );
};

export default MyChartConfigurationHeader;
