import { Box, Typography } from '@mui/material';
import { COLORS } from '../../../constants/colors';
import { fontSize, fontWeight } from '../../../constants/styles';

const TABS = [
  { label: 'Patient' },
  { label: 'Pending', count: 0 },
  { label: 'Search' },
  { label: 'Productivity' },
];

const LeftPanelTabs = ({ activeTab, onChange }) => (
  <Box
    sx={{
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'flex-end',
      width: '100%',
      height: '44px',
      borderBottom: `1px solid ${COLORS.BORDER}`,
      px: '12px',
      gap: '4px',
      flexShrink: 0,
    }}
  >
    {TABS.map(({ label, count }) => {
      const isActive = activeTab === label;
      const displayLabel = count !== undefined ? `${label} (${count})` : label;
      return (
        <Box
          key={label}
          onClick={() => onChange(label)}
          sx={{
            display: 'flex',
            alignItems: 'center',
            px: '8px',
            pb: '10px',
            cursor: 'pointer',
            borderBottom: isActive ? `2px solid ${COLORS.ACCENT}` : '2px solid transparent',
            transition: 'border-color 0.15s ease',
          }}
        >
          <Typography
            sx={{
              fontSize: fontSize.sm,
              fontWeight: isActive ? fontWeight.semibold : fontWeight.regular,
              color: isActive ? COLORS.ACCENT : COLORS.TEXT_SECONDARY,
              whiteSpace: 'nowrap',
              userSelect: 'none',
            }}
          >
            {displayLabel}
          </Typography>
        </Box>
      );
    })}
  </Box>
);

export default LeftPanelTabs;
