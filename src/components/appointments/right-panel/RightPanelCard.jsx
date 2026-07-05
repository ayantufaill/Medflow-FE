import { Box, Typography } from '@mui/material';
import { OpenInFull, Add } from '@mui/icons-material';
import { COLORS } from '../../../constants/colors';
import { fontSize, fontWeight, radius, spacing, headingPrimarySx } from '../../../constants/styles';

const RightPanelCard = ({
  icon,
  title,
  count,
  headerAction = null,   // 'expand' | 'addButton' | 'plus'
  onExpand,
  onAdd,
  footerLabel = null,
  onFooterClick,
  children,
}) => (
  <Box
    sx={{
      backgroundColor: COLORS.SURFACE_CARD,
      border: `1px solid ${COLORS.BORDER}`,
      borderRadius: radius.lg,
      overflow: 'hidden',
      display: 'flex',
      flexDirection: 'column',
    }}
  >
    {/* ── Card header ── */}
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: spacing.cardGap,
        px: spacing.cardPx,
        py: spacing.cardPy,
        backgroundColor: COLORS.SURFACE_TINT,
        borderBottom: `1px solid ${COLORS.BORDER}`,
      }}
    >
      {icon}

      <Typography sx={{ ...headingPrimarySx }}>
        {title}
      </Typography>

      {count !== undefined && (
        <Typography sx={{ fontSize: fontSize.base, fontWeight: fontWeight.regular, color: COLORS.TEXT_MUTED }}>
          {count}
        </Typography>
      )}

      <Box sx={{ flex: 1 }} />

      {/* Header action — conditional */}
      {headerAction === 'expand' && (
        <OpenInFull onClick={onExpand} sx={{ fontSize: '16px', color: COLORS.TEXT_MUTED, cursor: 'pointer', '&:hover': { color: COLORS.ACCENT } }} />
      )}

      {headerAction === 'addButton' && (
        <Box
          onClick={onAdd}
          sx={{
            backgroundColor: COLORS.ACCENT,
            borderRadius: radius.sm,
            px: spacing.cardPx,
            py: '5px',
            cursor: 'pointer',
            '&:hover': { backgroundColor: COLORS.ACCENT_HOVER },
          }}
        >
          <Typography sx={{ fontSize: fontSize.base, fontWeight: fontWeight.semibold, color: COLORS.WHITE }}>
            Add
          </Typography>
        </Box>
      )}

      {headerAction === 'plus' && (
        <Add sx={{ fontSize: '18px', color: COLORS.TEXT_MUTED, cursor: 'pointer' }} />
      )}
    </Box>

    {/* ── Card content ── */}
    <Box sx={{ flex: 1, px: spacing.cardPx, py: spacing.cardContentPy, display: 'flex', flexDirection: 'column', gap: '2px' }}>
      {children}
    </Box>

    {/* ── Footer link ── */}
    {footerLabel && (
      <Box
        onClick={onFooterClick}
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          py: spacing.cardContentPy,
          borderTop: `1px solid ${COLORS.BORDER_LIGHT}`,
          cursor: 'pointer',
        }}
      >
        <Typography sx={{ fontSize: fontSize.base, fontWeight: fontWeight.medium, color: COLORS.ACCENT }}>
          {footerLabel}
        </Typography>
      </Box>
    )}
  </Box>
);

export default RightPanelCard;
