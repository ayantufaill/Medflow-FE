import { Box, Typography, Button } from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';

const sectionTitleSx = {
  fontSize: '0.95rem',
  fontWeight: 700,
  color: 'primary.main',
  mb: 1.5,
};

/**
 * Family Members (Add New, list area, "(One HOH per family)").
 * Pass onAddNew to handle adding family members.
 */
export default function FamilyMembersSection({ patient, onAddNew }) {
  const name = patient ? `${patient.firstName} ${patient.lastName}` : '';
  const preferred = patient?.preferredName || name;
  const displayName = name + (preferred && preferred !== name ? ` (${preferred})` : '');

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
        <Typography variant="body2" fontWeight={600} sx={{ color: 'text.primary' }}>
          {displayName || 'Anna Ricco (Annie)'}
        </Typography>
      </Box>
      <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.5 }}>
        (One HOH per family)
      </Typography>
    </Box>
  );
}
