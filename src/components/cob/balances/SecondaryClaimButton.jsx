import { Button, Tooltip } from '@mui/material';
import { COLORS } from '../../../constants/colors';
import { fontSize, fontWeight, radius } from '../../../constants/styles';
import { SECONDARY_CLAIM_BLOCKED_TOOLTIP } from '../../../constants/cobConstants';

/**
 * "Create secondary claim", gated on the primary's remittance being posted.
 *
 * Disabled rather than hidden, with the reason in a tooltip: the biller is
 * looking for this button and needs to be told what they are waiting for,
 * not left wondering whether the feature exists.
 *
 * The tooltip wraps a <span> because MUI will not show a tooltip over a
 * disabled button (it stops firing pointer events).
 */
const SecondaryClaimButton = ({ readiness, onCreate, creating = false }) => {
  // The endpoint's field is `posted`, not `canCreate`: a $0 denial counts as
  // posted, because a denial IS an adjudication and the secondary is entitled
  // to carry it. Gating on "was there money" would strand exactly the patients
  // who most need the secondary billed.
  const canCreate = readiness?.posted === true;
  const reason = canCreate
    ? ''
    : readiness?.reason || SECONDARY_CLAIM_BLOCKED_TOOLTIP;

  return (
    <Tooltip title={reason}>
      <span data-testid="cob-secondary-claim-wrapper">
        <Button
          variant="contained"
          disableElevation
          size="small"
          onClick={onCreate}
          disabled={!canCreate || creating}
          data-testid="cob-create-secondary-claim"
          // The accessible name carries the reason too, so a screen-reader
          // user hears why the control is unavailable instead of just "dimmed".
          aria-label={canCreate ? 'Create secondary claim' : `Create secondary claim. ${reason}`}
          sx={{
            fontFamily: 'Inter',
            fontSize: fontSize.base,
            fontWeight: fontWeight.semibold,
            textTransform: 'none',
            borderRadius: radius.md,
            backgroundColor: COLORS.ACCENT,
            '&:hover': { backgroundColor: COLORS.ACCENT_HOVER },
          }}
        >
          {creating ? 'Creating…' : 'Create secondary claim'}
        </Button>
      </span>
    </Tooltip>
  );
};

export default SecondaryClaimButton;
