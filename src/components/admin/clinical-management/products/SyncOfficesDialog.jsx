import { Dialog, DialogTitle, DialogContent, DialogActions, Box, Typography, TextField, Button, IconButton } from '@mui/material';
import { Sync as SyncIcon, Close as CloseIcon } from '@mui/icons-material';

const SyncOfficesDialog = ({ open, onClose }) => {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      sx={{ zIndex: 9999 }}
      PaperProps={{
        sx: { 
          width: '880px',
          maxWidth: 'none',
          borderRadius: '12px',
          border: '1px solid #e0e5eb',
          boxShadow: '0px 8px 24px rgba(0, 0, 0, 0.1)',
          m: 2,
          overflow: 'hidden'
        }
      }}
    >
      <DialogTitle
        sx={{
          display: "flex", alignItems: "center", gap: "12px",
          px: "10px", py: "10px",
          borderBottom: "1px solid #e0e5eb", flexShrink: 0,
          backgroundColor: "#f3f8fd",
          m: 0,
        }}
      >
        <Box sx={{
          width: "36px", height: "36px", borderRadius: "8px",
          backgroundColor: "#eff6ff",
          display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
        }}>
          <SyncIcon sx={{ fontSize: "20px", color: "#2262ef" }} />
        </Box>
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', flex: 1 }}>
          <Typography sx={{
            display: "flex", flexDirection: "column", justifyContent: "flex-start",
            alignItems: "flex-start", height: "24px", padding: "0px",
            fontFamily: "Inter", fontSize: "15px", fontWeight: 700, color: "#09121f",
            whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'
          }}>
            Sync Offices
          </Typography>
          <Typography sx={{ fontSize: '0.85rem', color: '#64748b', fontWeight: 400, mt: 0.5 }}>
            Select the offices you would like to sync with the source office
          </Typography>
        </Box>
        <IconButton onClick={onClose} size="small" sx={{ color: "#6b7280", ml: 1 }}>
          <CloseIcon sx={{ fontSize: "18px" }} />
        </IconButton>
      </DialogTitle>
      <DialogContent sx={{ px: '25px', pt: '16px !important', pb: '20px', backgroundColor: '#fff', overflow: 'hidden' }}>
        <Box sx={{ mb: 4 }}>
          <Typography variant="body2" sx={{ mb: 1.5, fontWeight: 600, color: '#334155' }}>
            Source Office:
          </Typography>
          <TextField
            fullWidth
            size="small"
            value="thedentalstudio"
            disabled
            sx={{
              '& .MuiInputBase-input': { backgroundColor: '#f8fafc', fontSize: '0.9rem', py: 1, borderRadius: 2, color: '#475569' },
              '& .MuiOutlinedInput-notchedOutline': { border: '1px solid #e2e8f0' }
            }}
          />
        </Box>
        <Box>
          <Typography variant="body2" sx={{ mb: 1.5, fontWeight: 600, color: '#334155' }}>
            Target Offices:
          </Typography>
          {/* Placeholder for Target Offices list */}
          <Box sx={{ p: 4, border: '1px dashed #cbd5e1', borderRadius: 2, backgroundColor: '#f8fafc', textAlign: 'center' }}>
            <Typography variant="body2" sx={{ color: '#64748b' }}>
              Select target offices from the list below...
            </Typography>
          </Box>
        </Box>
      </DialogContent>
      <DialogActions sx={{ p: '16px 20px', borderTop: '1px solid #e0e5eb', backgroundColor: '#fff', gap: '8px' }}>
        <Button
          variant="outlined"
          onClick={onClose}
          sx={{
            borderColor: "#d0d5dd",
            color: "#374151",
            fontFamily: "Inter",
            textTransform: 'none',
            fontSize: '13px',
            fontWeight: 500,
            borderRadius: "8px",
            height: '36px',
            px: 3,
            '&:hover': { borderColor: "#9aa3ae", backgroundColor: "#f9fafb" }
          }}
        >
          Cancel
        </Button>
        <Button
          variant="contained"
          onClick={onClose}
          disableElevation
          sx={{
            backgroundColor: "#2262ef",
            color: "#ffffff",
            fontFamily: "Inter",
            textTransform: 'none',
            fontSize: '13px',
            fontWeight: 500,
            borderRadius: "8px",
            height: '36px',
            px: 4,
            '&:hover': { backgroundColor: "#1e53cc" }
          }}
        >
          Sync Now
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default SyncOfficesDialog;
