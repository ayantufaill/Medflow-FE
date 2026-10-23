import { COLORS } from '../../../constants/colors';

// Keys cover both the check result status and the stored verificationStatus.
export const ELIGIBILITY_STATUS = {
  active: { label: 'Active', color: COLORS.STATUS_SUCCESS },
  verified: { label: 'Verified', color: COLORS.STATUS_SUCCESS },
  inactive: { label: 'Inactive', color: COLORS.STATUS_WARNING },
  error: { label: 'Check failed', color: COLORS.STATUS_ERROR },
  failed: { label: 'Check failed', color: COLORS.STATUS_ERROR },
};
