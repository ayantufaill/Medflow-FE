import { useEffect, useMemo, useState } from 'react';
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  FormControl,
  FormControlLabel,
  FormLabel,
  Grid,
  MenuItem,
  Radio,
  RadioGroup,
  TextField,
  Typography,
} from '@mui/material';
import BaseDialog from '../../../shared/BaseDialog';
import { COLORS } from '../../../../constants/colors';
import { fontSize, fontWeight, radius } from '../../../../constants/styles';
import {
  BENEFIT_CATEGORIES,
  COB_PAYMENT_METHODS,
  COB_INFO_SOURCES,
  COORDINATES_BENEFITS_HELP,
} from '../../../../constants/cobConstants';
import { useCobPlanChangeImpact } from '../../../../hooks/queries/useCob';

/**
 * Fields the PATCH accepts. `cobInfoSource` is included because it is
 * editable, but it is NOT in COB_FIELDS: recording that a payer confirmed
 * something does not change the ranking, so it must not trigger the
 * blast-radius warning.
 */
const CHANGEABLE = ['benefitCategory', 'coordinatesBenefits', 'cobPaymentMethod', 'cobInfoSource'];

/** The fields whose change actually re-ranks patients' orders. */
const COB_FIELDS = ['benefitCategory', 'coordinatesBenefits', 'cobPaymentMethod'];

/** The stored value of a field, with the plan-profile defaults applied. */
const baseline = (plan, field) =>
  field === 'coordinatesBenefits' ? plan?.[field] !== false : plan?.[field];

/**
 * Edit one plan's coordination settings.
 *
 * THE AFFECTED-PATIENT COUNT IS THE POINT OF THIS DIALOG. Flipping
 * "coordinates with other insurance" on a plan silently re-ranks every patient
 * carrying it, which can move claims between payers mid-flight. So before the
 * save button does anything, the dialog asks the backend how many patients
 * with open claims this would touch, and shows it. The admin can still
 * proceed — they just cannot do it unknowingly.
 *
 * The count is fetched only for changes to the COB fields; renaming nothing
 * else triggers a re-evaluation, and a spurious "0 patients affected" banner
 * would teach people to ignore the real one.
 */
const PlanMasterEditDialog = ({ open, onClose, plan, onSave, saving = false }) => {
  const [values, setValues] = useState(null);
  const [changeNote, setChangeNote] = useState('');

  useEffect(() => {
    if (!open || !plan) return;
    setValues({
      benefitCategory: plan.benefitCategory || 'MEDICAL',
      coordinatesBenefits: plan.coordinatesBenefits !== false,
      cobPaymentMethod: plan.cobPaymentMethod || 'UNKNOWN',
      cobInfoSource: plan.cobInfoSource || 'DEFAULT',
    });
    setChangeNote('');
  }, [open, plan]);

  const set = (field) => (eventOrValue) => {
    const value = eventOrValue?.target ? eventOrValue.target.value : eventOrValue;
    setValues((current) => ({ ...current, [field]: value }));
  };

  /* Which COB-relevant fields actually differ from what is stored. */
  const changedCobFields = useMemo(() => {
    if (!values || !plan) return [];
    return COB_FIELDS.filter((field) => values[field] !== baseline(plan, field));
  }, [values, plan]);

  const hasCobChange = changedCobFields.length > 0;

  // Only asked for once something COB-relevant actually changed. The count is
  // "patients on this plan with an open claim", which is the same number
  // whichever COB field is being changed — so the hook keys on the plan, not
  // on the draft values, and does not re-fetch on every edit.
  const impact = useCobPlanChangeImpact(plan?.planId, { enabled: open && hasCobChange });

  const notConfirmedSource = values?.cobInfoSource === 'DEFAULT';
  const sayingNo = values?.coordinatesBenefits === false;

  if (!values) return null;

  return (
    <BaseDialog
      open={open}
      onClose={onClose}
      title={`Coordination settings — ${plan?.planName || 'plan'}`}
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
            // PATCH semantics: send only what changed, so an unrelated field
            // cannot be rewritten with a stale value read at dialog-open time.
            onClick={() =>
              onSave?.({
                ...Object.fromEntries(
                  CHANGEABLE.filter((field) => values[field] !== baseline(plan, field)).map(
                    (field) => [field, values[field]]
                  )
                ),
                changeNote: changeNote.trim() || undefined,
              })
            }
            // Blocked while the impact count is still in flight: saving before
            // the number arrives would defeat the entire purpose of showing it.
            disabled={saving || (hasCobChange && impact.isLoading)}
            data-testid="plan-master-save"
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
            Save changes
          </Button>
        </>
      }
    >
      <Grid container spacing={2.5}>
        {/* cobProfileRecorded=false means every value on screen is a default
            nobody has ever confirmed, which changes how much to trust them. */}
        {plan?.cobProfileRecorded === false && (
          <Grid size={{ xs: 12 }}>
            <Alert
              severity="info"
              data-testid="plan-master-unrecorded"
              sx={{ fontFamily: 'Inter', fontSize: fontSize.base }}
            >
              Nobody has recorded coordination settings for this plan yet — the values below are
              the defaults.
            </Alert>
          </Grid>
        )}

        <Grid size={{ xs: 12 }} >
          <TextField
            select
            fullWidth
            label="Benefit category"
            value={values.benefitCategory}
            onChange={set('benefitCategory')}
            data-testid="plan-master-benefit-category"
            SelectProps={{ inputProps: { 'aria-label': 'Benefit category' } }}
            helperText="Fixed-benefit (indemnity) plans pay the patient directly and are kept out of the claim order."
          >
            {BENEFIT_CATEGORIES.map((category) => (
              <MenuItem key={category.value} value={category.value}>
                {category.label}
              </MenuItem>
            ))}
          </TextField>
        </Grid>

        <Grid size={{ xs: 12 }} >
          <FormControl component="fieldset">
            <FormLabel
              component="legend"
              sx={{
                fontFamily: 'Inter',
                fontSize: fontSize.md,
                fontWeight: fontWeight.semibold,
                color: COLORS.TEXT_PRIMARY,
              }}
            >
              Does this plan coordinate with other insurance?
            </FormLabel>
            <RadioGroup
              row
              value={String(values.coordinatesBenefits)}
              onChange={(e) =>
                setValues((c) => ({ ...c, coordinatesBenefits: e.target.value === 'true' }))
              }
              data-testid="plan-master-coordinates"
            >
              <FormControlLabel value="true" control={<Radio size="small" />} label="Yes" />
              <FormControlLabel value="false" control={<Radio size="small" />} label="No" />
            </RadioGroup>

            <Typography
              sx={{ fontFamily: 'Inter', fontSize: fontSize.sm, color: COLORS.TEXT_SECONDARY, mt: 0.5 }}
            >
              {COORDINATES_BENEFITS_HELP}
            </Typography>
          </FormControl>
        </Grid>

        {/* The "no" + "default source" combination is the data-quality trap:
            somebody set the rare value without recording who told them. */}
        {sayingNo && notConfirmedSource && (
          <Grid size={{ xs: 12 }} >
            <Alert severity="warning" data-testid="plan-master-unconfirmed-no" sx={{ fontFamily: 'Inter', fontSize: fontSize.base }}>
              You are saying this plan does not coordinate, but the source is still “Default”.
              Record whether a payer confirmed it or you are reading it in the plan document.
            </Alert>
          </Grid>
        )}

        <Grid size={{ xs: 12, sm: 6 }} >
          <TextField
            select
            fullWidth
            label="How does it pay as secondary?"
            value={values.cobPaymentMethod}
            onChange={set('cobPaymentMethod')}
            data-testid="plan-master-payment-method"
            SelectProps={{ inputProps: { 'aria-label': 'How does it pay as secondary?' } }}
            helperText={
              COB_PAYMENT_METHODS.find((m) => m.value === values.cobPaymentMethod)?.help
            }
          >
            {COB_PAYMENT_METHODS.map((method) => (
              <MenuItem key={method.value} value={method.value}>
                {method.label}
              </MenuItem>
            ))}
          </TextField>
        </Grid>

        <Grid size={{ xs: 12, sm: 6 }} >
          <TextField
            select
            fullWidth
            label="Where did this information come from?"
            value={values.cobInfoSource}
            onChange={set('cobInfoSource')}
            data-testid="plan-master-info-source"
            SelectProps={{ inputProps: { 'aria-label': 'Where did this information come from?' } }}
          >
            {COB_INFO_SOURCES.map((source) => (
              <MenuItem key={source.value} value={source.value}>
                {source.label}
              </MenuItem>
            ))}
          </TextField>
        </Grid>

        {/* ── Blast radius ───────────────────────────────────────────────── */}
        {hasCobChange && (
          <Grid size={{ xs: 12 }} >
            <Box
              data-testid="plan-master-impact"
              sx={{
                border: `1px solid ${COLORS.BORDER}`,
                borderRadius: radius.md,
                backgroundColor: COLORS.SURFACE_HOVER,
                p: 1.5,
              }}
            >
              {impact.isLoading ? (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <CircularProgress size={16} />
                  <Typography sx={{ fontFamily: 'Inter', fontSize: fontSize.base, color: COLORS.TEXT_SECONDARY }}>
                    Checking how many patients this affects…
                  </Typography>
                </Box>
              ) : impact.isError ? (
                <Typography
                  data-testid="plan-master-impact-error"
                  sx={{ fontFamily: 'Inter', fontSize: fontSize.base, color: COLORS.STATUS_ERROR }}
                >
                  We couldn&apos;t work out how many patients this affects. Check before saving.
                </Typography>
              ) : (
                <Typography
                  data-testid="plan-master-impact-count"
                  sx={{ fontFamily: 'Inter', fontSize: fontSize.base, color: COLORS.TEXT_BODY }}
                >
                  <strong>{impact.data?.affectedPatients ?? 0}</strong>{' '}
                  {impact.data?.affectedPatients === 1 ? 'patient' : 'patients'} with open claims
                  will have their insurance order worked out again when you save
                  {impact.data?.openClaims != null
                    ? `, across ${impact.data.openClaims} open claim${impact.data.openClaims === 1 ? '' : 's'}`
                    : ''}
                  .
                </Typography>
              )}
            </Box>
          </Grid>
        )}

        <Grid size={{ xs: 12 }} >
          <TextField
            fullWidth
            multiline
            minRows={2}
            label="Note for the change history"
            value={changeNote}
            onChange={(e) => setChangeNote(e.target.value)}
            inputProps={{ 'aria-label': 'Note for the change history' }}
            helperText="Optional, but the next person reading the history will thank you."
            data-testid="plan-master-change-note"
          />
        </Grid>
      </Grid>
    </BaseDialog>
  );
};

export default PlanMasterEditDialog;
