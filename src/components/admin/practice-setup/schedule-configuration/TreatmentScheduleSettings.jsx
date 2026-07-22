import { Box, TextField, Typography } from '@mui/material';
import ScheduleConfigCard from './ScheduleConfigCard';
import TreatmentScheduleIcon from '../../../../assets/scheduleconfigurationicon/treatment and schedulesetting.svg';

const TreatmentScheduleSettings = ({ treatmentScheduleSettings, setTreatmentScheduleSettings }) => {
  const handleChange = (field) => (event) => {
    setTreatmentScheduleSettings(prev => ({ ...prev, [field]: event.target.value }));
  };

  if (!treatmentScheduleSettings) return null;
  return (
    <ScheduleConfigCard 
      title="Treatment & Schedule Settings" 
      subtitle="Default durations and time increments"
      icon={TreatmentScheduleIcon}
    >
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
        <Box sx={{ width: { xs: '100%', sm: 160 } }}>
          <Typography sx={{ fontFamily: '"Segoe UI", sans-serif', fontSize: '11px', color: 'text.secondary', mb: 1 }}>Default Treatment Slot Duration</Typography>
          <TextField 
            fullWidth 
            value={treatmentScheduleSettings.defaultTreatmentSlotDuration}
            onChange={handleChange('defaultTreatmentSlotDuration')}
            size="small" 
            sx={{ '& .MuiOutlinedInput-input': { p: '8px 12px', fontSize: '12px', fontFamily: '"Segoe UI", sans-serif' } }} 
          />
        </Box>
        
        <Box sx={{ width: { xs: '100%', sm: 170 } }}>
          <Typography sx={{ fontFamily: '"Segoe UI", sans-serif', fontSize: '11px', color: 'text.secondary', mb: 1 }}>Default Appointment Slot Duration</Typography>
          <TextField 
            fullWidth 
            value={treatmentScheduleSettings.defaultAppointmentSlotDuration}
            onChange={handleChange('defaultAppointmentSlotDuration')}
            size="small" 
            sx={{ '& .MuiOutlinedInput-input': { p: '8px 12px', fontSize: '12px', fontFamily: '"Segoe UI", sans-serif' } }} 
          />
        </Box>
        
        <Box sx={{ width: { xs: '100%', sm: 130 } }}>
          <Typography sx={{ fontFamily: '"Segoe UI", sans-serif', fontSize: '11px', color: 'text.secondary', mb: 1 }}>Schedule Unit</Typography>
          <TextField 
            fullWidth 
            value={treatmentScheduleSettings.scheduleUnit}
            onChange={handleChange('scheduleUnit')}
            size="small" 
            sx={{ '& .MuiOutlinedInput-input': { p: '8px 12px', fontSize: '12px', fontFamily: '"Segoe UI", sans-serif' } }} 
          />
        </Box>
        
        <Box sx={{ width: { xs: '100%', sm: 130 } }}>
          <Typography sx={{ fontFamily: '"Segoe UI", sans-serif', fontSize: '11px', color: 'text.secondary', mb: 1 }}>Schedule Increments</Typography>
          <TextField 
            fullWidth 
            value={treatmentScheduleSettings.scheduleIncrements}
            onChange={handleChange('scheduleIncrements')}
            size="small" 
            sx={{ '& .MuiOutlinedInput-input': { p: '8px 12px', fontSize: '12px', fontFamily: '"Segoe UI", sans-serif' } }} 
          />
        </Box>
      </Box>
    </ScheduleConfigCard>
  );
};

export default TreatmentScheduleSettings;
