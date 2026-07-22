import React from 'react';
import {
  Box,
  Typography,
  Checkbox,
  FormControlLabel,
  TextField,
  Select,
  MenuItem,
  Link,
} from '@mui/material';
import {
  AccessTime as TimeIcon,
  Add as AddIcon,
  CalendarToday as CalendarIcon
} from '@mui/icons-material';

const GeneralConfigurationCard = () => {
  return (
    <Box sx={{ 
      border: '1px solid #E5E9F2', 
      borderRadius: '8px', 
      mb: 4, 
      bgcolor: '#FFFFFF',
      overflow: 'hidden' 
    }}>
      {/* Header */}
      <Box sx={{ 
        bgcolor: '#F2F6FC', 
        px: 2.5, 
        py: 1.5, 
        display: 'flex', 
        alignItems: 'center', 
        gap: 1.5,
        borderBottom: '1px solid #E5E9F2'
      }}>
        <CalendarIcon sx={{ fontSize: '1.1rem', color: '#4472C4' }} />
        <Typography sx={{ fontWeight: 600, fontSize: '0.8rem', color: '#334155', letterSpacing: '0.5px' }}>
          GENERAL CONFIGURATION
        </Typography>
      </Box>

      {/* Content */}
      <Box sx={{ p: 2.5 }}>
        <Box sx={{ mb: 3 }}>
          <Typography sx={{ fontSize: '0.82rem', color: '#333', mb: 0.5 }}>
            What days would you like the system to skip sending communications (ex: holidays)?
          </Typography>
          <Typography
            component={Link}
            href="#"
            sx={{ fontSize: '0.82rem', color: '#3B82F6', textDecoration: 'none', cursor: 'pointer', display: 'inline-flex', alignItems: 'center' }}
          >
            <AddIcon sx={{ fontSize: '1rem', mr: 0.3 }} /> Add exceptions
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          {/* Email Communications */}
          <Box sx={{ flex: 1, minWidth: '300px' }}>
            <Typography sx={{ fontWeight: 500, fontSize: '0.82rem', mb: 1.5, color: '#334155' }}>
              When would you like the system to send all email communications?
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5, mb: 1.5 }}>
              <Typography sx={{ fontSize: '0.75rem', color: '#64748b' }}>Days</Typography>
              <Select size="small" value="Weekdays" sx={{ height: 32, fontSize: '0.8rem', width: 140, bgcolor: '#fff' }}>
                <MenuItem value="Weekdays">Weekdays</MenuItem>
                <MenuItem value="Custom">Custom</MenuItem>
              </Select>
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5, flexWrap: 'wrap' }}>
              <TextField size="small" defaultValue="08" sx={{ width: 50, '& .MuiOutlinedInput-root': { height: 32, fontSize: '0.85rem' } }} />
              <TextField size="small" defaultValue="00" sx={{ width: 50, '& .MuiOutlinedInput-root': { height: 32, fontSize: '0.85rem' } }} />
              <Box sx={{ bgcolor: '#3B82F6', color: '#fff', px: 1, py: 0.5, borderRadius: '4px', fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer' }}>AM</Box>
              <Typography sx={{ fontSize: '0.8rem', mx: 0.5, color: '#64748b' }}>to</Typography>
              <TextField size="small" defaultValue="21" sx={{ width: 50, '& .MuiOutlinedInput-root': { height: 32, fontSize: '0.85rem' } }} />
              <TextField size="small" defaultValue="00" sx={{ width: 50, '& .MuiOutlinedInput-root': { height: 32, fontSize: '0.85rem' } }} />
              <Box sx={{ bgcolor: '#3B82F6', color: '#fff', px: 1, py: 0.5, borderRadius: '4px', fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer' }}>PM</Box>
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, color: '#94a3b8' }}>
              <TimeIcon sx={{ fontSize: '1rem' }} />
              <Typography sx={{ fontSize: '0.75rem' }}>Time Window: 8 h</Typography>
            </Box>
          </Box>

          {/* Text Message Communications */}
          <Box sx={{ flex: 1, minWidth: '300px' }}>
            <Typography sx={{ fontWeight: 500, fontSize: '0.82rem', mb: 1.5, color: '#334155' }}>
              When would you like the system to send all text message communications?
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5, mb: 1.5 }}>
              <Typography sx={{ fontSize: '0.75rem', color: '#64748b' }}>Days</Typography>
              <Select size="small" value="Custom" sx={{ height: 32, fontSize: '0.8rem', width: 140, bgcolor: '#fff' }}>
                <MenuItem value="Weekdays">Weekdays</MenuItem>
                <MenuItem value="Custom">Custom</MenuItem>
              </Select>
            </Box>

            <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap', mb: 2, alignItems: 'center' }}>
              {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map(day => (
                <FormControlLabel
                  key={day}
                  control={
                    <Checkbox
                      size="small"
                      defaultChecked={day !== 'Sunday'}
                      sx={{ 
                        p: 0.5, 
                        color: '#CBD5E1',
                        '&.Mui-checked': { color: '#3B82F6' },
                        '& .MuiSvgIcon-root': { fontSize: '1.2rem', borderRadius: '4px' } 
                      }}
                    />
                  }
                  label={<Typography sx={{ fontSize: '0.75rem', color: '#475569' }}>{day}</Typography>}
                  sx={{ mr: 1, ml: 0 }}
                />
              ))}
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5, flexWrap: 'wrap' }}>
              <TextField size="small" defaultValue="08" sx={{ width: 50, '& .MuiOutlinedInput-root': { height: 32, fontSize: '0.85rem' } }} />
              <TextField size="small" defaultValue="00" sx={{ width: 50, '& .MuiOutlinedInput-root': { height: 32, fontSize: '0.85rem' } }} />
              <Box sx={{ bgcolor: '#3B82F6', color: '#fff', px: 1, py: 0.5, borderRadius: '4px', fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer' }}>AM</Box>
              <Typography sx={{ fontSize: '0.8rem', mx: 0.5, color: '#64748b' }}>to</Typography>
              <TextField size="small" defaultValue="20" sx={{ width: 50, '& .MuiOutlinedInput-root': { height: 32, fontSize: '0.85rem' } }} />
              <TextField size="small" defaultValue="30" sx={{ width: 50, '& .MuiOutlinedInput-root': { height: 32, fontSize: '0.85rem' } }} />
              <Box sx={{ bgcolor: '#3B82F6', color: '#fff', px: 1, py: 0.5, borderRadius: '4px', fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer' }}>PM</Box>
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, color: '#94a3b8' }}>
              <TimeIcon sx={{ fontSize: '1rem' }} />
              <Typography sx={{ fontSize: '0.75rem' }}>Time Window: 12 h 30 min</Typography>
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default GeneralConfigurationCard;
