import { Box, Typography } from '@mui/material';
import { PlaylistAddCheck } from '@mui/icons-material';
import RightPanelCard from './RightPanelCard';

const APPOINTMENTS = [
  { initials: 'JC', name: 'JOHN CLAD',       slot: 'Mon · 04:00 PM · 70m', date: 'Feb 07, 2022' },
  { initials: 'MF', name: 'Melina Freschi',   slot: 'Tues · 09:10 AM · 60m', date: 'Jul 19, 2022' },
  { initials: 'SG', name: 'Sabrina Gauthier', slot: 'Tues · 09:25 AM · 60m', date: 'Apr 05, 2022' },
  { initials: 'MH', name: 'Melina Haines',    slot: 'Thurs · 09:10 AM · 60m', date: 'Apr 28, 2022' },
];

const AppointmentShortlist = () => (
  <RightPanelCard
    icon={<PlaylistAddCheck sx={{ fontSize: '20px', color: '#06b6d4' }} />}
    title="Appointment Shortlist"
    count={7}
    headerAction="expand"
    footerLabel="View all & filter →"
  >
    {APPOINTMENTS.map(({ initials, name, slot, date }) => (
      <Box
        key={initials + name}
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          py: '9px',
          borderBottom: '1px solid #f5f7fa',
          '&:last-child': { borderBottom: 'none' },
          cursor: 'pointer',
          '&:hover': { backgroundColor: '#fafbfc' },
        }}
      >
        {/* Avatar */}
        <Box
          sx={{
            width: '38px', height: '38px',
            borderRadius: '50%',
            backgroundColor: '#dde4fb',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            flexShrink: 0,
          }}
        >
          <Typography sx={{ fontFamily: 'Inter', fontSize: '12px', fontWeight: 700, color: '#3b5bd9' }}>
            {initials}
          </Typography>
        </Box>

        {/* Name + slot */}
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Typography sx={{ fontFamily: 'Inter', fontSize: '12px', fontWeight: 700, color: '#09121f', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {name}
          </Typography>
          <Typography sx={{ fontFamily: 'Inter', fontSize: '12px', color: '#09121f' }}>
            {slot}
          </Typography>
        </Box>

        {/* Date */}
        <Typography sx={{ fontFamily: 'Inter', fontSize: '12px', color: '#09121f', flexShrink: 0 }}>
          {date}
        </Typography>
      </Box>
    ))}
  </RightPanelCard>
);

export default AppointmentShortlist;
