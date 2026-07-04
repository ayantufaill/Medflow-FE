import { useState } from 'react';
import { Box, Typography } from '@mui/material';
import { Checklist } from '@mui/icons-material';
import RightPanelCard from './RightPanelCard';
import AppointmentShortlistModal from './AppointmentShortlistModal';
import { COLORS } from '../../../constants/colors';
import { fontSize, fontWeight, avatarSize } from '../../../constants/styles';

const APPOINTMENTS = [
  { initials: 'JC', name: 'JOHN CLAD',       slot: 'Mon · 04:00 PM · 70m', date: 'Feb 07, 2022' },
  { initials: 'MF', name: 'Melina Freschi',   slot: 'Tues · 09:10 AM · 60m', date: 'Jul 19, 2022' },
  { initials: 'SG', name: 'Sabrina Gauthier', slot: 'Tues · 09:25 AM · 60m', date: 'Apr 05, 2022' },
  { initials: 'MH', name: 'Melina Haines',    slot: 'Thurs · 09:10 AM · 60m', date: 'Apr 28, 2022' },
];

/** Normalize ALL-CAPS names to Title Case */
const toTitleCase = (str) => str.toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase());

const AppointmentShortlist = () => {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <>
      <RightPanelCard
        icon={<Checklist sx={{ fontSize: '20px', color: COLORS.ACCENT }} />}
        title="Appointment Shortlist"
        count={7}
        headerAction="expand"
        onExpand={() => setModalOpen(true)}
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
              borderBottom: `1px solid ${COLORS.BORDER_VERY_LIGHT}`,
              '&:last-child': { borderBottom: 'none' },
              cursor: 'pointer',
              '&:hover': { backgroundColor: COLORS.SURFACE_HOVER },
            }}
          >
            {/* Avatar */}
            <Box
              sx={{
                width: avatarSize.md, height: avatarSize.md,
                borderRadius: '50%',
                backgroundColor: COLORS.AVATAR_BG,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              <Typography sx={{ fontSize: fontSize.base, fontWeight: fontWeight.bold, color: COLORS.AVATAR_TEXT }}>
                {initials}
              </Typography>
            </Box>

            {/* Name + slot */}
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Typography sx={{ fontSize: fontSize.base, fontWeight: fontWeight.semibold, color: COLORS.TEXT_PRIMARY, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {toTitleCase(name)}
              </Typography>
              <Typography sx={{ fontSize: fontSize.base, color: '#6b7280' }}>
                {slot}
              </Typography>
            </Box>

            {/* Date */}
            <Typography sx={{ fontSize: fontSize.base, color: '#6b7280', flexShrink: 0 }}>
              {date}
            </Typography>
          </Box>
        ))}
      </RightPanelCard>

      <AppointmentShortlistModal open={modalOpen} onClose={() => setModalOpen(false)} />
    </>
  );
};

export default AppointmentShortlist;
