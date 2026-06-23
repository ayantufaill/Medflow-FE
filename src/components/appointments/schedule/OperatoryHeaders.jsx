import { Box, Typography } from '@mui/material';
import { OPERATORIES, TIME_LABEL_WIDTH } from './scheduleConstants';

const OperatoryHeaders = () => (
  <Box
    sx={{
      display: 'flex',
      flexShrink: 0,
      borderBottom: '1px solid #e0e5eb',
      backgroundColor: '#ffffff',
    }}
  >
    {/* Spacer aligning with the time label column */}
    <Box sx={{ width: TIME_LABEL_WIDTH, flexShrink: 0 }} />

    {OPERATORIES.map((op, i) => (
      <Box
        key={op.id}
        sx={{
          flex: 1,
          px: '14px',
          py: '10px',
          borderLeft: i === 0 ? '1px solid #e0e5eb' : '1px solid #e0e5eb',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Box
            sx={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              backgroundColor: op.color,
              flexShrink: 0,
            }}
          />
          <Typography
            sx={{
              fontFamily: 'Inter',
              fontWeight: 600,
              fontSize: '13px',
              color: '#09121f',
              whiteSpace: 'nowrap',
            }}
          >
            {op.name}
          </Typography>
        </Box>
        <Typography
          sx={{
            fontFamily: 'Inter',
            fontSize: '11px',
            color: '#7a8a9a',
            mt: '2px',
            whiteSpace: 'nowrap',
          }}
        >
          {op.doctor}
        </Typography>
      </Box>
    ))}
  </Box>
);

export default OperatoryHeaders;
