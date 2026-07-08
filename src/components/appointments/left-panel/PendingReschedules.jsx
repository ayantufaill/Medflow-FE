import { Box, Typography } from '@mui/material';
import AutorenewIcon from '@mui/icons-material/Autorenew';
import { useSelector } from 'react-redux';
import { COLORS } from '../../../constants/colors';
import { fontSize, fontWeight, radius } from '../../../constants/styles';
import dayjs from 'dayjs';

const PendingReschedules = () => {
  const { waitlistEntries, total } = useSelector(state => state.waitlist);

  return (
    <Box
      sx={{
        p: '24px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        border: `2px dashed #bac7d5`,
        borderRadius: radius.lg,
        backgroundColor: COLORS.SURFACE_CARD,
        textAlign: 'center',
        minHeight: '250px',
        overflowY: 'auto'
      }}
    >
      <Typography
        sx={{
          fontSize: fontSize.lg,
          fontWeight: fontWeight.bold,
          color: COLORS.TEXT_PRIMARY,
          mb: '32px'
        }}
      >
        Pending Reschedules ({total || 0})
      </Typography>

      {waitlistEntries && waitlistEntries.length > 0 ? (
        <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '8px', mb: '20px' }}>
          {waitlistEntries.map(entry => (
            <Box key={entry._id || entry.id} sx={{ p: '12px', border: `1px solid ${COLORS.BORDER}`, borderRadius: radius.md, textAlign: 'left', backgroundColor: COLORS.WHITE }}>
              <Typography sx={{ fontSize: '13px', fontWeight: fontWeight.semibold, color: COLORS.TEXT_PRIMARY }}>
                {entry.patientId ? `${entry.patientId.firstName} ${entry.patientId.lastName}` : 'Unknown Patient'}
              </Typography>
              {entry.notes && (
                <Typography sx={{ fontSize: '12px', color: COLORS.TEXT_SECONDARY }}>
                  {entry.notes}
                </Typography>
              )}
            </Box>
          ))}
        </Box>
      ) : null}

      <Box
        sx={{
          backgroundColor: COLORS.ACCENT_BG,
          borderRadius: radius.sm,
          width: '44px',
          height: '44px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          mb: '20px',
          mt: waitlistEntries && waitlistEntries.length > 0 ? '16px' : 0
        }}
      >
        <AutorenewIcon sx={{ color: COLORS.ACCENT, fontSize: '28px' }} />
      </Box>

      <Typography
        sx={{
          fontSize: fontSize.md,
          color: COLORS.TEXT_SECONDARY,
          lineHeight: 1.5,
          px: '12px'
        }}
      >
        Drag any appointment or blocked slot
        <br />
        from the calendar and drop here
      </Typography>
    </Box>
  );
};

export default PendingReschedules;
