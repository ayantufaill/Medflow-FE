import { Alert, AlertTitle, Box, Button, Stack, Typography } from '@mui/material';
import { COLORS } from '../../../constants/colors';
import { fontSize, fontWeight, radius } from '../../../constants/styles';
import { REVIEW_FLAG_META } from '../../../constants/cobConstants';

/**
 * Common chrome for every flag banner: severity, title, body, one primary
 * action, and room for extra detail.
 *
 * Every flag gets exactly one primary action by design. A banner the user can
 * only read is a banner they learn to scroll past, which is how a blocked
 * claim sits untouched for a week.
 */
const FlagBannerShell = ({
  flag,
  children,
  actionLabel,
  onAction,
  actionDisabled = false,
  secondaryActions,
  titleOverride,
  bodyOverride,
}) => {
  const meta = REVIEW_FLAG_META[flag] || { severity: 'warning', title: flag, body: '' };

  return (
    <Alert
      severity={meta.severity}
      data-testid={`cob-flag-${flag}`}
      sx={{
        mb: 1.5,
        fontFamily: 'Inter',
        borderRadius: radius.lg,
        alignItems: 'flex-start',
        '& .MuiAlert-message': { width: '100%' },
      }}
    >
      <AlertTitle
        sx={{ fontFamily: 'Inter', fontSize: fontSize.md, fontWeight: fontWeight.semibold, mb: 0.5 }}
      >
        {titleOverride || meta.title}
      </AlertTitle>

      <Typography
        sx={{ fontFamily: 'Inter', fontSize: fontSize.base, color: COLORS.TEXT_BODY, mb: children ? 1 : 1.5 }}
      >
        {bodyOverride || meta.body}
      </Typography>

      {children}

      <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap sx={{ mt: 1.5 }}>
        {onAction && (
          <Button
            size="small"
            variant="contained"
            disableElevation
            onClick={onAction}
            disabled={actionDisabled}
            data-testid={`cob-flag-action-${flag}`}
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
            {actionLabel || meta.actionLabel}
          </Button>
        )}
        {secondaryActions}
      </Stack>
    </Alert>
  );
};

export default FlagBannerShell;
