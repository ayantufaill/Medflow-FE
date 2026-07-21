import React, { useContext } from 'react';
import { Box, Typography, FormControl, Select, MenuItem, Tooltip } from '@mui/material';
import InsertChartOutlinedIcon from '@mui/icons-material/InsertChartOutlined';
import PracticeSettingCard from './PracticeSettingCard';
import { SettingsContext, SettingCheckbox, InfoIcon } from './SharedSettings';

const Reports = () => {
  const ctx = useContext(SettingsContext);

  return (
    <PracticeSettingCard 
      title="Reports" 
      subtitle="Report generation and display preferences"
      icon={<InsertChartOutlinedIcon sx={{ fontSize: 18 }} />}
    >
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, my: 0.75 }}>
          <Typography variant="body2" color="primary.main" sx={{ flex: 1, fontSize: '12px' }}>
            The Production &amp; Collection report will be generated at the selected business day of the month
          </Typography>
          <FormControl variant="outlined" size="small" sx={{ minWidth: 60 }}>
            <Select 
              value={ctx?.settings['Production & Collection Report Day'] || "5"}
              onChange={(e) => ctx?.handleChange('Production & Collection Report Day', e.target.value)}
              sx={{ fontSize: '12px', height: 28, bgcolor: '#fff' }}
            >
              {[1,2,3,4,5,6,7,8,9,10].map((n) => (
                <MenuItem key={n} value={String(n)} sx={{ fontSize: '12px' }}>{n}</MenuItem>
              ))}
            </Select>
          </FormControl>
          <Tooltip title="More info" placement="right"><span><InfoIcon /></span></Tooltip>
        </Box>
        <Box sx={{ borderTop: '1px dashed #e5e7eb', my: 1 }} />
        <SettingCheckbox label="Compute Production Per Hour Based On Schedule" info />
        <SettingCheckbox label="View the row number for all reports" />
      </Box>
    </PracticeSettingCard>
  );
};

export default Reports;
