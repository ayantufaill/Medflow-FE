import { Box, Typography } from '@mui/material';
import { OPERATORIES, TIME_LABEL_WIDTH, COLUMN_MIN_WIDTH } from './scheduleConstants';
import { COLORS } from '../../../constants/colors';
import { fontSize, headingSecondarySx } from '../../../constants/styles';

const OperatoryHeaders = () => (
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
    {/* Spacer for time label column */}
    <Box sx={{ width: TIME_LABEL_WIDTH, flexShrink: 0 }} />

    {OPERATORIES.map((op) => (
      <Box
        key={op.id}
        sx={{
          width: COLUMN_MIN_WIDTH,
          flexShrink: 0,
          px: '14px',
          py: '10px',
          borderLeft: `1px solid ${COLORS.BORDER}`,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Box sx={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: op.color, flexShrink: 0 }} />
          <Typography sx={{ ...headingSecondarySx, whiteSpace: 'nowrap' }}>
            {op.name}
          </Typography>
        </Box>
        <Typography sx={{ fontSize: fontSize.sm, color: '#7a8a9a', mt: '2px', whiteSpace: 'nowrap' }}>
          {op.doctor}
        </Typography>
      </Box>
    ))}
  </Box>
);

export default OperatoryHeaders;
