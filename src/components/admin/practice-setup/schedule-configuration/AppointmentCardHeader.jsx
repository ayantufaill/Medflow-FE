import { Box, Typography, Switch, FormControlLabel, Select, MenuItem } from '@mui/material';
import ScheduleConfigCard from './ScheduleConfigCard';
import ApptCardHeaderIcon from '../../../../assets/scheduleconfigurationicon/appointmentcardheader.svg';

const AppointmentCardHeader = ({ appointmentCardHeader, setAppointmentCardHeader }) => {
  const handleChange = (field) => (event) => {
    const value = event.target.type === 'checkbox' ? event.target.checked : event.target.value;
    setAppointmentCardHeader((prev) => ({ ...prev, [field]: value }));
  };

  if (!appointmentCardHeader) return null;
  return (
    <ScheduleConfigCard 
      title="Appointment Card Header" 
      subtitle="Name format and header styling"
      icon={ApptCardHeaderIcon}
    >
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5, pt: 1 }}>
        <Box>
          <Typography sx={{ fontFamily: '"Segoe UI", sans-serif', fontWeight: 400, fontSize: '12px', lineHeight: 1, letterSpacing: '0px', color: 'text.secondary', mb: 1 }}>Patient Name Format</Typography>
          <Select 
            value={appointmentCardHeader.patientNameFormat} 
            onChange={handleChange('patientNameFormat')}
            size="small" fullWidth sx={{ height: 32, fontSize: '13px', fontFamily: '"Segoe UI", sans-serif' }}
          >
            <MenuItem value="First Name Last Name">First Name Last Name</MenuItem>
            <MenuItem value="Last Name, First Name">Last Name, First Name</MenuItem>
          </Select>
        </Box>
        
        <FormControlLabel 
          control={<Switch size="small" checked={appointmentCardHeader.displayAge} onChange={handleChange('displayAge')} color="primary" />} 
          label={<Typography sx={{ fontFamily: '"Segoe UI", sans-serif', fontWeight: 400, fontSize: '12px', lineHeight: 1, letterSpacing: '0px', color: 'text.secondary' }}>Display age</Typography>} 
          sx={{ m: 0 }}
        />
        
        <Box>
          <Typography sx={{ fontFamily: '"Segoe UI", sans-serif', fontWeight: 400, fontSize: '12px', lineHeight: 1, letterSpacing: '0px', color: 'text.secondary', mb: 1 }}>Header Font Color</Typography>
          <input 
            type="color" 
            value={appointmentCardHeader.headerFontColor}
            onChange={handleChange('headerFontColor')}
            style={{ width: 28, height: 28, border: '1px solid #ddd', borderRadius: 4, padding: 0, cursor: 'pointer' }} 
          />
        </Box>
      </Box>
    </ScheduleConfigCard>
  );
};

export default AppointmentCardHeader;
