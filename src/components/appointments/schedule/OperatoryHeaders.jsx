import { Box, Typography } from '@mui/material';
import { OPERATORIES, TIME_LABEL_WIDTH, COLUMN_MIN_WIDTH } from './scheduleConstants';

const OperatoryHeaders = () => (
  <Box
    sx={{
      display: 'flex',
      flexShrink: 0,
      position: 'sticky',
      top: 0,
      zIndex: 3,
      backgroundColor: '#ffffff',
      borderBottom: '1px solid #e0e5eb',
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
          borderLeft: '1px solid #e0e5eb',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Box sx={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: op.color, flexShrink: 0 }} />
          <Typography sx={{ fontFamily: 'Inter', fontWeight: 600, fontSize: '13px', color: '#09121f', whiteSpace: 'nowrap' }}>
            {op.name}
          </Typography>
        </Box>
        <Typography sx={{ fontFamily: 'Inter', fontSize: '11px', color: '#7a8a9a', mt: '2px', whiteSpace: 'nowrap' }}>
          {op.doctor}
        </Typography>
      </Box>
    ))}
  </Box>
);

export default OperatoryHeaders;
