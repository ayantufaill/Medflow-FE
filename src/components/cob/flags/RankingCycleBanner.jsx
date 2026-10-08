import FlagBannerShell from './FlagBannerShell';
import { REVIEW_FLAGS } from '../../../constants/cobConstants';

/**
 * The rules produced a cycle (A before B, B before A). There is no automatic
 * answer, so the only action is "set the order by hand" — which opens the
 * override dialog.
 *
 * When the user lacks `insurance.coverage_order.override` the button is
 * disabled rather than hidden: they still need to know why the order is
 * missing, and who to ask.
 */
const RankingCycleBanner = ({ onOpenOverride, canOverride = true }) => (
  <FlagBannerShell
    flag={REVIEW_FLAGS.RANKING_CYCLE}
    onAction={onOpenOverride}
    actionDisabled={!canOverride}
    bodyOverride={
      canOverride
        ? undefined
        : 'The plans point at each other, so no automatic order is possible. Ask a billing ' +
          'administrator to set the order by hand.'
    }
  />
);

export default RankingCycleBanner;
