import { forwardRef, useEffect, useMemo, useRef, useState } from 'react';
import {
  Alert,
  Box,
  Button,
  Divider,
  FormControl,
  FormControlLabel,
  FormLabel,
  Grid,
  Link,
  MenuItem,
  Radio,
  RadioGroup,
  TextField,
  Typography,
} from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import BaseDialog from '../shared/BaseDialog';
import PlanNotListedDialog from './coverage-form/PlanNotListedDialog';
import CardPhotoUpload from './coverage-form/CardPhotoUpload';
import { COLORS } from '../../constants/colors';
import { fontSize, fontWeight, radius } from '../../constants/styles';
import {
  SUBSCRIBER_RELATIONSHIPS,
  COVERAGE_BASES,
  EMPLOYMENT_STATUSES,
  EMPLOYER_SIZE_BANDS,
  MEDICARE_ENTITLEMENT_REASONS,
  CUSTODY_ARRANGEMENTS,
  CUSTODY_ROLES,
  BENEFIT_CATEGORIES,
  FIXED_BENEFIT_CATEGORY,
} from '../../constants/cobConstants';
import { getVisibleConditionalSections, validateCoverageForm } from '../../utils/cobUtils';
import { formatDateForPayload } from '../../utils/dateUtils';

const EMPTY = {
  carrierId: '',
  planId: '',
  planNotListed: null,
  isTricareSupplement: false,
  memberId: '',
  groupNumber: '',
  effectiveDate: null,
  terminationDate: null,
  relationship: '',
  subscriberName: '',
  subscriberBirthdate: null,
  coverageBasis: '',
  employmentStatus: '',
  employerSizeBand: '',
  medicareEntitlementReason: '',
  esrdEntitlementDate: null,
  custodyArrangement: '',
  custodyRole: '',
  courtOrderExists: false,
  courtOrderNamesThisCoverage: false,
};

/**
 * Add or edit one insurance coverage.
 *
 * TWO RULES SHAPE THIS WHOLE FORM:
 *
 * 1. No jargon. A front-desk user is asked "Who is the policyholder?", never
 *    "subscriber relationship"; "Is the policyholder still actively working?",
 *    never "MSP employer size". The word "COB" does not appear.
 *
 * 2. Conditional questions are genuinely conditional. Medicare questions only
 *    exist for Medicare; custody questions only for a dependent child carried
 *    on two parents' policies. The visibility decision lives in
 *    `getVisibleConditionalSections` so that validation uses exactly the same
 *    rule — a hidden question can never block a save.
 *
 * `focusSection` lets the NEEDS_INFO banner open this form scrolled to the
 * section that is actually missing, which is what makes "Fix this" one click.
 */
const CoverageFormDialog = ({
  open,
  onClose,
  carriers = [],
  plans = [],
  initialValues,
  context = {},
  onSubmit,
  onRequestPlan,
  saving = false,
  focusSection,
}) => {
  const [values, setValues] = useState(EMPTY);
  const [errors, setErrors] = useState({});
  const [cardFiles, setCardFiles] = useState({ front: null, back: null });
  const [planRequestOpen, setPlanRequestOpen] = useState(false);

  const coverageRef = useRef(null);
  const policyholderRef = useRef(null);
  const medicareRef = useRef(null);
  const employmentRef = useRef(null);
  const custodyRef = useRef(null);

  useEffect(() => {
    if (!open) return;
    setValues({ ...EMPTY, ...(initialValues || {}) });
    setErrors({});
    setCardFiles({ front: null, back: null });
  }, [open, initialValues]);

  // Scroll the requested section into view once the dialog has painted. The
  // ref map is built inside the effect so no ref is read during render.
  useEffect(() => {
    if (!open || !focusSection) return;
    const node = {
      coverage: coverageRef,
      policyholder: policyholderRef,
      medicare: medicareRef,
      employment: employmentRef,
      custody: custodyRef,
    }[focusSection]?.current;
    if (node) node.scrollIntoView({ block: 'start', behavior: 'smooth' });
  }, [open, focusSection]);

  const set = (field) => (eventOrValue) => {
    const value = eventOrValue?.target
      ? eventOrValue.target.type === 'checkbox'
        ? eventOrValue.target.checked
        : eventOrValue.target.value
      : eventOrValue;
    setValues((current) => ({ ...current, [field]: value }));
  };

  /* Plans narrowed to the chosen payer — a flat plan list is unusable. */
  const plansForCarrier = useMemo(
    () => plans.filter((plan) => !values.carrierId || String(plan.carrierId) === String(values.carrierId)),
    [plans, values.carrierId]
  );

  const selectedPlan = useMemo(
    () => plansForCarrier.find((plan) => String(plan.id) === String(values.planId)),
    [plansForCarrier, values.planId]
  );

  const selectedCarrier = useMemo(
    () => carriers.find((carrier) => String(carrier.id) === String(values.carrierId)),
    [carriers, values.carrierId]
  );

  // The payer type drives the Medicare questions, so it is folded into the
  // values the visibility rule sees rather than being a separate argument.
  const effectiveValues = useMemo(
    () => ({ ...values, payerType: selectedCarrier?.payerType }),
    [values, selectedCarrier]
  );

  const visibleWithPayer = useMemo(
    () => getVisibleConditionalSections(effectiveValues, context),
    [effectiveValues, context]
  );

  const isFixedBenefitPlan = selectedPlan?.benefitCategory === FIXED_BENEFIT_CATEGORY;

  const handleSubmit = () => {
    const nextErrors = validateCoverageForm(effectiveValues, context);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) {
      // Focus the first field in error so keyboard users are not left guessing
      // which of thirty inputs the dialog is unhappy about.
      const firstField = Object.keys(nextErrors)[0];
      document.querySelector(`[name="${firstField}"]`)?.focus();
      return;
    }

    /*
     * TWO PAYLOADS, BECAUSE THE BACKEND OWNS THEM IN TWO PLACES.
     *
     * The payer, plan, member ID, group number, dates and policyholder
     * relationship live on patplan/inssub/insplan and are saved through the
     * existing patient-insurance endpoints. Only the COORDINATION facts go to
     * PATCH /cob/coverages/:id/detail — which is also why that endpoint can't
     * create a coverage, and why `onSubmit` hands both halves to the caller
     * instead of guessing an order for them.
     *
     * Field names in `cobDetail` match `coverageDetailValidator` exactly —
     * note `subscriberEmploymentStatus`, not `employmentStatus`.
     */
    onSubmit?.({
      coverage: {
        carrierId: values.carrierId,
        planId: values.planId || null,
        memberId: values.memberId.trim(),
        groupNumber: values.groupNumber.trim() || null,
        effectiveDate: formatDateForPayload(values.effectiveDate),
        terminationDate: formatDateForPayload(values.terminationDate),
        relationship: values.relationship,
      },
      cobDetail: {
        coverageBasis: values.coverageBasis || null,
        // Every conditional answer is nulled when its question is not showing.
        // Otherwise a user who picks Medicare, answers ESRD, then switches to a
        // commercial payer would ship a stale ESRD date to the rule engine.
        subscriberName: visibleWithPayer.subscriber ? values.subscriberName.trim() || null : null,
        subscriberBirthdate: visibleWithPayer.subscriber
          ? formatDateForPayload(values.subscriberBirthdate)
          : null,
        subscriberEmploymentStatus:
          visibleWithPayer.employment || visibleWithPayer.cobraRetiree
            ? values.employmentStatus || null
            : null,
        employerSizeBand: visibleWithPayer.employment ? values.employerSizeBand || null : null,
        medicareEntitlementReason: visibleWithPayer.medicare
          ? values.medicareEntitlementReason || null
          : null,
        esrdEntitlementDate: visibleWithPayer.esrdDate
          ? formatDateForPayload(values.esrdEntitlementDate)
          : null,
        custodyArrangement: visibleWithPayer.custody ? values.custodyArrangement || null : null,
        custodyRole: visibleWithPayer.custodyDetail ? values.custodyRole || null : null,
        courtOrderExists: visibleWithPayer.custodyDetail ? !!values.courtOrderExists : false,
        courtOrderNamesThisCoverage: visibleWithPayer.custodyDetail
          ? !!values.courtOrderNamesThisCoverage
          : false,
        isTricareSupplement: !!values.isTricareSupplement,
      },
      // The plan request, when the front desk could not find the plan. Carried
      // through so the caller can attach it to whatever it creates.
      planRequest: values.planNotListed || null,
      cardFiles,
    });
  };

  return (
    <>
      <BaseDialog
        open={open}
        onClose={onClose}
        title={initialValues?.coverageId ? 'Edit insurance' : 'Add insurance'}
        maxWidth="md"
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
              data-testid="cob-coverage-submit"
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
              Save insurance
            </Button>
          </>
        }
      >
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          {/* ── The policy ─────────────────────────────────────────────── */}
          <SectionHeading ref={coverageRef} title="The policy" />

          <Grid container spacing={2}>
            <Grid size={{ xs: 12, sm: 6 }} >
              <TextField
                select
                fullWidth
                required
                name="carrierId"
                label="Insurance company"
                value={values.carrierId}
                onChange={(e) => {
                  // Changing payer invalidates the plan choice.
                  setValues((c) => ({ ...c, carrierId: e.target.value, planId: '' }));
                }}
                error={!!errors.carrierId}
                helperText={errors.carrierId}
                data-testid="cob-coverage-carrier"
                SelectProps={{ inputProps: { 'aria-label': 'Insurance company' } }}
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
                name="planId"
                label="Plan"
                value={values.planId}
                onChange={set('planId')}
                error={!!errors.planId}
                helperText={errors.planId}
                disabled={!values.carrierId}
                data-testid="cob-coverage-plan"
                SelectProps={{ inputProps: { 'aria-label': 'Plan' } }}
              >
                {plansForCarrier.map((plan) => (
                  <MenuItem key={plan.id} value={plan.id}>
                    {plan.name}
                  </MenuItem>
                ))}
              </TextField>

              <Link
                component="button"
                type="button"
                onClick={() => setPlanRequestOpen(true)}
                data-testid="cob-plan-not-listed"
                sx={{
                  fontFamily: 'Inter',
                  fontSize: fontSize.sm,
                  color: COLORS.ACCENT,
                  mt: 0.5,
                  display: 'inline-block',
                }}
              >
                The plan isn&apos;t in this list
              </Link>

              {values.planNotListed && (
                <Typography
                  data-testid="cob-plan-request-pending"
                  sx={{ fontFamily: 'Inter', fontSize: fontSize.sm, color: COLORS.STATUS_SUCCESS, mt: 0.5 }}
                >
                  Sent to the billing team: {values.planNotListed.planName}
                </Typography>
              )}
            </Grid>

            {/* The fixed-benefit note appears the moment such a plan is
                picked — before saving, while the user can still correct it. */}
            {isFixedBenefitPlan && (
              <Grid size={{ xs: 12 }} >
                <Alert severity="info" data-testid="cob-fixed-benefit-note" sx={{ fontFamily: 'Inter', fontSize: fontSize.base }}>
                  {BENEFIT_CATEGORIES.find((c) => c.value === FIXED_BENEFIT_CATEGORY)?.note}
                </Alert>
              </Grid>
            )}

            <Grid size={{ xs: 12, sm: 6 }} >
              <TextField
                fullWidth
                required
                name="memberId"
                label="Member ID"
                value={values.memberId}
                onChange={set('memberId')}
                error={!!errors.memberId}
                helperText={errors.memberId}
                inputProps={{ 'aria-label': 'Member ID' }}
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }} >
              <TextField
                fullWidth
                name="groupNumber"
                label="Group number"
                value={values.groupNumber}
                onChange={set('groupNumber')}
                inputProps={{ 'aria-label': 'Group number' }}
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }} >
              <DatePicker
                label="Coverage starts"
                value={values.effectiveDate}
                onChange={set('effectiveDate')}
                slotProps={{ textField: { fullWidth: true, inputProps: { 'aria-label': 'Coverage starts' } } }}
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }} >
              <DatePicker
                label="Coverage ends"
                value={values.terminationDate}
                onChange={set('terminationDate')}
                slotProps={{
                  textField: {
                    fullWidth: true,
                    inputProps: { 'aria-label': 'Coverage ends' },
                    helperText: 'Leave blank if the coverage is still active.',
                  },
                }}
              />
            </Grid>

            <Grid size={{ xs: 12 }} >
              <TextField
                select
                fullWidth
                name="coverageBasis"
                label="How does the patient have this coverage?"
                value={values.coverageBasis}
                onChange={set('coverageBasis')}
                data-testid="cob-coverage-basis"
                SelectProps={{ inputProps: { 'aria-label': 'How does the patient have this coverage?' } }}
              >
                {COVERAGE_BASES.map((basis) => (
                  <MenuItem key={basis.value} value={basis.value}>
                    {basis.label}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            <Grid size={{ xs: 12 }} >
              <CardPhotoUpload
                files={cardFiles}
                existing={initialValues?.cardPhotos || {}}
                onPick={(side, file) => setCardFiles((c) => ({ ...c, [side]: file }))}
              />
            </Grid>
          </Grid>

          {/* ── Policyholder ───────────────────────────────────────────── */}
          <SectionHeading ref={policyholderRef} title="Who is the policyholder?" />

          <Grid container spacing={2}>
            <Grid size={{ xs: 12 }} >
              <FormControl error={!!errors.relationship} component="fieldset">
                <FormLabel
                  component="legend"
                  sx={{ fontFamily: 'Inter', fontSize: fontSize.base, color: COLORS.TEXT_SECONDARY }}
                >
                  Whose policy is this?
                </FormLabel>
                <RadioGroup
                  row
                  name="relationship"
                  value={values.relationship}
                  onChange={set('relationship')}
                  data-testid="cob-relationship"
                >
                  {SUBSCRIBER_RELATIONSHIPS.map((option) => (
                    <FormControlLabel
                      key={option.value}
                      value={option.value}
                      control={<Radio size="small" />}
                      label={option.label}
                      sx={{ '& .MuiFormControlLabel-label': { fontFamily: 'Inter', fontSize: fontSize.base } }}
                    />
                  ))}
                </RadioGroup>
                {errors.relationship && (
                  <Typography sx={{ fontFamily: 'Inter', fontSize: fontSize.sm, color: COLORS.STATUS_ERROR }}>
                    {errors.relationship}
                  </Typography>
                )}
              </FormControl>
            </Grid>

            {visibleWithPayer.subscriber && (
              <>
                <Grid size={{ xs: 12, sm: 6 }} >
                  <TextField
                    fullWidth
                    required
                    name="subscriberName"
                    label="Policyholder's name"
                    value={values.subscriberName}
                    onChange={set('subscriberName')}
                    error={!!errors.subscriberName}
                    helperText={errors.subscriberName}
                    data-testid="cob-subscriber-name"
                    inputProps={{ 'aria-label': "Policyholder's name" }}
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }} >
                  <DatePicker
                    label="Policyholder's date of birth"
                    value={values.subscriberBirthdate}
                    onChange={set('subscriberBirthdate')}
                    slotProps={{
                      textField: {
                        fullWidth: true,
                        required: true,
                        name: 'subscriberBirthdate',
                        error: !!errors.subscriberBirthdate,
                        helperText:
                          errors.subscriberBirthdate ||
                          'Used to work out which plan pays first when a child is on two policies.',
                        inputProps: { 'aria-label': "Policyholder's date of birth" },
                        'data-testid': 'cob-subscriber-dob',
                      },
                    }}
                  />
                </Grid>
              </>
            )}
          </Grid>

          {/* ── Medicare ───────────────────────────────────────────────── */}
          {visibleWithPayer.medicare && (
            <>
              <SectionHeading ref={medicareRef} title="Medicare" />
              <Grid container spacing={2} data-testid="cob-section-medicare">
                <Grid size={{ xs: 12, sm: 6 }} >
                  <TextField
                    select
                    fullWidth
                    required
                    name="medicareEntitlementReason"
                    label="Why does the patient have Medicare?"
                    value={values.medicareEntitlementReason}
                    onChange={set('medicareEntitlementReason')}
                    error={!!errors.medicareEntitlementReason}
                    helperText={errors.medicareEntitlementReason}
                    data-testid="cob-medicare-reason"
                    SelectProps={{ inputProps: { 'aria-label': 'Why does the patient have Medicare?' } }}
                  >
                    {MEDICARE_ENTITLEMENT_REASONS.map((reason) => (
                      <MenuItem key={reason.value} value={reason.value}>
                        {reason.label}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>

                {visibleWithPayer.esrdDate && (
                  <Grid size={{ xs: 12, sm: 6 }} data-testid="cob-section-esrd">
                    <DatePicker
                      label="When did the kidney-failure coverage start?"
                      value={values.esrdEntitlementDate}
                      onChange={set('esrdEntitlementDate')}
                      slotProps={{
                        textField: {
                          fullWidth: true,
                          required: true,
                          name: 'esrdEntitlementDate',
                          error: !!errors.esrdEntitlementDate,
                          helperText:
                            errors.esrdEntitlementDate ||
                            'There is a 30-month window where the other plan still pays first.',
                          inputProps: { 'aria-label': 'When did the kidney-failure coverage start?' },
                        },
                      }}
                    />
                  </Grid>
                )}
              </Grid>
            </>
          )}

          {/* ── Still working / employer size ──────────────────────────── */}
          {(visibleWithPayer.employment || visibleWithPayer.cobraRetiree) && (
            <>
              <SectionHeading ref={employmentRef} title="Employment" />
              <Grid container spacing={2} data-testid="cob-section-employment">
                <Grid size={{ xs: 12, sm: 6 }} >
                  <TextField
                    select
                    fullWidth
                    required
                    name="employmentStatus"
                    label="Is the policyholder still actively working?"
                    value={values.employmentStatus}
                    onChange={set('employmentStatus')}
                    error={!!errors.employmentStatus}
                    helperText={errors.employmentStatus}
                    data-testid="cob-employment-status"
                    SelectProps={{ inputProps: { 'aria-label': 'Is the policyholder still actively working?' } }}
                  >
                    {EMPLOYMENT_STATUSES.map((status) => (
                      <MenuItem key={status.value} value={status.value}>
                        {status.label}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>

                {/* Employer size only matters while someone is still working —
                    it is what decides whether Medicare or the group plan pays
                    first. Asking a retiree is noise. */}
                {visibleWithPayer.employment && values.employmentStatus === 'ACTIVE' && (
                  <Grid size={{ xs: 12, sm: 6 }} >
                    <TextField
                      select
                      fullWidth
                      required
                      name="employerSizeBand"
                      label="How many people does the employer have?"
                      value={values.employerSizeBand}
                      onChange={set('employerSizeBand')}
                      error={!!errors.employerSizeBand}
                      helperText={errors.employerSizeBand}
                      data-testid="cob-employer-size"
                      SelectProps={{ inputProps: { 'aria-label': 'How many people does the employer have?' } }}
                    >
                      {EMPLOYER_SIZE_BANDS.map((band) => (
                        <MenuItem key={band.value} value={band.value}>
                          {band.label}
                        </MenuItem>
                      ))}
                    </TextField>
                  </Grid>
                )}
              </Grid>
            </>
          )}

          {/* ── Custody ────────────────────────────────────────────────── */}
          {visibleWithPayer.custody && (
            <>
              <SectionHeading ref={custodyRef} title="The patient's parents" />
              <Grid container spacing={2} data-testid="cob-section-custody">
                <Grid size={{ xs: 12 }} >
                  <TextField
                    select
                    fullWidth
                    required
                    name="custodyArrangement"
                    label="Are the parents married or living together?"
                    value={values.custodyArrangement}
                    onChange={set('custodyArrangement')}
                    error={!!errors.custodyArrangement}
                    helperText={errors.custodyArrangement}
                    data-testid="cob-custody-arrangement"
                    SelectProps={{ inputProps: { 'aria-label': 'Are the parents married or living together?' } }}
                  >
                    {CUSTODY_ARRANGEMENTS.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>

                {visibleWithPayer.custodyDetail && (
                  <>
                    <Grid size={{ xs: 12, sm: 6 }} data-testid="cob-section-custody-detail">
                      <TextField
                        select
                        fullWidth
                        required
                        name="custodyRole"
                        label="Whose policy is this?"
                        value={values.custodyRole}
                        onChange={set('custodyRole')}
                        error={!!errors.custodyRole}
                        helperText={errors.custodyRole}
                        data-testid="cob-custody-role"
                        SelectProps={{ inputProps: { 'aria-label': 'Whose policy is this?' } }}
                      >
                        {CUSTODY_ROLES.map((role) => (
                          <MenuItem key={role.value} value={role.value}>
                            {role.label}
                          </MenuItem>
                        ))}
                      </TextField>
                    </Grid>

                    <Grid size={{ xs: 12, sm: 6 }} >
                      <FormControl component="fieldset">
                        <FormLabel
                          component="legend"
                          sx={{ fontFamily: 'Inter', fontSize: fontSize.base, color: COLORS.TEXT_SECONDARY }}
                        >
                          Is there a court order saying who pays the child&apos;s medical bills?
                        </FormLabel>
                        <RadioGroup
                          row
                          name="courtOrderExists"
                          value={String(values.courtOrderExists)}
                          onChange={(e) =>
                            setValues((c) => ({ ...c, courtOrderExists: e.target.value === 'true' }))
                          }
                          data-testid="cob-court-order"
                        >
                          <FormControlLabel value="true" control={<Radio size="small" />} label="Yes" />
                          <FormControlLabel value="false" control={<Radio size="small" />} label="No" />
                        </RadioGroup>
                      </FormControl>
                    </Grid>

                    {values.courtOrderExists && (
                      <Grid size={{ xs: 12 }} >
                        <FormControlLabel
                          control={
                            <Radio
                              size="small"
                              checked={!!values.courtOrderNamesThisCoverage}
                              onChange={() =>
                                setValues((c) => ({
                                  ...c,
                                  courtOrderNamesThisCoverage: !c.courtOrderNamesThisCoverage,
                                }))
                              }
                              inputProps={{ 'aria-label': 'The court order names this parent' }}
                            />
                          }
                          label="The court order names this parent as responsible"
                          sx={{ '& .MuiFormControlLabel-label': { fontFamily: 'Inter', fontSize: fontSize.base } }}
                          data-testid="cob-court-order-names-this"
                        />
                      </Grid>
                    )}
                  </>
                )}
              </Grid>
            </>
          )}
        </LocalizationProvider>
      </BaseDialog>

      <PlanNotListedDialog
        open={planRequestOpen}
        onClose={() => setPlanRequestOpen(false)}
        carrierName={selectedCarrier?.name}
        onSubmit={async (payload) => {
          const result = await onRequestPlan?.({ ...payload, carrierId: values.carrierId });
          // Keep the request on the form so the user can see it went through
          // and so the id travels with the saved coverage.
          setValues((c) => ({ ...c, planNotListed: { ...payload, id: result?.id ?? null } }));
          setPlanRequestOpen(false);
        }}
      />
    </>
  );
};

/* A plain forwardRef heading so the NEEDS_INFO jump has something to scroll to. */
const SectionHeading = forwardRef(({ title }, ref) => (
  <Box ref={ref} sx={{ mt: 3, mb: 1.5, scrollMarginTop: '12px' }}>
    <Typography
      component="h3"
      sx={{
        fontFamily: 'Inter',
        fontSize: fontSize.md,
        fontWeight: fontWeight.semibold,
        color: COLORS.TEXT_PRIMARY,
      }}
    >
      {title}
    </Typography>
    <Divider sx={{ mt: 0.75 }} />
  </Box>
));
SectionHeading.displayName = 'SectionHeading';

export default CoverageFormDialog;
