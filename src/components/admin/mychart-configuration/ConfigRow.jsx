import React from 'react';
import {
  Box,
  Typography,
  Switch,
  FormControlLabel,
  Radio,
  RadioGroup,
  Tooltip,
} from '@mui/material';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';

const ConfigRow = ({ 
  label, 
  hasInfo = false, 
  showStatus = true, 
  checked = true, 
  requiredStatus = 'optional',
  onChange,
  onRequiredStatusChange
}) => (
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
      <Switch 
        size="small" 
        checked={checked} 
        onChange={(e) => onChange && onChange(e.target.checked)}
      />
    </Box>
    {showStatus && (
      <Box sx={{ ml: 0.5 }}>
        <Typography variant="caption" color="textSecondary">Required Settings:</Typography>
        <RadioGroup 
          row 
          value={requiredStatus}
          onChange={(e) => onRequiredStatusChange && onRequiredStatusChange(e.target.value)}
        >
          <FormControlLabel value="required" control={<Radio size="small" />} label={<Typography variant="body2">Required</Typography>} />
          <FormControlLabel value="optional" control={<Radio size="small" />} label={<Typography variant="body2">Optional</Typography>} />
        </RadioGroup>
      </Box>
    )}
  </Box>
);

export default ConfigRow;
