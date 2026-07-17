import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
} from '@mui/material';
import { COLORS } from '../../constants/colors';
import { radius, fontSize, fontWeight, roundedSelectMenuProps } from '../../constants/styles';

export default function AttachToNoteDialog({
  open,
  onClose,
  clinicalNotes = [],
  selectedNoteId,
  onChangeNote,
  onConfirm,
  loading,
}) {
  const formatDate = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="xs"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: radius.lg,
          border: `1px solid ${COLORS.BORDER}`,
        },
      }}
    >
      <DialogTitle
        sx={{
          fontWeight: fontWeight.bold,
          fontSize: fontSize.lg,
          color: COLORS.TEXT_PRIMARY,
          fontFamily: 'Inter',
          pb: 1,
        }}
      >
        Attach Document to Clinical Note
      </DialogTitle>
      <DialogContent sx={{ pb: 2 }}>
        <Box sx={{ mt: 1.5 }}>
          {clinicalNotes.length === 0 ? (
            <Alert severity="info" sx={{ borderRadius: radius.md }}>
              No unsigned clinical notes available for this patient.
            </Alert>
          ) : (
            <FormControl fullWidth>
              <InputLabel
                sx={{
                  fontFamily: 'Inter',
                  fontSize: fontSize.base,
                }}
              >
                Select Clinical Note
              </InputLabel>
              <Select
                value={selectedNoteId}
                onChange={(e) => onChangeNote(e.target.value)}
                label="Select Clinical Note"
                MenuProps={roundedSelectMenuProps}
                sx={{
                  borderRadius: radius.md,
                  fontFamily: 'Inter',
                  fontSize: fontSize.base,
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: COLORS.BORDER,
                  },
                  '&:hover .MuiOutlinedInput-notchedOutline': {
                    borderColor: COLORS.TEXT_MUTED,
                  },
                  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                    borderColor: COLORS.ACCENT,
                  },
                }}
              >
                {clinicalNotes.map((note) => (
                  <MenuItem key={note._id} value={note._id}>
                    {formatDate(note.createdAt)} - {note.chiefComplaint || 'No Chief Complaint'}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          )}
        </Box>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2.5 }}>
        <Button
          onClick={onClose}
          sx={{
            textTransform: 'none',
            borderRadius: radius.md,
            color: COLORS.TEXT_SECONDARY,
            fontWeight: fontWeight.semibold,
            fontSize: fontSize.base,
            '&:hover': {
              backgroundColor: COLORS.SURFACE_HOVER,
            },
          }}
        >
          Cancel
        </Button>
        <Button
          onClick={onConfirm}
          variant="contained"
          disabled={loading || !selectedNoteId}
          sx={{
            textTransform: 'none',
            borderRadius: radius.md,
            bgcolor: COLORS.ACCENT,
            fontWeight: fontWeight.semibold,
            fontSize: fontSize.base,
            boxShadow: 'none',
            '&:hover': {
              bgcolor: COLORS.ACCENT_HOVER,
              boxShadow: 'none',
            },
          }}
        >
          {loading ? <CircularProgress size={20} /> : 'Attach'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
