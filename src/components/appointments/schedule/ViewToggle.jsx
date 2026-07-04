import { Box, Typography } from '@mui/material';
import { COLORS } from '../../../constants/colors';
import { fontSize, fontWeight, radius } from '../../../constants/styles';

const VIEWS = ['Day', 'Week', 'Month'];

const ViewToggle = ({ value, onChange }) => (
  <Box
    sx={{
      display: 'flex',
      alignItems: 'center',
      backgroundColor: '#eef0f3',
      borderRadius: radius.lg,
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
            borderRadius: radius.md,
            cursor: 'pointer',
            backgroundColor: isActive ? COLORS.SURFACE_CARD : 'transparent',
            boxShadow: isActive ? '0px 1px 3px rgba(0,0,0,0.12)' : 'none',
            transition: 'all 0.15s ease',
          }}
        >
          <Typography
            sx={{
              fontSize: fontSize.base,
              fontWeight: isActive ? fontWeight.semibold : fontWeight.regular,
              color: isActive ? COLORS.TEXT_PRIMARY : COLORS.TEXT_SECONDARY,
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
