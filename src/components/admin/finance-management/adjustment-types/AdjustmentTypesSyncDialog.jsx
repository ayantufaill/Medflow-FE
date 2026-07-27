import { Dialog, DialogTitle, DialogContent, DialogActions, Box, Typography, TextField, Button } from '@mui/material';

const AdjustmentTypesSyncDialog = ({ open, onClose }) => {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      sx={{ zIndex: 9999 }}
      PaperProps={{
        sx: { borderRadius: 3, overflow: 'hidden', boxShadow: '0 10px 40px rgba(0,0,0,0.1)' }
      }}
    >
      <DialogTitle
        sx={{
          backgroundColor: '#fff',
          color: '#0f172a',
          fontSize: '1.1rem',
          fontWeight: 700,
          py: 3,
          px: 4,
          lineHeight: 1.3,
          borderBottom: '1px solid #f1f5f9'
        }}
      >
        Sync Offices
        <Typography variant="body2" sx={{ color: '#64748b', mt: 0.5, fontWeight: 400 }}>
          Select the offices you would like to sync with the source office
        </Typography>
      </DialogTitle>
      <DialogContent sx={{ mt: 3, px: 4 }}>
        <Box sx={{ mb: 3 }}>
          <Typography variant="body2" sx={{ mb: 1, fontWeight: 600, color: '#334155' }}>
            Source Office:
          </Typography>
          <TextField
            fullWidth
            size="small"
            value="thedentalstudio"
            disabled
            sx={{
              '& .MuiInputBase-root': { backgroundColor: '#f8fafc', borderRadius: 2 },
              '& .MuiInputBase-input': { fontSize: '0.85rem', color: '#64748b' },
              '& .MuiOutlinedInput-notchedOutline': { borderColor: '#e2e8f0' }
            }}
          />
        </Box>
        <Box>
          <Typography variant="body2" sx={{ mb: 1, fontWeight: 600, color: '#334155' }}>
            Target Offices:
          </Typography>
          <Box sx={{ p: 2, border: '1px solid #e2e8f0', borderRadius: 2, backgroundColor: '#f8fafc', textAlign: 'center' }}>
            <Typography variant="caption" sx={{ color: '#64748b' }}>
              Select target offices from the list below...
            </Typography>
          </Box>
        </Box>
      </DialogContent>
      <DialogActions sx={{ px: 4, pb: 4, pt: 2, gap: 1.5 }}>
        <Button
          onClick={onClose}
          sx={{
            textTransform: 'none',
            color: '#475569',
            fontWeight: 600,
            borderRadius: 2,
            px: 3,
            '&:hover': { backgroundColor: '#f1f5f9' }
          }}
          variant="text"
        >
          Cancel
        </Button>
        <Button
          variant="contained"
          sx={{
            textTransform: 'none',
            backgroundColor: '#2563eb',
            fontWeight: 600,
            borderRadius: 2,
            px: 3,
            boxShadow: 'none',
            '&:hover': { backgroundColor: '#1d4ed8', boxShadow: 'none' }
          }}
        >
          Sync Now
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AdjustmentTypesSyncDialog;
