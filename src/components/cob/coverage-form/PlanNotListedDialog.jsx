import { useEffect, useState } from 'react';
import { Button, Grid, TextField, Typography } from '@mui/material';
import BaseDialog from '../../shared/BaseDialog';
import { COLORS } from '../../../constants/colors';
import { fontSize, fontWeight, radius } from '../../../constants/styles';

/**
 * "The plan isn't in the list."
 *
 * This records a request and notifies a billing admin; it does NOT create a
 * plan. The plan master carries the coordination settings every patient on
 * that plan inherits, so letting the front desk mint plans would quietly
 * create duplicates with default (unconfirmed) coordination settings — the
 * exact thing the plan-master screen exists to control.
 *
 * Meanwhile the coverage can still be saved: the request id is attached to it
 * so the order comes back NEEDS_INFO rather than blocking the patient at the
 * front desk.
 */
const PlanNotListedDialog = ({ open, onClose, onSubmit, saving = false, carrierName }) => {
  const [values, setValues] = useState({ planName: '', groupNumber: '', payerPhone: '', note: '' });
  const [error, setError] = useState('');

  useEffect(() => {
    if (open) {
      setValues({ planName: '', groupNumber: '', payerPhone: '', note: '' });
      setError('');
    }
  }, [open]);

  const set = (field) => (e) => setValues((c) => ({ ...c, [field]: e.target.value }));

  const handleSubmit = () => {
    if (!values.planName.trim()) {
      setError('Copy the plan name from the card.');
      return;
    }
    onSubmit?.({ ...values, planName: values.planName.trim() });
  };

  return (
    <BaseDialog
      open={open}
      onClose={onClose}
      title="Tell us about the plan"
      maxWidth="sm"
      loading={saving}
      showCloseButton
      actions={
        <>
          <Button onClick={onClose} sx={{ fontFamily: 'Inter', fontSize: fontSize.base, textTransform: 'none' }}>
            Cancel
          </Button>
          <Button
            variant="contained"
            disableElevation
            onClick={handleSubmit}
            disabled={saving}
            data-testid="cob-plan-request-submit"
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
            Send to the billing team
          </Button>
        </>
      }
    >
      <Typography sx={{ fontFamily: 'Inter', fontSize: fontSize.base, color: COLORS.TEXT_SECONDARY, mb: 2 }}>
        Copy what you can see on the card. The billing team will add the plan properly — you can
        carry on and save this patient&apos;s insurance in the meantime.
      </Typography>

      <Grid container spacing={2}>
        <Grid size={{ xs: 12 }} >
          <TextField
            fullWidth
            required
            label="Plan name on the card"
            value={values.planName}
            onChange={set('planName')}
            error={!!error}
            helperText={error}
            inputProps={{ 'aria-label': 'Plan name on the card' }}
            data-testid="cob-plan-request-name"
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }} >
          <TextField
            fullWidth
            label="Group number"
            value={values.groupNumber}
            onChange={set('groupNumber')}
            inputProps={{ 'aria-label': 'Group number' }}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }} >
          <TextField
            fullWidth
            label="Phone number on the card"
            value={values.payerPhone}
            onChange={set('payerPhone')}
            inputProps={{ 'aria-label': 'Phone number on the card' }}
            helperText={carrierName ? `For ${carrierName}` : undefined}
          />
        </Grid>
        <Grid size={{ xs: 12 }} >
          <TextField
            fullWidth
            multiline
            minRows={2}
            label="Anything else from the card"
            value={values.note}
            onChange={set('note')}
            inputProps={{ 'aria-label': 'Anything else from the card' }}
          />
        </Grid>
      </Grid>
    </BaseDialog>
  );
};

export default PlanNotListedDialog;
