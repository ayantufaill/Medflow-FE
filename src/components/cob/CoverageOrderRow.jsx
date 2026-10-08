import { Box, Typography, Stack, Chip } from '@mui/material';
import { COLORS } from '../../constants/colors';
import { fontSize, fontWeight, radius } from '../../constants/styles';
import { positionLabel } from '../../constants/cobConstants';

/**
 * One line of the ranked coverage order.
 *
 * UX RULE ENFORCED HERE: never show an order without reasons. The explanation
 * is not optional chrome — it is what lets a biller on the phone with a payer
 * say *why* we put this plan first. If the backend sent no explanation we say
 * so out loud rather than rendering a bare position, because a silent gap
 * looks like the system simply decided on its own.
 */
const CoverageOrderRow = ({ position, carrierName, planName, explanation, memberId }) => {
  const rank = positionLabel(position);

  return (
    <Box
      component="li"
      data-testid={`cob-order-row-${position}`}
      sx={{
        listStyle: 'none',
        display: 'flex',
        gap: 1.5,
        px: 1.75,
        py: 1.5,
        borderBottom: `1px solid ${COLORS.BORDER_VERY_LIGHT}`,
        '&:last-of-type': { borderBottom: 'none' },
      }}
    >
      <Chip
        label={position}
        size="small"
        aria-hidden="true"
        sx={{
          fontFamily: 'Inter',
          fontWeight: fontWeight.bold,
          fontSize: fontSize.sm,
          minWidth: 26,
          height: 26,
          borderRadius: radius.pill,
          color: COLORS.ACCENT,
          backgroundColor: COLORS.ACCENT_BG,
        }}
      />

      <Box sx={{ minWidth: 0, flex: 1 }}>
        <Typography
          sx={{
            fontFamily: 'Inter',
            fontSize: fontSize.md,
            fontWeight: fontWeight.semibold,
            color: COLORS.TEXT_PRIMARY,
          }}
        >
          {rank}: {carrierName || 'Unnamed insurer'}
          {planName ? ` — ${planName}` : ''}
        </Typography>

        {/* The one-line reason straight from the rule engine. */}
        <Typography
          data-testid={`cob-order-reason-${position}`}
          sx={{
            fontFamily: 'Inter',
            fontSize: fontSize.base,
            color: explanation ? COLORS.TEXT_SECONDARY : COLORS.STATUS_WARNING,
            mt: 0.25,
          }}
        >
          {explanation || 'No reason was recorded for this position — re-check the order.'}
        </Typography>

        {memberId && (
          <Typography
            sx={{ fontFamily: 'Inter', fontSize: fontSize.sm, color: COLORS.TEXT_MUTED, mt: 0.25 }}
          >
            Member ID {memberId}
          </Typography>
        )}
      </Box>
    </Box>
  );
};

export default CoverageOrderRow;
