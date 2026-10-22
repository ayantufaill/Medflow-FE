import { useEffect, useState } from 'react';
import { Button, TextField, Typography } from '@mui/material';
import BaseDialog from '../../shared/BaseDialog';
import { COLORS } from '../../../constants/colors';
import { fontSize, fontWeight, radius } from '../../../constants/styles';
import {
  REVIEW_FLAG_META,
  MIN_RESOLUTION_NOTE_LENGTH,
} from '../../../constants/cobConstants';

/**
 * "What did you find?" — the note every flag resolution requires.
 *
 * The backend's `resolveFlagValidator` demands a `resolutionNote` of at least
 * five characters on EVERY flag, and that is the right call rather than
 * friction: resolving a flag is what unblocks billing, so the record of why
 * has to exist. One shared dialog means each banner's action is still a single
 * click away from done, and the prompt is worded per flag so the note is about
 * the thing that was actually checked.
 *
 * The note is never prefilled. A default would be worse than no note at all —
 * it would read as a finding nobody made.
 */
const PROMPTS = {
  NEITHER_PLAN_COORDINATES: {
    label: 'What did the payers say?',
    placeholder: 'e.g. Called both payers 8 Oct — Aetna confirmed they pay first, Cigna agreed.',
  },
  RANKING_CYCLE: {
    label: 'How was the order decided?',
    placeholder: 'e.g. Set by hand after calling both payers; Aetna is primary per their rep.',
  },
  PAYER_MISMATCH: {
    label: 'How was the disagreement settled?',
    placeholder: 'e.g. Aetna reconfirmed they are secondary; call ref 5512.',
  },
  COB_DENIAL: {
    label: 'What did the payer say when you re-checked?',
    placeholder: 'e.g. Aetna confirmed they are secondary; denial was their error, resubmitting.',
  },
  COVERAGE_CHANGED: {
    label: 'What changed, and is the order still right?',
    placeholder: 'e.g. Member ID corrected; order unchanged and still correct.',
  },
};

const ResolveFlagDialog = ({ open, onClose, flag, onSubmit, saving = false }) => {
  const [note, setNote] = useState('');

  useEffect(() => {
    if (open) setNote('');
  }, [open]);

  const prompt = PROMPTS[flag] || {
    label: 'What did you find?',
    placeholder: 'Record what you checked and what you concluded.',
  };
  const title = REVIEW_FLAG_META[flag]?.title || 'Resolve this flag';

  const tooShort = note.trim().length < MIN_RESOLUTION_NOTE_LENGTH;

  return (
    <BaseDialog
      open={open}
      onClose={onClose}
      title={title}
      maxWidth="sm"
      loading={saving}
      showCloseButton
      actions={
        <>
          <Button
            onClick={onClose}
            sx={{ fontFamily: 'Inter', fontSize: fontSize.base, textTransform: 'none' }}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            disableElevation
            onClick={() => onSubmit?.(note.trim())}
            disabled={tooShort || saving}
            data-testid="cob-resolve-flag-submit"
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
            Save and clear this flag
          </Button>
        </>
      }
    >
      <Typography
        sx={{ fontFamily: 'Inter', fontSize: fontSize.base, color: COLORS.TEXT_SECONDARY, mb: 2 }}
      >
        Clearing this is what lets claims go out again, so the next person needs to be able to see
        what you checked.
      </Typography>

      <TextField
        fullWidth
        required
        multiline
        minRows={3}
        autoFocus
        label={prompt.label}
        placeholder={prompt.placeholder}
        value={note}
        onChange={(e) => setNote(e.target.value)}
        inputProps={{ 'aria-label': prompt.label }}
        data-testid="cob-resolve-flag-note"
        helperText={
          tooShort
            ? `At least ${MIN_RESOLUTION_NOTE_LENGTH} characters.`
            : 'Saved against this order permanently.'
        }
      />
    </BaseDialog>
  );
};

export default ResolveFlagDialog;
