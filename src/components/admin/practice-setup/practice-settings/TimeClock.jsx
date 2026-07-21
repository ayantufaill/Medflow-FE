import React, { useContext } from 'react';
import { Box, Typography, TextField, FormControl, Select, MenuItem, Tooltip } from '@mui/material';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import PracticeSettingCard from './PracticeSettingCard';
import { SettingsContext, SettingCheckbox, InfoIcon } from './SharedSettings';

const TimeClock = () => {
  const ctx = useContext(SettingsContext);

  return (
    <PracticeSettingCard 
      title="Time Clock" 
      subtitle="Clock-in/out rules and pay period defaults"
      icon={<AccessTimeIcon sx={{ fontSize: 18 }} />}
    >
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 4, my: 0.75, flexWrap: 'wrap' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Typography variant="body2" color="primary.main" sx={{ fontSize: '12px' }}>Select Pay Period Options</Typography>
            <FormControl variant="outlined" size="small" sx={{ minWidth: 160 }}>
              <Select 
                value={ctx?.settings['Select Pay Period Options'] || "not-set"}
                onChange={(e) => ctx?.handleChange('Select Pay Period Options', e.target.value)}
                sx={{ fontSize: '12px', height: 28, bgcolor: '#fff' }}
              >
                <MenuItem value="not-set" sx={{ fontSize: '12px' }}>Not Set</MenuItem>
                <MenuItem value="weekly" sx={{ fontSize: '12px' }}>Weekly</MenuItem>
                <MenuItem value="bi-weekly" sx={{ fontSize: '12px' }}>Bi-Weekly</MenuItem>
                <MenuItem value="monthly" sx={{ fontSize: '12px' }}>Monthly</MenuItem>
              </Select>
            </FormControl>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography variant="body2" color="primary.main" sx={{ flex: 1, fontSize: '12px' }}>
              Users will be Automatically clocked out at
            </Typography>
            <TextField
              variant="outlined"
              size="small"
              value={ctx?.settings['Automatically clock out hour'] || "21"}
              onChange={(e) => ctx?.handleChange('Automatically clock out hour', e.target.value)}
              inputProps={{ style: { textAlign: 'center', fontSize: '12px', padding: '4px 8px' } }}
              sx={{ width: 44, bgcolor: '#fff' }}
            />
            <Typography variant="body2" color="text.secondary">:</Typography>
            <TextField
              variant="outlined"
              size="small"
              value={ctx?.settings['Automatically clock out minute'] || "00"}
              onChange={(e) => ctx?.handleChange('Automatically clock out minute', e.target.value)}
              inputProps={{ style: { textAlign: 'center', fontSize: '12px', padding: '4px 8px' } }}
              sx={{ width: 44, bgcolor: '#fff' }}
            />
            <Typography variant="body2" color="text.secondary" sx={{ fontSize: '11px' }}>(24h format)</Typography>
            <Tooltip title="More info" placement="right"><span><InfoIcon /></span></Tooltip>
          </Box>
        </Box>
        <Box sx={{ borderTop: '1px dashed #e5e7eb', my: 1 }} />
        <SettingCheckbox label="Allow Users To Edit Time Clock Records" />
      </Box>
    </PracticeSettingCard>
  );
};

export default TimeClock;
