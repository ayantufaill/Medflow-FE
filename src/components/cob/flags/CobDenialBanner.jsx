import { Box, Button, Stack, Typography } from '@mui/material';
import FlagBannerShell from './FlagBannerShell';
import { detailBoxSx, secondaryActionSx } from './flagBannerStyles';
import { REVIEW_FLAGS } from '../../../constants/cobConstants';
import { COLORS } from '../../../constants/colors';
import { fontSize, fontWeight } from '../../../constants/styles';
import { formatDate } from '../../../utils/dateUtils';

/**
 * A claim came back denied because of the coverage order.
 *
 * The banner shows the actual denied claim and the payer's own words — a
 * biller cannot act on "a claim was denied", they need the claim number and
 * the reason code to quote back on the phone. The primary action starts the
 * re-verification; opening the claim is secondary.
 */
const CobDenialBanner = ({ flag, onReVerify, onOpenClaim, onResolve, canResolve = true }) => {
  const detail = flag?.detail || {};

  return (
    <FlagBannerShell
      flag={REVIEW_FLAGS.COB_DENIAL}
      onAction={onReVerify}
      secondaryActions={
        <>
          {(detail.claimId || detail.claimNumber) && onOpenClaim ? (
            <Button
              size="small"
              variant="outlined"
              onClick={() => onOpenClaim(detail.claimId ?? detail.claimNumber)}
              data-testid="cob-denial-open-claim"
              sx={secondaryActionSx}
            >
              Open the denied claim
            </Button>
          ) : null}
          {/* Re-verifying records what the payer said; the flag still has to
              be closed, with a note, before claims are unblocked. */}
          {canResolve && onResolve ? (
            <Button
              size="small"
              variant="outlined"
              onClick={onResolve}
              data-testid="cob-denial-resolve"
              sx={secondaryActionSx}
            >
              Clear this flag
            </Button>
          ) : null}
        </>
      }
    >
      <Box sx={detailBoxSx} data-testid="cob-denial-detail">
        <Stack direction="row" spacing={2} flexWrap="wrap" useFlexGap>
          <Detail label="Claim" value={detail.claimNumber || detail.claimId || '—'} />
          <Detail label="Payer" value={detail.carrierName || '—'} />
          <Detail
            label="Denied on"
            value={detail.deniedAt ? formatDate(detail.deniedAt) : '—'}
          />
          <Detail
            label="Reason code"
            value={[detail.groupCode, detail.reasonCode].filter(Boolean).join(' / ') || '—'}
          />
        </Stack>

        <Typography
          sx={{ fontFamily: 'Inter', fontSize: fontSize.base, color: COLORS.TEXT_BODY, mt: 1 }}
        >
          {detail.denialReason || 'The payer did not give a reason beyond the coordination denial.'}
        </Typography>
      </Box>
    </FlagBannerShell>
  );
};

const Detail = ({ label, value }) => (
  <Box>
    <Typography
      sx={{
        fontFamily: 'Inter',
        fontSize: fontSize.xs,
        textTransform: 'uppercase',
        letterSpacing: '0.4px',
        color: COLORS.TEXT_MUTED,
      }}
    >
      {label}
    </Typography>
    <Typography
      sx={{ fontFamily: 'Inter', fontSize: fontSize.base, fontWeight: fontWeight.medium, color: COLORS.TEXT_PRIMARY }}
    >
      {value}
    </Typography>
  </Box>
);

export default CobDenialBanner;
