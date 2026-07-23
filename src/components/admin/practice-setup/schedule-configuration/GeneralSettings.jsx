import { Box, Typography, Switch, FormControlLabel, TextField, Slider } from '@mui/material';
import ScheduleConfigCard from './ScheduleConfigCard';
import GeneralSettingIcon from '../../../../assets/scheduleconfigurationicon/generalsetting.svg';

const GeneralSettings = ({ generalSettings, setGeneralSettings }) => {
  const handleChange = (field) => (event) => {
    const value = event.target.type === 'checkbox' ? event.target.checked : event.target.value;
    setGeneralSettings((prev) => ({ ...prev, [field]: value }));
  };

  if (!generalSettings) return null;
  return (
    <ScheduleConfigCard 
      title="General Settings" 
      subtitle="Calendar layout, slot width, and scroll behavior"
      icon={GeneralSettingIcon}
    >
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <FormControlLabel 
          control={<Switch size="small" checked={generalSettings.enableHorizontalScroll} onChange={handleChange('enableHorizontalScroll')} />} 
          label={<Typography sx={{ fontFamily: '"Segoe UI", sans-serif', fontWeight: 400, fontSize: '12px', lineHeight: 1, letterSpacing: '0px', color: 'text.secondary' }}>Enable Horizontal Scroll</Typography>} 
        />
        
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Typography>Minimum Slot Width</Typography>
          <TextField 
            size="small" 
            value={generalSettings.minSlotWidth} 
            onChange={handleChange('minSlotWidth')} 
            type="number"
            sx={{ width: 100 }} 
          />
          <Typography>px</Typography>
        </Box>

        <FormControlLabel 
          control={<Switch size="small" checked={generalSettings.showCalendar} onChange={handleChange('showCalendar')} />} 
          label={<Typography sx={{ fontFamily: '"Segoe UI", sans-serif', fontWeight: 400, fontSize: '12px', lineHeight: 1, letterSpacing: '0px', color: 'text.secondary' }}>Show Calendar in Patient Tab</Typography>} 
        />
        <FormControlLabel 
          control={<Switch size="small" checked={generalSettings.adjustableSlotHeight} onChange={handleChange('adjustableSlotHeight')} />} 
          label={<Typography sx={{ fontFamily: '"Segoe UI", sans-serif', fontWeight: 400, fontSize: '12px', lineHeight: 1, letterSpacing: '0px', color: 'text.secondary' }}>Enable adjustable slot height for screens wider than 2560px</Typography>} 
        />

        <Box>
          <Typography gutterBottom>Adjust slot height for wide screens</Typography>
          <Slider 
            value={generalSettings.slotHeight} 
            onChange={(e, val) => setGeneralSettings(prev => ({ ...prev, slotHeight: val }))} 
            valueLabelDisplay="auto" 
          />
        </Box>
      </Box>
    </ScheduleConfigCard>
  );
};

export default GeneralSettings;
