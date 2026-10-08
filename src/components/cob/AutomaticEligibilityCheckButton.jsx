import { Button, Tooltip } from '@mui/material';
import { BoltOutlined as BoltIcon } from '@mui/icons-material';
import { isAutoEligibilityEnabled } from '../../config/featureFlags';
import { COLORS } from '../../constants/colors';
import { fontSize, fontWeight, radius } from '../../constants/styles';

/**
 * Placeholder for the automatic eligibility check.
 *
 * Hidden behind `VITE_FEATURE_AUTO_ELIGIBILITY` because there is no
 * clearinghouse integration yet. The component exists now so that the button's
 * place in the layout, its permission check and its call site are settled —
 * when the integration lands, only `cobVerificationService
 * .runAutomaticEligibilityCheck` has to become real.
 *
 * The flag is read at render time (not module load) through
 * `config/featureFlags`, so a test can flip it without re-importing.
 */
const AutomaticEligibilityCheckButton = ({ onRun, running = false, enabled }) => {
  // `enabled` can be forced by a caller (and by tests); otherwise the flag decides.
  if (!(enabled ?? isAutoEligibilityEnabled())) return null;

  return (
    <Tooltip title="Ask the clearinghouse what this payer has on file for the patient">
      <Button
        size="small"
        variant="outlined"
        startIcon={<BoltIcon sx={{ fontSize: 16 }} />}
        onClick={onRun}
        disabled={running}
        data-testid="cob-auto-eligibility"
        sx={{
          fontFamily: 'Inter',
          fontSize: fontSize.base,
          fontWeight: fontWeight.medium,
          textTransform: 'none',
          borderRadius: radius.md,
          borderColor: COLORS.BORDER,
          color: COLORS.TEXT_BODY,
        }}
      >
        {running ? 'Checking…' : 'Check eligibility automatically'}
      </Button>
    </Tooltip>
  );
};

export default AutomaticEligibilityCheckButton;
