import { Box, Typography, Button, FormControlLabel, Checkbox } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import MeetingRoomIcon from '@mui/icons-material/MeetingRoomOutlined';

const ACCENT_BLUE = '#2262EF';

const OperatorySetupHeader = ({ onAddOperatory, showDeleted, onToggleShowDeleted }) => (
  <Box sx={{ mb: 1.5 }}>
    {/* Title bar: pulled flush to the parent card's edges (negative margin cancels
        out the card's padding) and rounded only on top to match the card corners */}
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 1,
        bgcolor: '#eef3fc',
        borderRadius: '8px 8px 0 0',
        px: 2.5,
        py: 1.25,
        mt: -2.5,
        mx: -2.5,
        mb: 2,
      }}
    >
      <MeetingRoomIcon sx={{ fontSize: 18, color: ACCENT_BLUE }} />
      <Typography variant="subtitle1" sx={{ color: '#333', fontWeight: 600 }}>
        Operatories
      </Typography>
    </Box>

    {/* Checkbox + Add button row, above the table */}
    <Box sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: 2, mb: 1.5 }}>
      <FormControlLabel
        control={<Checkbox size="small" sx={{ p: 0.5 }} checked={showDeleted} onChange={onToggleShowDeleted} />}
        label={<Typography variant="caption" color="textSecondary">Show deleted operatories</Typography>}
      />
      <Button
        variant="contained"
        startIcon={<AddIcon />}
        onClick={onAddOperatory}
        sx={{
          borderRadius: '20px',
          textTransform: 'none',
          px: 2.5,
          bgcolor: ACCENT_BLUE,
          boxShadow: 'none',
          '&:hover': { bgcolor: '#1a4fc4', boxShadow: 'none' },
        }}
      >
        Add Operatory
      </Button>
    </Box>
  </Box>
);

export default OperatorySetupHeader;