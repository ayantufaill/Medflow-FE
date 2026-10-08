import { useEffect, useState } from 'react';
import {
  Box,
  Button,
  Grid,
  MenuItem,
  TextField,
  Typography,
} from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';
import BaseDialog from '../shared/BaseDialog';
import { COLORS } from '../../constants/colors';
import { fontSize, fontWeight, radius } from '../../constants/styles';
import { ELIGIBILITY_SOURCES, positionLabel } from '../../constants/cobConstants';
import { formatDateForPayload } from '../../utils/dateUtils';

const EMPTY = {
  reportingCarrierId: '',
  coverageId: '',
  reportedIsActive: 'true',
  otherPayerName: '',
  reportedSelfOrder: '',
  otherPayerReportedOrder: '',
  source: 'PHONE',
  referenceNumber: '',
  reportedDate: null,
  note: '',
};

/**
 * "Record what the insurer said" — the manual eligibility form.
 *
 * This is the input side of the system-suggests/insurer-decides split. It
 * records the insurer's claim as a separate fact; it never edits our order.
 * The backend compares the two and raises PAYER_MISMATCH if they disagree,
 * which is why there is no "and set the order to this" checkbox here: that
 * decision belongs to a human looking at the side-by-side view.
 *
 * `referenceNumber` is the call reference or portal transaction id. The
 * endpoint has no field for it, so it is folded into `note` on submit — it is
 * the first thing a payer asks for when a claim is appealed, so losing it
 * would be worse than the small inelegance.
 */
const RecordPayerStatementDialog = ({
  open,
  onClose,
  carriers = [],
  coverages = [],
  onSubmit,
  saving = false,
  defaultCarrierId = '',
}) => {
  const [values, setValues] = useState(EMPTY);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (open) {
      setValues({
        ...EMPTY,
        reportingCarrierId: defaultCarrierId || '',
        // Defaulting to today is right far more often than not: staff fill
        // this in while still on the call.
        reportedDate: dayjs(),
      });
      setErrors({});
    }
  }, [open, defaultCarrierId]);

  const set = (field) => (eventOrValue) => {
    const value = eventOrValue?.target ? eventOrValue.target.value : eventOrValue;
    setValues((current) => ({ ...current, [field]: value }));
  };

  const handleSubmit = () => {
    const nextErrors = {};
    if (!values.reportingCarrierId) nextErrors.reportingCarrierId = 'Which payer did you speak to?';
    if (!values.source) nextErrors.source = 'How did you get this?';
    if (!values.reportedDate) nextErrors.reportedDate = 'When did they tell you?';

    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;

    // The endpoint has no reference-number field, so it is prefixed onto the
    // note rather than dropped — a biller appealing a denial needs it.
    const noteParts = [
      values.referenceNumber.trim() ? `Ref ${values.referenceNumber.trim()}` : '',
      values.note.trim(),
    ].filter(Boolean);

    onSubmit?.({
      reportingCarrierId: values.reportingCarrierId || undefined,
      // Which of OUR coverages the payer was talking about, when we know.
      coverageId: values.coverageId || undefined,
      reportedIsActive: values.reportedIsActive === '' ? undefined : values.reportedIsActive === 'true',
      otherPayerName: values.otherPayerName.trim() || undefined,
      // Empty string -> undefined rather than 0: "they didn't say" and "they
      // said position zero" are different facts and only one of them is real.
      reportedSelfOrder: values.reportedSelfOrder === '' ? undefined : Number(values.reportedSelfOrder),
      otherPayerReportedOrder:
        values.otherPayerReportedOrder === '' ? undefined : Number(values.otherPayerReportedOrder),
      source: values.source,
      reportedDate: formatDateForPayload(values.reportedDate),
      note: noteParts.length ? noteParts.join(' — ') : undefined,
    });
  };

  return (
    <BaseDialog
      open={open}
      onClose={onClose}
      title="Record what the insurer said"
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
            onClick={handleSubmit}
            disabled={saving}
            data-testid="cob-record-payer-submit"
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
            Save what they said
          </Button>
        </>
      }
    >
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <Typography
          sx={{ fontFamily: 'Inter', fontSize: fontSize.base, color: COLORS.TEXT_SECONDARY, mb: 2 }}
        >
          Write down exactly what the payer told you. We keep it separately from our own working —
          if the two disagree, we will flag it for review rather than quietly changing the order.
        </Typography>

        <Grid container spacing={2}>
          <Grid size={{ xs: 12, sm: 6 }} >
            <TextField
              select
              fullWidth
              required
              label="Which payer did you speak to?"
              value={values.reportingCarrierId}
              onChange={set('reportingCarrierId')}
              error={!!errors.reportingCarrierId}
              helperText={errors.reportingCarrierId}
              data-testid="cob-record-payer-carrier"
              SelectProps={{ inputProps: { 'aria-label': 'Which payer did you speak to?' } }}
            >
              {carriers.map((carrier) => (
                <MenuItem key={carrier.id} value={carrier.id}>
                  {carrier.name}
                </MenuItem>
              ))}
            </TextField>
          </Grid>

          <Grid size={{ xs: 12, sm: 6 }} >
            <TextField
              select
              fullWidth
              required
              label="How did you get this?"
              value={values.source}
              onChange={set('source')}
              error={!!errors.source}
              helperText={errors.source}
              data-testid="cob-record-payer-source"
              SelectProps={{ inputProps: { 'aria-label': 'How did you get this?' } }}
            >
              {ELIGIBILITY_SOURCES.map((source) => (
                <MenuItem key={source.value} value={source.value}>
                  {source.label}
                </MenuItem>
              ))}
            </TextField>
          </Grid>

          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              select
              fullWidth
              label="Which of this patient's policies?"
              value={values.coverageId}
              onChange={set('coverageId')}
              data-testid="cob-record-payer-coverage"
              SelectProps={{ inputProps: { 'aria-label': "Which of this patient's policies?" } }}
              helperText="Leave blank if you're not sure which policy they meant."
            >
              <MenuItem value="">Not sure</MenuItem>
              {coverages.map((coverage) => (
                <MenuItem key={coverage.id} value={coverage.id}>
                  {[coverage.carrierName, coverage.planName].filter(Boolean).join(' — ') ||
                    `Policy ${coverage.id}`}
                </MenuItem>
              ))}
            </TextField>
          </Grid>

          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              fullWidth
              label="Other coverage they told you about"
              placeholder="e.g. Blue Cross of Texas"
              value={values.otherPayerName}
              onChange={set('otherPayerName')}
              inputProps={{ 'aria-label': 'Other coverage they told you about' }}
              helperText="Leave blank if they said there is no other coverage."
            />
          </Grid>

          <Grid size={{ xs: 12, sm: 6 }} >
            <TextField
              select
              fullWidth
              label="Where did they say they pay?"
              value={values.reportedSelfOrder}
              onChange={set('reportedSelfOrder')}
              data-testid="cob-record-payer-self-order"
              SelectProps={{ inputProps: { 'aria-label': 'Where did they say they pay?' } }}
            >
              <MenuItem value="">They didn&apos;t say</MenuItem>
              {[1, 2, 3].map((position) => (
                <MenuItem key={position} value={position}>
                  {positionLabel(position)}
                </MenuItem>
              ))}
            </TextField>
          </Grid>

          <Grid size={{ xs: 12, sm: 6 }} >
            <TextField
              select
              fullWidth
              label="Where did they put the other plan?"
              value={values.otherPayerReportedOrder}
              onChange={set('otherPayerReportedOrder')}
              SelectProps={{ inputProps: { 'aria-label': 'Where did they put the other plan?' } }}
            >
              <MenuItem value="">They didn&apos;t say</MenuItem>
              {[1, 2, 3].map((position) => (
                <MenuItem key={position} value={position}>
                  {positionLabel(position)}
                </MenuItem>
              ))}
            </TextField>
          </Grid>

          <Grid size={{ xs: 12, sm: 6 }} >
            <TextField
              fullWidth
              label="Call or transaction reference"
              value={values.referenceNumber}
              onChange={set('referenceNumber')}
              inputProps={{ 'aria-label': 'Call or transaction reference' }}
              helperText="The payer will ask for this if the claim is appealed."
            />
          </Grid>

          <Grid size={{ xs: 12, sm: 6 }} >
            <DatePicker
              label="When did they tell you?"
              value={values.reportedDate}
              onChange={set('reportedDate')}
              slotProps={{
                textField: {
                  fullWidth: true,
                  required: true,
                  error: !!errors.reportedDate,
                  helperText: errors.reportedDate,
                  inputProps: { 'aria-label': 'When did they tell you?' },
                },
              }}
            />
          </Grid>

          <Grid size={{ xs: 12 }} >
            <TextField
              fullWidth
              multiline
              minRows={2}
              label="Notes from the call"
              value={values.note}
              onChange={set('note')}
              inputProps={{ 'aria-label': 'Notes from the call' }}
            />
          </Grid>
        </Grid>
      </LocalizationProvider>
    </BaseDialog>
  );
};

export default RecordPayerStatementDialog;
