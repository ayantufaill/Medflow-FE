import { Box, Typography, Button, IconButton, Chip } from '@mui/material';
import { Add as AddIcon, Close as CloseIcon } from '@mui/icons-material';
import { sectionTitleSx } from '../../constants/styles';

/**
 * Family Members (Add New, list area, "(One HOH per family)").
 * Pass onAddNew to handle adding family members.
 */
export default function FamilyMembersSection({ patient, onAddNew, isEditMode = false, onPatientDataChange }) {
  const name = patient ? `${patient.firstName} ${patient.lastName}` : '';
  const preferred = patient?.preferredName || name;
  const selfDisplayName = name + (preferred && preferred !== name ? ` (${preferred})` : '');
  const householdMembers = Array.isArray(patient?.household) ? patient.household : [];
  const householdNames = householdMembers.length
    ? householdMembers
        .map((member) => {
          const memberName =
            member?.displayName ||
            member?.name ||
            [member?.firstName, member?.lastName].filter(Boolean).join(' ').trim();
          if (!memberName) return null;
          return { label: member?.relationship ? `${memberName} (${member.relationship})` : memberName, raw: member };
        })
        .filter(Boolean)
    : [];
  const members = householdNames.length ? householdNames : [selfDisplayName].filter(Boolean);
  const handleRemoveMember = (memberToRemove) => {
    if (!onPatientDataChange) return;
    const updatedHousehold = householdMembers.filter(m => {
      const mId = m._id || m.id;
      const rId = memberToRemove._id || memberToRemove.id;
      return mId !== rId;
    });
    onPatientDataChange({ ...patient, household: updatedHousehold });
  };

  return (
    <Box>
      <Typography variant="subtitle1" sx={sectionTitleSx}>
        Family Members
      </Typography>
      {isEditMode && (
        <Button
          variant="outlined"
          size="small"
          startIcon={<AddIcon />}
          onClick={onAddNew}
          sx={{ textTransform: 'none', fontWeight: 600, borderRadius: 1.5, mb: 1.5 }}
        >
          Add New
        </Button>
      )}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap', mt: isEditMode ? 0 : 0.5 }}>
        {members.map((memberObj, index) => {
          const isSelf = memberObj === selfDisplayName;
          return isEditMode && !isSelf ? (
            <Chip
              key={index}
              label={memberObj.label}
              onDelete={() => handleRemoveMember(memberObj.raw)}
              size="small"
              sx={{ fontWeight: 600, bgcolor: 'background.paper', border: '1px solid', borderColor: 'divider' }}
            />
          ) : (
            <Typography key={index} variant="body2" fontWeight={600} sx={{ color: 'text.primary' }}>
              {isSelf ? memberObj : memberObj.label}
              {index < members.length - 1 && !isEditMode ? ', ' : ''}
            </Typography>
          );
        })}
      </Box>
      <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1 }}>
        (One HOH per family)
      </Typography>
    </Box>
  );
}