import { Box, Switch, FormControlLabel, Divider, Typography } from '@mui/material';
import ScheduleConfigCard from './ScheduleConfigCard';
import ApptCardSettingIcon from '../../../../assets/scheduleconfigurationicon/appointmentcardsetting.svg';

const SECTION_1_ITEMS = [
  // Col 1
  { label: "Display half-hour intervals", defaultChecked: true },
  { label: "Display Appointment Procedures", defaultChecked: true },
  { label: "Display Billing icon", defaultChecked: true },
  { label: "Display Appointment Status Bar", defaultChecked: true },
  // Col 2
  { label: "Hide appointments with 'No Show' status", defaultChecked: true },
  { label: "Display Dental History/Risk Assessment icon", defaultChecked: true },
  { label: "Display Treatment Plan icon", defaultChecked: true },
  { label: "Name", defaultChecked: true },
  // Col 3
  { label: "Show patient flags", defaultChecked: true },
  { label: "Display Alerts icon", defaultChecked: true },
  { label: "Display Appointment Tags", defaultChecked: true },
  { label: "Show Patient Phone Number On Print", defaultChecked: true },
  // Col 4
  { label: "Show adjusted production", defaultChecked: false },
  { label: "Display Progress Notes icon", defaultChecked: true },
  { label: "Display Exam icon", defaultChecked: true },
  { label: "Display Appointment Time", defaultChecked: true },
  // Col 5
  { label: "Display Notes icon", defaultChecked: true }
];

const SECTION_2_ITEMS = [
  // Col 1
  { label: "Send email on declined appointments", defaultChecked: false },
  { label: "On appointment card: display total patient owing", defaultChecked: false },
  // Col 2
  { label: "Display clinical docs icon", defaultChecked: true },
  { label: "Inside appointment card details: display total patient owing", defaultChecked: false },
  // Col 3
  { label: "Display total charge", defaultChecked: false },
  { label: "Minimize communication icons", defaultChecked: false },
];

const AppointmentCardSettings = ({ appointmentCardSettings, setAppointmentCardSettings }) => {
  const handleChange = (label, checked) => {
    setAppointmentCardSettings(prev => ({ ...prev, [label]: checked }));
  };

  if (!appointmentCardSettings) return null;
  return (
    <ScheduleConfigCard 
      title="Appointment Card Settings" 
      subtitle="Icons and fields shown on the calendar card"
      icon={ApptCardSettingIcon}
    >
      <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
        {/* Top Section - 5 Columns */}
        <Box 
          sx={{ 
            display: 'grid', 
            gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(5, 1fr)' }, 
            gridAutoFlow: { md: 'column' },
            gridTemplateRows: { md: 'repeat(4, auto)' },
            columnGap: 2,
            rowGap: 0.5,
            mb: 2
          }}
        >
          {SECTION_1_ITEMS.map((item, index) => {
            const isChecked = appointmentCardSettings[item.label] !== undefined ? appointmentCardSettings[item.label] : item.defaultChecked;
            return (
              <FormControlLabel
                key={index}
                control={<Switch size="small" checked={isChecked} onChange={(e) => handleChange(item.label, e.target.checked)} color={isChecked ? 'primary' : 'default'} />}
                label={<Typography sx={{ fontFamily: '"Segoe UI", sans-serif', fontWeight: 400, fontSize: '12px', lineHeight: 1, letterSpacing: '0px', color: 'text.secondary' }}>{item.label}</Typography>}
                sx={{ m: 0, alignItems: 'center' }}
              />
            );
          })}
        </Box>

        <Divider sx={{ mb: 2 }} />

        {/* Bottom Section - 3 Columns */}
        <Box 
          sx={{ 
            display: 'grid', 
            gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' }, 
            gridAutoFlow: { md: 'column' },
            gridTemplateRows: { md: 'repeat(2, auto)' },
            columnGap: 2,
            rowGap: 0.5 
          }}
        >
          {SECTION_2_ITEMS.map((item, index) => {
            const isChecked = appointmentCardSettings[item.label] !== undefined ? appointmentCardSettings[item.label] : item.defaultChecked;
            return (
              <FormControlLabel
                key={index}
                control={<Switch size="small" checked={isChecked} onChange={(e) => handleChange(item.label, e.target.checked)} color={isChecked ? 'primary' : 'default'} />}
                label={<Typography sx={{ fontFamily: '"Segoe UI", sans-serif', fontWeight: 400, fontSize: '12px', lineHeight: 1, letterSpacing: '0px', color: 'text.secondary' }}>{item.label}</Typography>}
                sx={{ m: 0, alignItems: 'center' }}
              />
            );
          })}
        </Box>
      </Box>
    </ScheduleConfigCard>
  );
};

export default AppointmentCardSettings;
