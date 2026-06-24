import { Box, Typography } from '@mui/material';

const VIEWS = ['Day', 'Week', 'Month'];

const ViewToggle = ({ value, onChange }) => (
  <Box
    sx={{
      display: 'flex',
      alignItems: 'center',
      backgroundColor: '#eef0f3',
      borderRadius: '12px',
      padding: '3px',
      gap: '1px',
      flexShrink: 0,
    }}
  >
    {VIEWS.map((v) => {
      const isActive = value === v;
      return (
        <Box
          key={v}
          onClick={() => onChange(v)}
          sx={{
            px: '8px',
            py: '3px',
            borderRadius: '8px',
            cursor: 'pointer',
            backgroundColor: isActive ? '#ffffff' : 'transparent',
            boxShadow: isActive ? '0px 1px 3px rgba(0,0,0,0.12)' : 'none',
            transition: 'all 0.15s ease',
          }}
        >
          <Typography
            sx={{
              fontFamily: 'Inter',
              fontSize: '12px',
              fontWeight: isActive ? 500 : 300,
              color: isActive ? '#09121f' : '#5c646f',
              lineHeight: '20px',
              userSelect: 'none',
              textAlign: 'center',
            }}
          >
            {v}
          </Typography>
        </Box>
      );
    })}
  </Box>
);

export default ViewToggle;
