import { Box, Typography, Skeleton } from '@mui/material';
import { TIME_LABEL_WIDTH, COLUMN_MIN_WIDTH, OPERATORY_COLORS } from './scheduleConstants';
import { useDropdownData } from '../../../hooks/redux';
import { COLORS } from '../../../constants/colors';
import { fontSize, headingSecondarySx } from '../../../constants/styles';

// OperatoryHeaders renders one column header per room fetched from the API.
// Colors cycle through OPERATORY_COLORS when there are more rooms than palette entries.

const OperatoryHeaders = () => {
  const { rooms, roomsLoading } = useDropdownData({ rooms: true });

  return (
    <Box
      sx={{
        display: 'flex',
        flexShrink: 0,
        position: 'sticky',
        top: 0,
        zIndex: 3,
        backgroundColor: COLORS.SURFACE_CARD,
        borderBottom: `1px solid ${COLORS.BORDER}`,
      }}
    >
      {/* Spacer aligns with the time-label gutter in ScheduleTimeGrid */}
      <Box sx={{ width: TIME_LABEL_WIDTH, flexShrink: 0 }} />

      {roomsLoading
        ? /* Placeholder columns while rooms are loading */
          [1, 2, 3].map((i) => (
            <Box
              key={i}
              sx={{ width: COLUMN_MIN_WIDTH, flexShrink: 0, px: '14px', py: '10px', borderLeft: `1px solid ${COLORS.BORDER}` }}
            >
              <Skeleton variant="text" width="60%" />
              <Skeleton variant="text" width="40%" sx={{ mt: '4px' }} />
            </Box>
          ))
        : rooms.map((room, idx) => {
            // Cycle through the colour palette; each room gets a consistent accent dot.
            const accentColor = OPERATORY_COLORS[idx % OPERATORY_COLORS.length];
            // Room name falls back to a numbered label if the field is missing.
            const roomName = room.name || `Op ${idx + 1}`;
            // Assigned provider name, shown below the room title (may not be present on all room objects).
            const providerName = room.providerName || room.doctorName || '';

            return (
              <Box
                key={room._id || room.id || idx}
                sx={{
                  width: COLUMN_MIN_WIDTH,
                  flexShrink: 0,
                  px: '14px',
                  py: '10px',
                  borderLeft: `1px solid ${COLORS.BORDER}`,
                }}
              >
                {/* Room title row with colour indicator */}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Box
                    sx={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: accentColor, flexShrink: 0 }}
                  />
                  <Typography sx={{ ...headingSecondarySx, whiteSpace: 'nowrap' }}>
                    {roomName}
                  </Typography>
                </Box>

                {/* Provider name sub-label — hidden when not assigned */}
                {providerName && (
                  <Typography sx={{ fontSize: fontSize.sm, color: '#7a8a9a', mt: '2px', whiteSpace: 'nowrap' }}>
                    {providerName}
                  </Typography>
                )}
              </Box>
            );
          })
      }
    </Box>
  );
};

export default OperatoryHeaders;
