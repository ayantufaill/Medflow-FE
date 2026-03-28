import { Box, Typography, Button } from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import { sectionTitleSx } from '../../constants/styles';

/**
 * Family Members (Add New, list area, "(One HOH per family)").
 * Pass onAddNew to handle adding family members.
 */
export default function FamilyMembersSection({ patient, onAddNew }) {
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
          return member?.relationship ? `${memberName} (${member.relationship})` : memberName;
        })
        .filter(Boolean)
    : [];
  const members = householdNames.length ? householdNames : [selfDisplayName].filter(Boolean);

  return (
    <Box>
      <Typography variant="subtitle1" sx={sectionTitleSx}>
        Family Members
      </Typography>
      <Button
        variant="outlined"
        size="small"
        startIcon={<AddIcon />}
        onClick={onAddNew}
        sx={{ textTransform: 'none', fontWeight: 600, borderRadius: 1.5, mb: 1 }}
      >
        Add New
      </Button>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flexWrap: 'wrap' }}>
        {members.map((member) => (
          <Typography key={member} variant="body2" fontWeight={600} sx={{ color: 'text.primary' }}>
            {member}
          </Typography>
        ))}
      </Box>
      <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.5 }}>
        (One HOH per family)
      </Typography>
    </Box>
  );
}