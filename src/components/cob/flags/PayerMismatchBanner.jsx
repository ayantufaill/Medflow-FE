import { useState } from 'react';
import {
  Alert,
  Box,
  Button,
  Divider,
  Grid,
  Stack,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material';
import FlagBannerShell from './FlagBannerShell';
import { detailBoxSx, secondaryActionSx } from './flagBannerStyles';
import { COLORS } from '../../../constants/colors';
import { fontSize, fontWeight, radius } from '../../../constants/styles';
import {
  REVIEW_FLAGS,
  ELIGIBILITY_SOURCES,
  positionLabel,
  MIN_OVERRIDE_REASON_LENGTH,
  MIN_RESOLUTION_NOTE_LENGTH,
} from '../../../constants/cobConstants';
import { formatDate } from '../../../utils/dateUtils';

const sourceLabel = (source) =>
  ELIGIBILITY_SOURCES.find((s) => s.value === source)?.label || source || 'Unknown source';

/**
 * Side-by-side: our suggestion against what the insurer reported.
 *
 * THE CORE PRINCIPLE OF THIS SCREEN: the system suggests, the insurer decides.
 * So the two columns carry equal weight and the insurer's column carries its
 * provenance (who said it, how, and when) — a biller deciding whether to trust
 * a six-month-old phone note against yesterday's eligibility response needs
 * that date far more than they need our confidence.
 *
 * THREE RESOLUTIONS, BUILT FROM TWO BACKEND PRIMITIVES:
 *
 *   • Use the insurer's order  → override (new version, re-ranked) THEN
 *                                resolve-flag. Both, because adopting the
 *                                payer's order overrules the rules and the
 *                                flag still needs the note saying why.
 *   • Keep our order           → resolve-flag with the reason as the note.
 *   • Mark as re-checked       → resolve-flag with the re-check note.
 *
 * "Use the insurer's order" is only offered when the payer actually named a
 * position for every coverage we hold. Usually they name only themselves, and
 * the override endpoint replaces the WHOLE order — submitting a partial
 * ranking would silently drop a coverage. When that is the case the button is
 * disabled and says so, and the user is pointed at the manual override.
 */
const PayerMismatchBanner = ({
  flag,
  comparison,
  report,
  reportedRanking,
  onAcceptPayer,
  onKeepOurs,
  onMarkReChecked,
  onOpenOverride,
  canOverride = true,
  busy = false,
}) => {
  // Each path needs its own free text, so the textarea opens under whichever
  // one was chosen rather than sitting there implying all three need it.
  const [panel, setPanel] = useState(null);
  const [text, setText] = useState('');

  const ours = comparison?.ours || [];
  const theirs = comparison?.theirs || [];

  const canAcceptPayer = Array.isArray(reportedRanking) && reportedRanking.length > 0;

  const open = (which) => {
    setPanel((current) => (current === which ? null : which));
    setText('');
  };

  // "Use the insurer's order" writes an override, whose reason the backend
  // requires to be at least 10 characters; the other two only write a
  // resolution note, minimum 5.
  const minLength = panel === 'accept' ? MIN_OVERRIDE_REASON_LENGTH : MIN_RESOLUTION_NOTE_LENGTH;
  const tooShort = text.trim().length < minLength;

  const PANELS = {
    accept: {
      label: "Why are we adopting the insurer's order?",
      helper: `Required, at least ${MIN_OVERRIDE_REASON_LENGTH} characters. This becomes the override reason on the new order version.`,
      testId: 'cob-mismatch-accept-submit',
      submitLabel: "Save the insurer's order",
      run: () => onAcceptPayer?.(flag, text.trim()),
    },
    keep: {
      label: 'Why are we keeping our order?',
      helper: 'Required. This is what the next person sees when the payer asks again.',
      testId: 'cob-mismatch-keep-ours-submit',
      submitLabel: 'Save and keep our order',
      run: () => onKeepOurs?.(flag, text.trim()),
    },
    recheck: {
      label: 'What did they say when you re-checked?',
      helper: 'Required. Record who you spoke to and what they confirmed.',
      testId: 'cob-mismatch-recheck-submit',
      submitLabel: 'Save the re-check',
      run: () => onMarkReChecked?.(flag, text.trim()),
    },
  };

  const activePanel = panel ? PANELS[panel] : null;

  return (
    <FlagBannerShell
      flag={REVIEW_FLAGS.PAYER_MISMATCH}
      onAction={canAcceptPayer ? () => open('accept') : undefined}
      actionLabel="Use the insurer's order"
      actionDisabled={busy}
      secondaryActions={
        <>
          <Button
            size="small"
            variant="outlined"
            onClick={() => open('keep')}
            disabled={busy}
            data-testid="cob-mismatch-keep-ours"
            sx={secondaryActionSx}
          >
            Keep our order
          </Button>
          <Button
            size="small"
            variant="outlined"
            onClick={() => open('recheck')}
            disabled={busy}
            data-testid="cob-mismatch-mark-rechecked"
            sx={secondaryActionSx}
          >
            Mark as re-checked
          </Button>
        </>
      }
    >
      <Box sx={detailBoxSx} data-testid="cob-mismatch-comparison">
        <Grid container spacing={2}>
          <Grid size={{ xs: 12, sm: 6 }}>
            <ComparisonColumn
              heading="What we worked out"
              testId="cob-mismatch-ours"
              rows={ours}
              emptyText="We have no order of our own yet."
            />
          </Grid>

          {/* Horizontal rule on small screens, vertical on wide ones: the two
              columns must never visually merge into one list. */}
          <Grid size={{ xs: 12 }} sx={{ display: { xs: 'block', sm: 'none' } }}>
            <Divider />
          </Grid>

          <Grid
            size={{ xs: 12, sm: 6 }}
            sx={{ borderLeft: { sm: `1px solid ${COLORS.BORDER}` }, pl: { sm: 2 } }}
          >
            <ComparisonColumn
              heading="What the insurer reported"
              testId="cob-mismatch-theirs"
              rows={theirs}
              emptyText="The insurer did not name an order."
            />

            <Typography
              data-testid="cob-mismatch-provenance"
              sx={{ fontFamily: 'Inter', fontSize: fontSize.sm, color: COLORS.TEXT_MUTED, mt: 1 }}
            >
              {sourceLabel(report?.source)}
              {report?.reportingCarrierName ? ` · ${report.reportingCarrierName}` : ''}
              {report?.reportedDate ? ` · ${formatDate(report.reportedDate)}` : ''}
            </Typography>

            {report?.note && (
              <Typography
                data-testid="cob-mismatch-note"
                sx={{
                  fontFamily: 'Inter',
                  fontSize: fontSize.sm,
                  color: COLORS.TEXT_SECONDARY,
                  mt: 0.5,
                  fontStyle: 'italic',
                }}
              >
                “{report.note}”
              </Typography>
            )}
          </Grid>
        </Grid>
      </Box>

      {/* The payer named only part of the order, so it cannot be adopted
          wholesale — say so where the button would have been. */}
      {!canAcceptPayer && (
        <Alert
          severity="info"
          data-testid="cob-mismatch-partial-report"
          sx={{ mt: 1.5, fontFamily: 'Inter', fontSize: fontSize.base }}
          action={
            canOverride ? (
              <Button size="small" onClick={onOpenOverride} sx={secondaryActionSx}>
                Set the order
              </Button>
            ) : null
          }
        >
          The insurer only named part of the order, so we can&apos;t apply it as-is.
          {canOverride
            ? ' Set the order by hand once you know where every plan sits.'
            : ' Ask a billing administrator to set the order by hand.'}
        </Alert>
      )}

      {activePanel && (
        <Box sx={{ mt: 1.5 }} data-testid={`cob-mismatch-panel-${panel}`}>
          <TextField
            fullWidth
            multiline
            minRows={2}
            autoFocus
            label={activePanel.label}
            value={text}
            onChange={(e) => setText(e.target.value)}
            inputProps={{ 'aria-label': activePanel.label }}
            helperText={activePanel.helper}
            sx={{ backgroundColor: COLORS.SURFACE_CARD, borderRadius: radius.md }}
          />
          <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
            <Tooltip title={tooShort ? `At least ${minLength} characters.` : ''}>
              <span>
                <Button
                  size="small"
                  variant="contained"
                  disableElevation
                  disabled={tooShort || busy}
                  onClick={activePanel.run}
                  data-testid={activePanel.testId}
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
                  {activePanel.submitLabel}
                </Button>
              </span>
            </Tooltip>
            <Button
              size="small"
              variant="text"
              onClick={() => setPanel(null)}
              sx={{ fontFamily: 'Inter', fontSize: fontSize.base, textTransform: 'none' }}
            >
              Cancel
            </Button>
          </Stack>
        </Box>
      )}
    </FlagBannerShell>
  );
};

const ComparisonColumn = ({ heading, rows, emptyText, testId }) => (
  <Box data-testid={testId}>
    <Typography
      component="h5"
      sx={{
        fontFamily: 'Inter',
        fontSize: fontSize.sm,
        fontWeight: fontWeight.bold,
        textTransform: 'uppercase',
        letterSpacing: '0.4px',
        color: COLORS.TEXT_MUTED,
        mb: 0.75,
      }}
    >
      {heading}
    </Typography>

    {rows.length === 0 ? (
      <Typography sx={{ fontFamily: 'Inter', fontSize: fontSize.base, color: COLORS.TEXT_SECONDARY }}>
        {emptyText}
      </Typography>
    ) : (
      <Box component="ol" sx={{ m: 0, p: 0 }}>
        {rows.map((row) => (
          <Box
            component="li"
            key={`${row.position}-${row.coverageId ?? row.label}`}
            sx={{ listStyle: 'none', mb: 0.5 }}
          >
            <Typography
              sx={{
                fontFamily: 'Inter',
                fontSize: fontSize.base,
                fontWeight: fontWeight.medium,
                color: COLORS.TEXT_PRIMARY,
              }}
            >
              {positionLabel(row.position)}: {row.label}
            </Typography>
            {row.explanation && (
              <Typography
                sx={{ fontFamily: 'Inter', fontSize: fontSize.sm, color: COLORS.TEXT_SECONDARY }}
              >
                {row.explanation}
              </Typography>
            )}
          </Box>
        ))}
      </Box>
    )}
  </Box>
);

export default PayerMismatchBanner;
