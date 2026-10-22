import { Typography } from '@mui/material';
import FlagBannerShell from './FlagBannerShell';
import { detailBoxSx } from './flagBannerStyles';
import { REVIEW_FLAGS } from '../../../constants/cobConstants';
import { fontSize } from '../../../constants/styles';
import { formatDate } from '../../../utils/dateUtils';

/**
 * Something about the coverage changed after the order was worked out.
 *
 * Raised in particular when a re-evaluation carried a staff override forward:
 * the backend deliberately does not discard an override, so it flags it for
 * the biller to look again rather than silently keeping or dropping it.
 */
const CoverageChangedBanner = ({ flag, onReview, canResolve = true }) => {
  const detail = flag?.detail || {};

  return (
    <FlagBannerShell
      flag={REVIEW_FLAGS.COVERAGE_CHANGED}
      onAction={onReview}
      actionDisabled={!canResolve}
    >
      {(detail.changedFields?.length || detail.changedAt || detail.explanation) && (
        <Typography
          component="div"
          data-testid="cob-coverage-changed-detail"
          sx={{ ...detailBoxSx, fontFamily: 'Inter', fontSize: fontSize.base }}
        >
          {detail.explanation ? `${detail.explanation} ` : ''}
          {detail.changedFields?.length ? `Changed: ${detail.changedFields.join(', ')}. ` : ''}
          {detail.changedAt ? `Recorded ${formatDate(detail.changedAt)}.` : ''}
        </Typography>
      )}
    </FlagBannerShell>
  );
};

export default CoverageChangedBanner;
