import { useState, useEffect } from 'react';
import { usePatient, useDropdownData } from '../../../hooks/redux';
import { usePatientInsurance } from '../../../hooks/redux/usePatientInsurance';
import { providerLabel } from '../new-appointment/helpers';
import { Box, Typography, Tooltip, Skeleton } from '@mui/material';
import { KeyboardArrowDown, KeyboardArrowUp, Assignment, PeopleAlt, InfoOutlined } from '@mui/icons-material';
import { COLORS } from '../../../constants/colors';
import { useSelector, useDispatch } from 'react-redux';
import { selectPracticeInfo } from '../../../store/slices/practiceInfoSlice';
import { fontSize, fontWeight, radius, spacing, headingPrimarySx, headingSecondarySx, avatarSize } from '../../../constants/styles';
import {
  fetchPatientBalance,
  fetchInsuranceUsage,
  invalidatePatientBalance,
  invalidateInsuranceUsage,
  selectPatientBalanceCache,
  selectPatientBalanceLoading,
  selectInsuranceUsageCache,
  selectInsuranceUsageLoading,
} from '../../../store/slices/patientSlice';
import { resolveFlagColor as getFlagColorFromAdmin } from '../../patient-flags/constants';

/* ── Reusable sub-section row ────────────────────────────────────── */
const SubSection = ({ label, chevronSide = null, open, onToggle, children }) => (
  <Box sx={{ display: 'flex', flexDirection: 'column', gap: spacing.innerGap }}>
    <Box
      sx={{ display: 'flex', alignItems: 'center', gap: spacing.innerGap, cursor: chevronSide ? 'pointer' : 'default' }}
      onClick={chevronSide ? onToggle : undefined}
    >
      {/* Left chevron — Medical Alerts style */}
      {chevronSide === 'left' && (
        open
          ? <KeyboardArrowDown sx={{ fontSize: '14px', color: COLORS.TEXT_MUTED }} />
          : <KeyboardArrowUp sx={{ fontSize: '14px', color: COLORS.TEXT_MUTED }} />
      )}

      {/* Vertical bar */}
      <Box sx={{ width: '2px', height: '16px', backgroundColor: '#d1d5db', borderRadius: '1px', flexShrink: 0 }} />

      {/* Label */}
      <Typography sx={{ ...headingSecondarySx, flex: 1 }}>
        {label}
      </Typography>

      {/* Right chevron — Preferred Providers style */}
      {chevronSide === 'right' && (
        open
          ? <KeyboardArrowDown sx={{ fontSize: '16px', color: COLORS.TEXT_MUTED }} />
          : <KeyboardArrowUp sx={{ fontSize: '16px', color: COLORS.TEXT_MUTED }} />
      )}
    </Box>

    {open !== false && children}
  </Box>
);

/* ── Dropdown row (Dentist / Hygienist) ──────────────────────────── */
const DropdownRow = ({ label }) => (
  <Box sx={{ display: 'flex', alignItems: 'center', gap: spacing.innerGap, mb: spacing.innerGap }}>
    <Typography sx={{ fontSize: fontSize.base, color: COLORS.TEXT_SECONDARY, whiteSpace: 'nowrap' }}>
      {label}
    </Typography>
  </Box>
);

/* ── Form badge ───────────────────────────────────────────────────── */
const FormBadge = ({ label, active }) => (
  <Box
    sx={{
      width: avatarSize.sm, height: avatarSize.sm,
      borderRadius: radius.sm,
      backgroundColor: active ? COLORS.STATUS_ERROR : '#f3f4f6',
      border: active ? 'none' : '1px solid #e5e7eb',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
    }}
  >
    <Typography sx={{ fontSize: fontSize.sm, fontWeight: fontWeight.bold, color: active ? COLORS.WHITE : COLORS.TEXT_MUTED }}>
      {label}
    </Typography>
  </Box>
);

/* ── Collapsible card shell ──────────────────────────────────────── */
const DetailCard = ({ icon, title, children }) => {
  const [expanded, setExpanded] = useState(true);

  return (
    <Box sx={{ backgroundColor: COLORS.SURFACE_CARD, border: `1px solid ${COLORS.BORDER}`, borderRadius: radius.lg, overflow: 'hidden', mt: spacing.cardGap }}>
      <Box
        onClick={() => setExpanded((p) => !p)}
        sx={{
          display: 'flex', alignItems: 'center', gap: spacing.cardGap,
          px: spacing.cardPx, py: spacing.cardPy,
          cursor: 'pointer',
          borderBottom: expanded ? `1px solid ${COLORS.BORDER_LIGHT}` : 'none',
        }}
      >
        {icon}
        <Typography sx={{ ...headingPrimarySx, flex: 1 }}>
          {title}
        </Typography>
        {expanded
          ? <KeyboardArrowUp sx={{ fontSize: '18px', color: COLORS.TEXT_SECONDARY }} />
          : <KeyboardArrowDown sx={{ fontSize: '18px', color: COLORS.TEXT_SECONDARY }} />}
      </Box>
      {expanded && (
        <Box sx={{ px: spacing.cardPx, py: spacing.cardPy, display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {children}
        </Box>
      )}
    </Box>
  );
};

/* ── Patient Details ─────────────────────────────────────────────── */
export const PatientDetails = () => {
  const [providersOpen, setProvidersOpen] = useState(true);
  const [alertsOpen, setAlertsOpen] = useState(true);
  const { currentPatient } = usePatient();
  const { providers = [] } = useDropdownData({ providers: true });
  const practiceInfo = useSelector(selectPracticeInfo);
  const globalFlags = practiceInfo?.patientFlags || [];
  const dispatch = useDispatch();

  const resolveFlagColor = (flagVal) => {
    return getFlagColorFromAdmin(flagVal, globalFlags);
  };

  const patientId = currentPatient?._id || currentPatient?.id || currentPatient?.PatNum;
  const { insurances, fetch: fetchInsurances } = usePatientInsurance(patientId);

  // ── Billing data from Redux ──────────────────────────────────────
  const balanceCache = useSelector(selectPatientBalanceCache);
  const balanceLoading = useSelector(selectPatientBalanceLoading);
  const insuranceUsageCache = useSelector(selectInsuranceUsageCache);
  const insuranceUsageLoading = useSelector(selectInsuranceUsageLoading);

  const cachedBalance = patientId ? balanceCache[patientId]?.data : null;
  const cachedUsage = patientId ? insuranceUsageCache[patientId]?.data : null;

  useEffect(() => {
    if (patientId && (!insurances || insurances.length === 0)) {
      fetchInsurances();
    }
  }, [patientId, fetchInsurances, insurances]);

  // Fetch balance and insurance usage whenever the patient changes
  // Always invalidate cache first so we never show stale data
  useEffect(() => {
    if (!patientId) return;
    dispatch(invalidatePatientBalance(patientId));
    dispatch(invalidateInsuranceUsage(patientId));
    dispatch(fetchPatientBalance(patientId));
    dispatch(fetchInsuranceUsage(patientId));
  }, [patientId, dispatch]);

  if (!currentPatient) return null;

  const getProviderName = (providerData) => {
    if (!providerData) return 'Unassigned';
    
    if (typeof providerData === 'object') {
      if (providerData.name) return providerData.name;
      if (providerData.firstName || providerData.lastName) {
        return `${providerData.firstName || ''} ${providerData.lastName || ''}`.trim();
      }
    }
    
    const idToFind = typeof providerData === 'object' ? (providerData._id || providerData.id) : providerData;
    
    if (idToFind !== null && idToFind !== undefined) {
      const searchId = String(idToFind);
      const found = providers.find(p => String(p._id) === searchId || String(p.id) === searchId);
      if (found) {
        return providerLabel(found) || searchId;
      }
      return searchId;
    }
    
    return 'Unassigned';
  };

  const pd = currentPatient?.preferredProvider || currentPatient?.preferredDentist || currentPatient?.preferredDentistId || currentPatient?.Dentist;
  const dentist = getProviderName(pd);

  const ph = currentPatient?.preferredHygienist || currentPatient?.preferredHygienistId || currentPatient?.Hygienist;
  const hygienist = getProviderName(ph);

  const medicalAlerts = currentPatient.medicalAlerts || currentPatient.MedicalAlerts || [];
  const alertsList = Array.isArray(medicalAlerts) ? medicalAlerts : (medicalAlerts ? [medicalAlerts] : []);

  const flags = currentPatient.patientFlags || currentPatient.flags || [];
  const flagsList = Array.isArray(flags) ? flags : (flags ? [flags] : []);

  // ── Balance: prefer live API data, fall back to patient object fields ──
  const liveBalance = cachedBalance?.balance ?? cachedBalance?.totalBalance ?? null;
  const displayBalance = liveBalance !== null
    ? liveBalance
    : (currentPatient.totalBalance ?? currentPatient.BalTotal ?? 0);

  // ── Insurance usage: prefer live API data, fall back to coverage limits ──
  const primaryUsage = cachedUsage?.primaryInsurance ?? null;
  const liveUsedAmount = primaryUsage?.usedAmount ?? null;
  const liveAnnualMax = primaryUsage?.annualMax ?? null;

  // Fallback: derive from insurance coverage limits already in cache
  const parseAmount = (val) => {
    if (val === null || val === undefined || val === '') return null;
    if (typeof val === 'number') return isNaN(val) ? null : val;
    const cleaned = String(val).replace(/[^0-9.-]+/g, '');
    if (!cleaned) return null;
    const num = parseFloat(cleaned);
    return isNaN(num) ? null : num;
  };

  const getCoverageAmounts = (ins) => {
    if (!ins) return { usedAmount: 0, maxAmount: 0 };
    let coverageLimits = ins?.coverageLimits;
    if (typeof coverageLimits === 'string') {
      try { coverageLimits = JSON.parse(coverageLimits); } catch (e) { coverageLimits = null; }
    }
    const limitsInd = coverageLimits?.individual;
    const rawUsed = limitsInd?.usedAmount ?? ins?.usedAmount ?? ins?.copayAmount;
    const rawMax = limitsInd?.annualMax ?? ins?.individualAnnualMax ?? ins?.deductibleAmount;
    return { usedAmount: parseAmount(rawUsed) ?? 0, maxAmount: parseAmount(rawMax) ?? 0 };
  };

  const activeInsurances = (insurances || []).filter(ins => ins.isActive !== false);
  const targetIns = activeInsurances[0] || insurances?.[0];
  const { usedAmount: fallbackUsed, maxAmount: fallbackMax } = getCoverageAmounts(targetIns);

  const usedAmount = liveUsedAmount !== null ? liveUsedAmount : (fallbackUsed || currentPatient.usedAmount || currentPatient.PriInsUsed || 0);
  const maxAmount = liveAnnualMax !== null ? liveAnnualMax : fallbackMax;
  const planName = primaryUsage?.planName ?? targetIns?.planName ?? null;

  return (
    <DetailCard icon={<Assignment sx={{ fontSize: '20px', color: COLORS.ACCENT }} />} title="Patient Details">

      {/* Preferred Providers */}
      <SubSection label="Preferred Providers" chevronSide="right" open={providersOpen} onToggle={() => setProvidersOpen((p) => !p)}>
        <Box sx={{ pl: '8px' }}>
          <DropdownRow label={`Preferred Dentist: ${dentist}`} />
          <DropdownRow label={`Preferred Hygienist: ${hygienist}`} />
        </Box>
      </SubSection>

      {/* Patient Forms */}
      <SubSection label="Patient Forms" open>
        <Box sx={{ display: 'flex', gap: spacing.innerGap, pl: '8px' }}>
          <FormBadge label="B" active />
          <FormBadge label="R" />
          <FormBadge label="P" />
          <FormBadge label="Q" />
        </Box>
      </SubSection>

      {/* Medical Alerts */}
      <SubSection label="Medical Alerts" chevronSide="right" open={alertsOpen} onToggle={() => setAlertsOpen((p) => !p)}>
        {alertsList.length > 0 ? (
          alertsList.map((alert, i) => (
            <Typography key={i} sx={{ fontSize: fontSize.md, fontWeight: fontWeight.semibold, color: '#dc2626', textAlign: 'center', pl: '8px' }}>
              {typeof alert === 'string' ? alert : (alert.name || alert.diseaseName || 'Unknown Alert')}
            </Typography>
          ))
        ) : (
          <Typography sx={{ fontSize: fontSize.base, color: COLORS.TEXT_MUTED, pl: '8px' }}>No alerts</Typography>
        )}
      </SubSection>

      {/* Patient Flags */}
      <SubSection label="Patient Flags" open>
        {flagsList.length > 0 ? (
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, pl: '8px' }}>
            {flagsList.map((flag, i) => {
              const flagName = typeof flag === 'string' ? flag : (flag.name || 'Unknown Flag');
              const displayTitle = flagName === 'appointment_reminder' ? 'Appt Reminder' : flagName;
              return (
                <Tooltip key={i} title={displayTitle} arrow placement="top">
                  <Box 
                    sx={{ 
                      width: 12, 
                      height: 12, 
                      borderRadius: '2px', 
                      bgcolor: resolveFlagColor(flagName), 
                      flexShrink: 0,
                      cursor: 'pointer'
                    }} 
                  />
                </Tooltip>
              );
            })}
          </Box>
        ) : (
          <Typography sx={{ fontSize: fontSize.base, color: COLORS.TEXT_MUTED, pl: '8px' }}>No flags</Typography>
        )}
      </SubSection>

      {/* Bills */}
      <SubSection label="Bills" open>
        {balanceLoading && !cachedBalance ? (
          <Skeleton variant="text" width={120} height={20} sx={{ ml: '8px' }} />
        ) : (
          <Typography sx={{ fontSize: fontSize.base, color: COLORS.TEXT_SECONDARY, pl: '8px' }}>
            Balance:{' '}
            <span style={{ fontWeight: fontWeight.bold, color: displayBalance > 0 ? '#dc2626' : COLORS.TEXT_PRIMARY }}>
              ${Number(displayBalance).toFixed(2)}
            </span>
          </Typography>
        )}
      </SubSection>

      {/* Used Amount */}
      <SubSection label="Used Amount:" open>
        {insuranceUsageLoading && !cachedUsage ? (
          <Skeleton variant="text" width={140} height={24} sx={{ ml: '8px' }} />
        ) : (
          <>
            <Typography sx={{ fontSize: fontSize.lg, fontWeight: fontWeight.bold, color: COLORS.TEXT_PRIMARY, pl: '8px' }}>
              ${Number(usedAmount).toFixed(2)}
              {maxAmount > 0 ? ` / $${Number(maxAmount).toFixed(2)}` : ''}
            </Typography>
            {planName && (
              <Typography sx={{ fontSize: fontSize.sm, color: COLORS.TEXT_MUTED, pl: '8px' }}>
                {planName}
              </Typography>
            )}
            {maxAmount > 0 && (
              <Box sx={{ pl: '8px', pr: '8px', mt: '4px' }}>
                <Box sx={{ height: '4px', borderRadius: '2px', bgcolor: '#e5e7eb', overflow: 'hidden' }}>
                  <Box
                    sx={{
                      height: '100%',
                      borderRadius: '2px',
                      bgcolor: usedAmount / maxAmount > 0.85 ? '#dc2626' : usedAmount / maxAmount > 0.6 ? '#f59e0b' : COLORS.ACCENT,
                      width: `${Math.min(100, (usedAmount / maxAmount) * 100).toFixed(1)}%`,
                      transition: 'width 0.3s ease',
                    }}
                  />
                </Box>
                <Typography sx={{ fontSize: fontSize.xs, color: COLORS.TEXT_MUTED, mt: '2px' }}>
                  ${Number(maxAmount - usedAmount).toFixed(2)} remaining
                </Typography>
              </Box>
            )}
          </>
        )}
      </SubSection>

    </DetailCard>
  );
};

/* ── Family Details ──────────────────────────────────────────────── */
export const FamilyDetails = () => {
  const { currentPatient } = usePatient();
  const balanceCache = useSelector(selectPatientBalanceCache);
  
  if (!currentPatient) return null;

  const patientId = currentPatient?._id || currentPatient?.id || currentPatient?.PatNum;
  const cachedBalance = patientId ? balanceCache[patientId]?.data : null;

  const household = currentPatient.household || [];
  // Prefer live balance API data; fall back to patient object fields
  const famBalance = cachedBalance?.familyBalance ?? currentPatient.familyBalance ?? currentPatient.FamBalTotal ?? 0;
  const indBalance = cachedBalance?.balance ?? currentPatient.totalBalance ?? currentPatient.BalTotal ?? 0;
  const insBalance = cachedBalance?.insuranceEstimate ?? currentPatient.insEst ?? currentPatient.InsEst ?? 0;

  const BillRow = ({ label, value }) => (
    <Box sx={{ display: 'flex', alignItems: 'baseline', gap: '4px' }}>
      <Typography sx={{ fontSize: fontSize.base, color: COLORS.TEXT_SECONDARY }}>{label}</Typography>
      <Typography sx={{ fontSize: fontSize.base, fontWeight: fontWeight.bold, color: COLORS.TEXT_PRIMARY }}>{value}</Typography>
    </Box>
  );

  return (
    <DetailCard icon={<PeopleAlt sx={{ fontSize: '20px', color: COLORS.ACCENT }} />} title="Family Details">

      {/* Family members */}
      <SubSection label="Family members:" open>
        {household.length > 0 ? (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: '8px', pl: '8px', pr: '8px' }}>
            {household.map((member, i) => (
              <Box key={i} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography sx={{ fontSize: fontSize.base, color: COLORS.TEXT_BODY, fontWeight: fontWeight.medium }}>
                  {member.firstName} {member.lastName}
                </Typography>
                <Typography sx={{ fontSize: fontSize.sm, color: COLORS.TEXT_MUTED, backgroundColor: COLORS.SURFACE_INPUT, px: '6px', py: '2px', borderRadius: '4px' }}>
                  {member.relationship}
                </Typography>
              </Box>
            ))}
          </Box>
        ) : (
          <Typography sx={{ fontSize: fontSize.base, color: COLORS.TEXT_MUTED, pl: '8px' }}>
            No family found
          </Typography>
        )}
      </SubSection>

      {/* Family Bills */}
      <SubSection label="Family Bills:" open>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: '4px', pl: '8px' }}>
          <BillRow label="Total outstanding:" value={`$${Number(famBalance).toFixed(2)}`} />
          <BillRow label="Individual Outstanding:" value={`$${Number(indBalance).toFixed(2)}`} />
          <BillRow label="Insurance Outstanding:" value={`$${Number(insBalance).toFixed(2)}`} />
        </Box>
      </SubSection>

    </DetailCard>
  );
};

export default PatientDetails;
