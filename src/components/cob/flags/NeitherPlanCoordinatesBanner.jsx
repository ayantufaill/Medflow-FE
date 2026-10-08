import FlagBannerShell from './FlagBannerShell';
import { REVIEW_FLAGS } from '../../../constants/cobConstants';

/**
 * Both plans say they do not coordinate, so each may pay in full — which
 * leaves the practice holding an overpayment it has to refund.
 *
 * The action opens the resolution prompt; it does NOT change the order. The
 * system cannot know what the payers will do, and a human confirming with both
 * of them is the only thing that settles it.
 */
const NeitherPlanCoordinatesBanner = ({ onResolve, canResolve = true }) => (
  <FlagBannerShell
    flag={REVIEW_FLAGS.NEITHER_PLAN_COORDINATES}
    onAction={onResolve}
    actionDisabled={!canResolve}
    bodyOverride={
      canResolve
        ? undefined
        : 'Both plans may pay in full, which can leave the patient overpaid and the practice ' +
          'owing a refund. Ask a biller to confirm with both payers and clear this.'
    }
  />
);

export default NeitherPlanCoordinatesBanner;
