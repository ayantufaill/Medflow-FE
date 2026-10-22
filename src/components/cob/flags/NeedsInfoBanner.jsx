import { Alert, AlertTitle, Box, Button, Typography } from '@mui/material';
import { COLORS } from '../../../constants/colors';
import { fontSize, fontWeight, radius } from '../../../constants/styles';
import { missingFieldLabel, missingFieldSection } from '../../../constants/cobConstants';

/**
 * NEEDS_INFO is an order *status*, not a flag row, so it has its own banner
 * rather than going through FlagBannerShell.
 *
 * Each missing field is a button, not a bullet: "open the form at the thing
 * that's missing" is one click, and the user never has to hunt a 30-field
 * form for the one empty box. The field path is passed back up so the form
 * can scroll to and focus the right input.
 */
const NeedsInfoBanner = ({ missingFields = [], onFixField }) => {
  if (!missingFields.length) return null;

  return (
    <Alert
      severity="warning"
      data-testid="cob-flag-NEEDS_INFO"
      sx={{ mb: 1.5, fontFamily: 'Inter', borderRadius: radius.lg, alignItems: 'flex-start' }}
    >
      <AlertTitle
        sx={{ fontFamily: 'Inter', fontSize: fontSize.md, fontWeight: fontWeight.semibold, mb: 0.5 }}
      >
        We need a few more answers before we can work out who pays first
      </AlertTitle>

      <Typography sx={{ fontFamily: 'Inter', fontSize: fontSize.base, color: COLORS.TEXT_BODY, mb: 1 }}>
        {missingFields.length === 1 ? 'One answer is' : `${missingFields.length} answers are`} missing:
      </Typography>

      <Box component="ul" sx={{ m: 0, p: 0, display: 'flex', flexDirection: 'column', gap: 0.5 }}>
        {missingFields.map((item) => {
          // The backend sends `{ coverageId, field }`; a bare string is also
          // accepted so the banner survives a simpler payload.
          const field = typeof item === 'string' ? item : item.field;
          const coverageId = typeof item === 'string' ? undefined : item.coverageId;
          const key = `${coverageId || 'any'}:${field}`;

          return (
            <Box component="li" key={key} sx={{ listStyle: 'none' }}>
              <Button
                size="small"
                variant="text"
                onClick={() => onFixField?.({ field, coverageId, section: missingFieldSection(field) })}
                data-testid={`cob-missing-field-${field}`}
                sx={{
                  fontFamily: 'Inter',
                  fontSize: fontSize.base,
                  fontWeight: fontWeight.medium,
                  textTransform: 'none',
                  justifyContent: 'flex-start',
                  color: COLORS.ACCENT,
                  p: 0.25,
                }}
              >
                {missingFieldLabel(field)}
                {item?.carrierName ? ` (${item.carrierName})` : ''}
              </Button>
            </Box>
          );
        })}
      </Box>

      <Button
        size="small"
        variant="contained"
        disableElevation
        onClick={() => onFixField?.({ section: missingFieldSection(
          typeof missingFields[0] === 'string' ? missingFields[0] : missingFields[0]?.field
        ) })}
        data-testid="cob-flag-action-NEEDS_INFO"
        sx={{
          mt: 1.5,
          fontFamily: 'Inter',
          fontSize: fontSize.base,
          fontWeight: fontWeight.semibold,
          textTransform: 'none',
          borderRadius: radius.md,
          backgroundColor: COLORS.ACCENT,
          '&:hover': { backgroundColor: COLORS.ACCENT_HOVER },
        }}
      >
        Fill in the missing answers
      </Button>
    </Alert>
  );
};

export default NeedsInfoBanner;
