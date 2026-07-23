import React, { useContext } from 'react';
import { Box, Typography, TextField, FormControl, Select, MenuItem } from '@mui/material';
import FormatSizeIcon from '@mui/icons-material/FormatSize';
import PracticeSettingCard from './PracticeSettingCard';
import { SettingsContext } from './SharedSettings';

const TextEditors = () => {
  const ctx = useContext(SettingsContext);

  return (
    <PracticeSettingCard 
      title="Text Editors" 
      subtitle="Default font styling for rich text editors"
      icon={<FormatSizeIcon sx={{ fontSize: 18 }} />}
    >
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
        {/* Font size */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, my: 0.75 }}>
          <Typography variant="body2" color="primary.main" sx={{ flex: 1, fontSize: '12px' }}>
            Default Font Size for Text Editors
          </Typography>
          <TextField
            variant="outlined"
            size="small"
            value={ctx?.settings['Default Font Size for Text Editors'] || "10"}
            onChange={(e) => ctx?.handleChange('Default Font Size for Text Editors', e.target.value)}
            inputProps={{ style: { textAlign: 'center', fontSize: '12px', padding: '4px 8px' } }}
            sx={{ width: 50, bgcolor: '#fff' }}
          />
          <Typography variant="body2" color="text.secondary" sx={{ fontSize: '12px' }}>pt</Typography>
        </Box>

        {/* Font family */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, my: 0.75 }}>
          <Typography variant="body2" color="primary.main" sx={{ flex: 1, fontSize: '12px' }}>
            Default Font Family for Text Editors
          </Typography>
          <FormControl variant="outlined" size="small" sx={{ minWidth: 200 }}>
            <Select 
              value={ctx?.settings['Default Font Family for Text Editors'] || "lato"}
              onChange={(e) => ctx?.handleChange('Default Font Family for Text Editors', e.target.value)}
              sx={{ fontSize: '12px', height: 28, bgcolor: '#fff' }}
            >
              <MenuItem value="lato" sx={{ fontSize: '12px' }}>Lato</MenuItem>
              <MenuItem value="arial" sx={{ fontSize: '12px' }}>Arial</MenuItem>
              <MenuItem value="times" sx={{ fontSize: '12px' }}>Times New Roman</MenuItem>
              <MenuItem value="roboto" sx={{ fontSize: '12px' }}>Roboto</MenuItem>
            </Select>
          </FormControl>
          <Typography variant="body2" color="text.secondary" sx={{ fontSize: '11px', cursor: 'pointer', '&:hover': { textDecoration: 'underline' } }}>
            Preview Text
          </Typography>
        </Box>

        {/* Font color */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, my: 0.75 }}>
          <Typography variant="body2" color="primary.main" sx={{ flex: 1, fontSize: '12px' }}>
            Default Font Color for Text Editors
          </Typography>
          <Box
            component="input"
            type="color"
            value={ctx?.settings['Default Font Color for Text Editors'] || "#000000"}
            onChange={(e) => ctx?.handleChange('Default Font Color for Text Editors', e.target.value)}
            sx={{
              width: 28,
              height: 28,
              border: '1px solid #e5e7eb',
              borderRadius: '4px',
              padding: 0,
              cursor: 'pointer',
              backgroundColor: 'transparent',
            }}
          />
        </Box>
      </Box>
    </PracticeSettingCard>
  );
};

export default TextEditors;
