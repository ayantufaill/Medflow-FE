import { Box, Typography, Stack } from '@mui/material';
import { InfoOutlined as InfoIcon } from '@mui/icons-material';
import { COLORS } from '../../constants/colors';
import { fontSize, fontWeight, radius } from '../../constants/styles';

/**
 * "Not part of claim order" — the fixed-benefit (indemnity) policies.
 *
 * They are shown, not hidden: a patient who tells the front desk about a
 * hospital-indemnity policy needs to see it was recorded, and a biller needs
 * to know why it is not in the ranking. Hiding them produces the exact
 * "you lost my insurance" phone call this section prevents.
 */
const ExcludedCoverageList = ({ items = [] }) => {
  if (!items.length) return null;

  return (
    <Box
      data-testid="cob-excluded-section"
      sx={{
        mt: 2,
        border: `1px dashed ${COLORS.BORDER}`,
        borderRadius: radius.lg,
        backgroundColor: COLORS.SURFACE_HOVER,
        p: 1.75,
      }}
    >
      <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1 }}>
        <InfoIcon sx={{ fontSize: 16, color: COLORS.TEXT_MUTED }} />
        <Typography
          component="h4"
          sx={{
            fontFamily: 'Inter',
            fontSize: fontSize.md,
            fontWeight: fontWeight.semibold,
            color: COLORS.TEXT_PRIMARY,
          }}
        >
          Not part of claim order
        </Typography>
      </Stack>

      <Box component="ul" sx={{ m: 0, p: 0 }}>
        {items.map((item) => (
          <Box
            component="li"
            key={item.coverageId}
            data-testid={`cob-excluded-row-${item.coverageId}`}
            sx={{ listStyle: 'none', mb: 1, '&:last-of-type': { mb: 0 } }}
          >
            <Typography
              sx={{
                fontFamily: 'Inter',
                fontSize: fontSize.base,
                fontWeight: fontWeight.medium,
                color: COLORS.TEXT_BODY,
              }}
            >
              {item.carrierName || 'Unnamed insurer'}
              {item.planName ? ` — ${item.planName}` : ''}
            </Typography>
            <Typography
              sx={{ fontFamily: 'Inter', fontSize: fontSize.sm, color: COLORS.TEXT_SECONDARY }}
            >
              {item.explanation ||
                'Pays the patient directly, so it is not billed as part of the claim order.'}
            </Typography>
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default ExcludedCoverageList;
