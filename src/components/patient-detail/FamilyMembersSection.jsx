import { Box, Typography, IconButton } from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';
import InitialsAvatar from '../shared/InitialsAvatar';
import { computeAge } from './utils';
import { COLORS } from '../../constants/colors';
import { fontSize, fontWeight } from '../../constants/styles';

function MemberRow({ name, roleLabel, onRemove }) {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, py: 1 }}>
      <InitialsAvatar name={name} size={36} fontSize={13} bg={COLORS.ACCENT} />
      <Box sx={{ minWidth: 0, flex: 1 }}>
        <Typography sx={{ fontFamily: 'Inter', fontSize: fontSize.md, fontWeight: fontWeight.semibold, color: COLORS.TEXT_PRIMARY, lineHeight: 1.3 }}>
          {name}
        </Typography>
        {roleLabel && (
          <Typography sx={{ fontFamily: 'Inter', fontSize: fontSize.base, color: COLORS.TEXT_SECONDARY, lineHeight: 1.3 }}>
            {roleLabel}
          </Typography>
        )}
      </Box>
      {onRemove && (
        <IconButton size="small" onClick={onRemove}>
          <CloseIcon sx={{ fontSize: 16, color: COLORS.TEXT_MUTED }} />
        </IconButton>
      )}
    </Box>
  );
}

/**
 * Family Members list — self (always Head of Household) plus any added
 * household members, rendered as avatar rows matching the patient-detail
 * card convention. The "Add member" action and "One HOH per family"
 * subtitle live in the SectionCard header (see PatientDetailOverview.jsx).
 */
export default function FamilyMembersSection({ patient, isEditMode = false, onPatientDataChange }) {
  const name = patient ? `${patient.firstName || ''} ${patient.lastName || ''}`.trim() : '';
  const preferred = patient?.preferredName;
  const selfDisplayName = preferred && preferred !== name ? `${name} (${preferred})` : name;
  const selfAge = computeAge(patient?.dateOfBirth);
  const selfRoleLabel = ['HOH', selfAge != null && `${selfAge} y`].filter(Boolean).join(' · ');

  const householdMembers = Array.isArray(patient?.household) ? patient.household : [];

  const handleRemoveMember = (member) => {
    if (!onPatientDataChange) return;
    const updated = householdMembers.filter((m) => (m._id || m.id) !== (member._id || member.id));
    onPatientDataChange({ ...patient, household: updated });
  };

  return (
    <Box>
      <MemberRow name={selfDisplayName} roleLabel={selfRoleLabel} />
      {householdMembers.map((member, idx) => {
        const memberName =
          member?.displayName ||
          member?.name ||
          [member?.firstName, member?.lastName].filter(Boolean).join(' ').trim();
        if (!memberName) return null;
        const memberAge = member?.dateOfBirth ? computeAge(member.dateOfBirth) : member?.age;
        const roleLabel = [member?.relationship, memberAge != null && `${memberAge} y`].filter(Boolean).join(' · ');
        return (
          <MemberRow
            key={member._id || member.id || idx}
            name={memberName}
            roleLabel={roleLabel}
            onRemove={isEditMode ? () => handleRemoveMember(member) : undefined}
          />
        );
      })}
    </Box>
  );
}
