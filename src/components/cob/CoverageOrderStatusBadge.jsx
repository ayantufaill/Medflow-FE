import { Chip, Stack } from '@mui/material';
import { COLORS } from '../../constants/colors';
import { fontSize, fontWeight, radius } from '../../constants/styles';
import { ORDER_STATUS_BADGES, VERIFIED_BADGE } from '../../constants/cobConstants';

/**
 * Tone -> colour pairs. Defined here rather than in cobConstants so that the
 * constants file stays import-free and usable from pure tests.
 */
const TONES = {
  info: { color: COLORS.ACCENT, bg: COLORS.ACCENT_BG, border: 'rgba(35, 98, 239, 0.3)' },
  success: { color: COLORS.STATUS_SUCCESS, bg: 'rgba(22, 163, 74, 0.10)', border: 'rgba(22, 163, 74, 0.3)' },
  warning: { color: COLORS.STATUS_WARNING, bg: 'rgba(234, 88, 12, 0.10)', border: 'rgba(234, 88, 12, 0.3)' },
  error: { color: COLORS.STATUS_ERROR, bg: 'rgba(239, 68, 68, 0.10)', border: 'rgba(239, 68, 68, 0.3)' },
  accent: { color: COLORS.STATUS_PRECONFIRMED, bg: 'rgba(124, 58, 237, 0.10)', border: 'rgba(124, 58, 237, 0.3)' },
};

const BADGES = { ...ORDER_STATUS_BADGES, VERIFIED_WITH_PAYER: VERIFIED_BADGE };

/**
 * One status pill. `codes` is the array from `orderBadges()` so that an order
 * which is both confirmed and payer-verified shows both facts — they mean
 * different things and collapsing them loses the distinction between "a human
 * agreed" and "the insurer agreed".
 */
const CoverageOrderStatusBadge = ({ codes = [], size = 'small' }) => (
  <Stack direction="row" spacing={0.75} flexWrap="wrap" useFlexGap>
    {codes
      .map((code) => [code, BADGES[code]])
      .filter(([, badge]) => !!badge)
      .map(([code, badge]) => {
        const tone = TONES[badge.tone] || TONES.info;
        return (
          <Chip
            key={code}
            size={size}
            label={badge.label}
            // Announced as a status so a screen reader reaching the row hears
            // "Suggested" / "Disputed" without having to infer it from colour.
            role="status"
            data-testid={`cob-status-${code}`}
            sx={{
              fontFamily: 'Inter',
              fontSize: fontSize.xs,
              fontWeight: fontWeight.semibold,
              height: 22,
              borderRadius: radius.pill,
              color: tone.color,
              backgroundColor: tone.bg,
              border: `1px solid ${tone.border}`,
            }}
          />
        );
      })}
  </Stack>
);

export default CoverageOrderStatusBadge;
