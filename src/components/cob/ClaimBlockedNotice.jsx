import { Alert, AlertTitle, Box, Typography } from '@mui/material';
import { fontSize, fontWeight } from '../../constants/styles';

/**
 * "Claims are blocked, and here is why."
 *
 * Rendered only when there is something blocking (see `getClaimBlockers`).
 * Deliberately lists every reason rather than the first one: a front-desk user
 * who fixes the missing DOB and then hits a payer mismatch they were never
 * told about will conclude the system is broken.
 */
const ClaimBlockedNotice = ({ blockers = [] }) => {
  if (!blockers.length) return null;

  return (
    <Alert
      severity="error"
      data-testid="cob-claim-blocked"
      // `role="alert"` is implicit on MUI Alert; the explicit test id is what
      // the blocking-status test keys off.
      sx={{ mb: 2, fontFamily: 'Inter', fontSize: fontSize.base, alignItems: 'flex-start' }}
    >
      <AlertTitle sx={{ fontFamily: 'Inter', fontSize: fontSize.md, fontWeight: fontWeight.semibold }}>
        Claims are on hold for this patient
      </AlertTitle>
      <Box component="ul" sx={{ m: 0, pl: 2.5 }}>
        {blockers.map((reason) => (
          <Typography
            component="li"
            key={reason}
            sx={{ fontFamily: 'Inter', fontSize: fontSize.base, mb: 0.25 }}
          >
            {reason}
          </Typography>
        ))}
      </Box>
    </Alert>
  );
};

export default ClaimBlockedNotice;
