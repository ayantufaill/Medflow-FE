import { useState, useEffect, useMemo } from 'react';
import { Box, Typography, CircularProgress, Tooltip } from '@mui/material';
import { AddCircleOutline as AddCircleOutlineIcon, Person as PersonIcon } from '@mui/icons-material';
import dayjs from 'dayjs';
import { useSnackbar } from '../../../contexts/SnackbarContext';
import { patientService } from '../../../services/patient.service';
import { formatDate, formatDateForPayload } from '../../../utils/dateUtils';
import {
  getRemainingBenefits,
  getCoverageAmounts,
  getPolicyKey,
  getPolicyLabel,
} from '../utils/insuranceHelpers';
import DependentsDialog from './DependentsDialog';
import { COLORS } from '../../../constants/colors';
import { fontSize, fontWeight, radius } from '../../../constants/styles';

/** A household member is the subscriber when the coverage is keyed to "self". */
const isSubscriber = (ins, member) => {
  const rel = (ins?.relationshipToPatient || '').toLowerCase();
  if (rel === 'self') return true;
  // Fallback for records that store the relationship against the policy holder
  // rather than the row owner — match on the subscriber's name instead.
  const subscriber = (ins?.subscriberName || '').trim().toLowerCase();
  return Boolean(subscriber) && subscriber === member.name.trim().toLowerCase();
};

const money = (val) => `$${Number(val || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

/* ── Cell: member already has a coverage record on this policy ─────────────── */
const CoverageCell = ({ ins, member, busy, onViewPolicy, onToggleActive, showArchived }) => (
  <Box>
    <Box sx={{ border: `1px solid ${COLORS.BORDER}`, borderRadius: radius.md, overflow: 'hidden', bgcolor: COLORS.WHITE, opacity: busy ? 0.6 : 1 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 1, px: 1.5, py: 1 }}>
        <Typography sx={{ fontFamily: 'Inter', fontSize: fontSize.base, color: COLORS.TEXT_SECONDARY, whiteSpace: 'nowrap' }}>
          Individual Remaining Benefits
        </Typography>
        <Typography sx={{ fontFamily: 'Inter', fontSize: fontSize.md, fontWeight: fontWeight.semibold, color: COLORS.TEXT_PRIMARY, whiteSpace: 'nowrap' }}>
          {money(getRemainingBenefits(ins))}
        </Typography>
      </Box>
      <Box sx={{ display: 'flex', borderTop: `1px solid ${COLORS.BORDER}` }}>
        <Box
          onClick={busy ? undefined : () => onViewPolicy(member, ins)}
          sx={{ flex: 1, textAlign: 'center', py: 0.9, cursor: busy ? 'default' : 'pointer', color: COLORS.TEXT_BODY, '&:hover': { bgcolor: COLORS.SURFACE_HOVER } }}
        >
          <Typography sx={{ fontFamily: 'Inter', fontSize: fontSize.base, fontWeight: fontWeight.medium }}>View Policy</Typography>
        </Box>
        <Box
          onClick={busy ? undefined : () => onToggleActive(member, ins, showArchived)}
          sx={{ flex: 1, textAlign: 'center', py: 0.9, borderLeft: `1px solid ${COLORS.BORDER}`, cursor: busy ? 'default' : 'pointer', color: showArchived ? COLORS.STATUS_SUCCESS : COLORS.STATUS_ERROR, '&:hover': { bgcolor: COLORS.SURFACE_HOVER } }}
        >
          <Typography sx={{ fontFamily: 'Inter', fontSize: fontSize.base, fontWeight: fontWeight.medium }}>
            {showArchived ? 'Activate' : 'Deactivate'}
          </Typography>
        </Box>
      </Box>
    </Box>
    {isSubscriber(ins, member) && (
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 0.75 }}>
        <PersonIcon sx={{ fontSize: 14, color: COLORS.STATUS_SUCCESS }} />
        <Typography sx={{ fontFamily: 'Inter', fontSize: fontSize.base, color: COLORS.TEXT_SECONDARY }}>
          Patient is the subscriber
        </Typography>
      </Box>
    )}
  </Box>
);

/* ── Cell: policy exists in the family but not on this member ──────────────── */
const EmptyCell = ({ member, policy, busy, onActivateForMember }) => (
  <Box sx={{ border: `1px solid ${COLORS.BORDER}`, borderRadius: radius.md, overflow: 'hidden', bgcolor: COLORS.SURFACE_HOVER, opacity: busy ? 0.6 : 1 }}>
    <Box sx={{ textAlign: 'center', py: 1 }}>
      <Typography sx={{ fontFamily: 'Inter', fontSize: fontSize.base, color: COLORS.TEXT_MUTED }}>N/A</Typography>
    </Box>
    <Box
      onClick={busy ? undefined : () => onActivateForMember(member, policy)}
      sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0.75, py: 0.9, borderTop: `1px solid ${COLORS.BORDER}`, bgcolor: COLORS.WHITE, cursor: busy ? 'default' : 'pointer', '&:hover': { bgcolor: COLORS.SURFACE_TINT } }}
    >
      {busy ? <CircularProgress size={12} /> : <AddCircleOutlineIcon sx={{ fontSize: 15, color: COLORS.ACCENT }} />}
      <Typography sx={{ fontFamily: 'Inter', fontSize: fontSize.base, fontWeight: fontWeight.medium, color: COLORS.ACCENT }}>
        Activate Insurance Policy On This Patient
      </Typography>
    </Box>
  </Box>
);

/**
 * Family coverage matrix — household members down the rows, distinct family
 * policies across the columns, so staff can see at a glance who is covered by
 * what and attach a missing member to an existing policy in one click.
 *
 * Coverage records are per-patient on the API, so the matrix fetches each
 * household member's coverages itself; the signed-in patient's rows come from
 * the parent's Redux copy to avoid re-requesting data the tab already holds.
 */
export default function FamilyCoverageMatrix({
  patient,
  patientId,
  patientInsurances = [],
  getInsuranceCompanyName,
  showArchived = false,
  onViewPolicy,
  onChanged,
}) {
  const { showSnackbar } = useSnackbar();
  const [memberCoverages, setMemberCoverages] = useState({});
  const [loading, setLoading] = useState(false);
  const [busyCell, setBusyCell] = useState(null); // `${memberId}:${policyKey}` currently mutating
  // Bumped after any activate/deactivate so the other members' coverages are
  // re-fetched — their records live outside the parent's Redux cache.
  const [refreshToken, setRefreshToken] = useState(0);
  // Which empty cell opened the Dependents dialog, so Activate there knows
  // which member/policy pair to submit.
  const [dependentDialog, setDependentDialog] = useState({ open: false, member: null, policy: null });

  // Self first, then the household — mirrors how the family is listed everywhere
  // else in patient detail (FamilyMembersSection, FamilyLedgerTable).
  const members = useMemo(() => {
    const household = Array.isArray(patient?.household) ? patient.household : [];
    return [
      {
        id: patientId,
        name: `${patient?.firstName || ''} ${patient?.lastName || ''}`.trim() || 'Patient',
        dateOfBirth: patient?.dateOfBirth,
        isSelf: true,
      },
      ...household.map((m, idx) => ({
        id: m._id || m.id || `member-${idx}`,
        name: m.name || `${m.firstName || ''} ${m.lastName || ''}`.trim() || 'Family member',
        dateOfBirth: m.dateOfBirth || m.dob,
        isSelf: false,
      })),
    ];
  }, [patient, patientId]);

  // Only the other members need fetching; keyed on the id list so the effect
  // re-runs when the household changes but not on every parent re-render.
  const otherMemberIds = useMemo(
    () => members.filter((m) => !m.isSelf && m.id).map((m) => m.id).join(','),
    [members]
  );

  useEffect(() => {
    const ids = otherMemberIds ? otherMemberIds.split(',') : [];
    if (ids.length === 0) {
      setMemberCoverages({});
      return;
    }
    let cancelled = false;
    const load = async () => {
      setLoading(true);
      const results = await Promise.all(
        ids.map(async (id) => {
          try {
            return [id, await patientService.getPatientInsurances(id)];
          } catch (err) {
            // One member failing must not blank the whole matrix — that member
            // simply shows as having no coverage on any policy.
            console.error('Failed to load coverages for family member', id, err);
            return [id, []];
          }
        })
      );
      if (cancelled) return;
      setMemberCoverages(Object.fromEntries(results));
      setLoading(false);
    };
    load();
    return () => { cancelled = true; };
  }, [otherMemberIds, refreshToken]);

  // Coverages per member for the tab currently in view (active vs archived).
  const coveragesByMember = useMemo(() => {
    const map = {};
    members.forEach((m) => {
      const all = m.isSelf ? patientInsurances : (memberCoverages[m.id] || []);
      map[m.id] = (all || []).filter((ins) => Boolean(ins.isActive) === !showArchived);
    });
    return map;
  }, [members, patientInsurances, memberCoverages, showArchived]);

  // Columns are *policies*, not records: every member holds their own coverage
  // row for the same employer plan, so they are collapsed onto one column.
  const policies = useMemo(() => {
    const byKey = new Map();
    members.forEach((m) => {
      (coveragesByMember[m.id] || []).forEach((ins) => {
        const companyName = getInsuranceCompanyName(ins.insuranceCompanyId);
        const key = getPolicyKey(ins, companyName);
        if (!byKey.has(key)) {
          byKey.set(key, { key, label: getPolicyLabel(ins, companyName), template: ins });
        }
      });
    });
    return Array.from(byKey.values());
  }, [members, coveragesByMember, getInsuranceCompanyName]);

  const findCoverage = (memberId, policyKey) =>
    (coveragesByMember[memberId] || []).find(
      (ins) => getPolicyKey(ins, getInsuranceCompanyName(ins.insuranceCompanyId)) === policyKey
    );

  /** Flip isActive on an existing coverage record owned by any family member. */
  const handleToggleActive = async (member, ins, activate) => {
    const cellKey = `${member.id}:${getPolicyKey(ins, getInsuranceCompanyName(ins.insuranceCompanyId))}`;
    setBusyCell(cellKey);
    try {
      await patientService.updatePatientInsurance(member.id, ins._id || ins.id, { isActive: activate });
      showSnackbar(`Policy ${activate ? 'activated' : 'deactivated'} for ${member.name}`, 'success');
      onChanged?.();
      setRefreshToken((t) => t + 1);
    } catch (err) {
      showSnackbar(err.response?.data?.error?.message || err.response?.data?.message || 'Failed to update policy', 'error');
    } finally {
      setBusyCell(null);
    }
  };

  // "Activate Insurance Policy On This Patient" opens the Dependents dialog
  // rather than submitting straight away — relationship, renewal month and
  // the subscriber all need confirming per the household, not just copied.
  const handleActivateForMember = (member, policy) => {
    setDependentDialog({ open: true, member, policy });
  };

  /**
   * Attach a member to a policy the rest of the family already has by cloning
   * the carrier/group identity off an existing record, with the relationship,
   * renewal month and subscriber the Dependents dialog confirmed. Benefit
   * usage and ordinal are deliberately left to the API defaults — only the
   * policy identity and the dialog's answers travel to the new member.
   */
  const handleConfirmActivate = async ({ relationshipToPatient, renewalMonth, subscriberName, subscriberDateOfBirth }) => {
    const { member, policy } = dependentDialog;
    const cellKey = `${member.id}:${policy.key}`;
    setBusyCell(cellKey);
    const src = policy.template;
    const companyId =
      src.insuranceCompanyId && typeof src.insuranceCompanyId === 'object'
        ? src.insuranceCompanyId._id || src.insuranceCompanyId.id
        : src.insuranceCompanyId;
    const { maxAmount } = getCoverageAmounts(src);
    try {
      await patientService.createPatientInsurance(member.id, {
        insuranceCompanyId: companyId,
        policyNumber: String(src.policyNumber || src.groupNumber || '00000').slice(0, 30),
        groupNumber: src.groupNumber,
        groupName: src.groupName,
        employerName: src.employerName,
        subscriberName: subscriberName || src.subscriberName,
        subscriberDateOfBirth: subscriberDateOfBirth || src.subscriberDateOfBirth,
        relationshipToPatient,
        renewalMonth,
        effectiveDate: src.effectiveDate || formatDateForPayload(dayjs()),
        expirationDate: src.expirationDate || undefined,
        copayAmount: 0,
        deductibleAmount: maxAmount || src.deductibleAmount || 1500,
        isActive: true,
        verificationStatus: 'pending',
      });
      showSnackbar(`Policy activated for ${member.name}`, 'success');
      setDependentDialog({ open: false, member: null, policy: null });
      onChanged?.();
      setRefreshToken((t) => t + 1);
    } catch (err) {
      showSnackbar(err.response?.data?.error?.message || err.response?.data?.message || 'Failed to activate policy', 'error');
    } finally {
      setBusyCell(null);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
        <CircularProgress size={22} />
      </Box>
    );
  }

  if (policies.length === 0) {
    return (
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 180 }}>
        <Typography sx={{ fontFamily: 'Inter', fontSize: fontSize.md, fontWeight: fontWeight.semibold, color: COLORS.TEXT_MUTED }}>
          No {showArchived ? 'archived ' : ''}family coverages found for this household.
        </Typography>
      </Box>
    );
  }

  // Fixed-width columns inside a horizontal scroller: a household can carry more
  // policies than the viewport fits, and squeezing them breaks the cell buttons.
  const gridTemplate = `200px repeat(${policies.length}, minmax(300px, 1fr))`;

  return (
    <Box sx={{ overflowX: 'auto', pb: 1, mb: 3 }}>
      <Box sx={{ minWidth: 'fit-content' }}>
        {/* Header: policy names across the top */}
        <Box sx={{ display: 'grid', gridTemplateColumns: gridTemplate, gap: 2, alignItems: 'end', pb: 1 }}>
          <Typography sx={{ fontFamily: 'Inter', fontSize: fontSize.md, fontWeight: fontWeight.semibold, color: COLORS.TEXT_PRIMARY }}>
            Patient
          </Typography>
          {policies.map((p) => (
            <Tooltip key={p.key} title={p.label}>
              <Typography
                sx={{
                  fontFamily: 'Inter',
                  fontSize: fontSize.base,
                  fontWeight: fontWeight.semibold,
                  color: COLORS.TEXT_PRIMARY,
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}
              >
                {p.label}
              </Typography>
            </Tooltip>
          ))}
        </Box>

        {/* One row per household member */}
        {members.map((member) => (
          <Box
            key={member.id}
            sx={{
              display: 'grid',
              gridTemplateColumns: gridTemplate,
              gap: 2,
              alignItems: 'center',
              py: 1.5,
              borderTop: `1px solid ${COLORS.BORDER}`,
            }}
          >
            <Box>
              <Typography sx={{ fontFamily: 'Inter', fontSize: fontSize.md, fontWeight: fontWeight.semibold, color: COLORS.TEXT_PRIMARY }}>
                {member.name}
              </Typography>
              <Typography sx={{ fontFamily: 'Inter', fontSize: fontSize.base, color: COLORS.TEXT_MUTED }}>
                DoB: {member.dateOfBirth ? formatDate(member.dateOfBirth) : 'N/A'}
              </Typography>
            </Box>
            {policies.map((policy) => {
              const ins = findCoverage(member.id, policy.key);
              const busy = busyCell === `${member.id}:${policy.key}`;
              return ins ? (
                <CoverageCell
                  key={policy.key}
                  ins={ins}
                  member={member}
                  busy={busy}
                  showArchived={showArchived}
                  onViewPolicy={onViewPolicy}
                  onToggleActive={handleToggleActive}
                />
              ) : (
                <EmptyCell
                  key={policy.key}
                  member={member}
                  policy={policy}
                  busy={busy}
                  onActivateForMember={handleActivateForMember}
                />
              );
            })}
          </Box>
        ))}
      </Box>

      <DependentsDialog
        key={`${dependentDialog.member?.id || 'none'}:${dependentDialog.policy?.key || 'none'}`}
        open={dependentDialog.open}
        onClose={() => setDependentDialog({ open: false, member: null, policy: null })}
        member={dependentDialog.member}
        policy={dependentDialog.policy}
        familyMembers={members}
        onConfirm={handleConfirmActivate}
        submitting={Boolean(dependentDialog.member && busyCell === `${dependentDialog.member.id}:${dependentDialog.policy?.key}`)}
      />
    </Box>
  );
}
