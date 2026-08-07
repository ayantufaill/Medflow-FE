import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  CircularProgress,
  IconButton,
  Box,
  Typography
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { DescriptionOutlined as DescriptionIcon } from '@mui/icons-material';

const ConfirmationDialog = ({
  open,
  onClose,
  onConfirm,
  onCancel,
  title = 'Confirm Action',
  message = 'Are you sure you want to perform this action?',
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  confirmColor = 'error',
  loading = false,
  customContent,
}) => {
  const handleClose = () => {
    if (onCancel) {
      onCancel();
    } else if (onClose) {
      onClose();
    }
  };

  return (
    <Dialog
      open={open}
      onClose={loading ? undefined : handleClose}
      aria-labelledby="confirmation-dialog-title"
      aria-describedby="confirmation-dialog-description"
      sx={{ zIndex: 9999 }}
      PaperProps={{
        sx: { borderRadius: "12px", overflow: 'hidden', boxShadow: '0 10px 40px rgba(0,0,0,0.1)' }
      }}
    >
      <Box sx={{
        display: "flex", alignItems: "center", gap: "12px",
        px: "10px", py: "10px",
        borderBottom: "1px solid #e0e5eb", flexShrink: 0,
        backgroundColor: "#f3f8fd",
      }}>
        <Box sx={{
          width: "36px", height: "36px", borderRadius: "8px",
          backgroundColor: "#eff6ff",
          display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
        }}>
          <DescriptionIcon sx={{ fontSize: "20px", color: "#2262ef" }} />
        </Box>
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', flex: 1 }}>
          <Typography sx={{ 
            display: "flex", flexDirection: "column", justifyContent: "flex-start",
            alignItems: "flex-start", height: "24px", padding: "0px",
            fontFamily: "Inter", fontSize: "15px", fontWeight: 700, color: "#09121f",
            whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'
          }}>
            {title}
          </Typography>
          <Typography sx={{ 
            fontWeight: 400, lineHeight: "16.25px", letterSpacing: "0px",
            textAlign: "left", color: "#5c646f", fontFamily: "Inter", fontSize: "11px",
          }}>
            Please confirm your action below.
          </Typography>
        </Box>
        <IconButton onClick={handleClose} sx={{ color: "#6b7280", "&:hover": { color: "#111928", backgroundColor: "#e5e7eb" } }}>
          <CloseIcon />
        </IconButton>
      </Box>
      <DialogContent sx={{ p: 4 }}>
        {customContent ? (
          <>
            <DialogContentText
              id="confirmation-dialog-description"
              sx={{ mb: 2, fontFamily: "Inter", fontSize: "13px", color: "#374151" }}
            >
              {message}
            </DialogContentText>
            {customContent}
          </>
        ) : (
          <DialogContentText id="confirmation-dialog-description" sx={{ fontFamily: "Inter", fontSize: "13px", color: "#374151" }}>
            {message}
          </DialogContentText>
        )}
      </DialogContent>
      <DialogActions sx={{ px: "20px", py: "12px", borderTop: '1px solid #e0e5eb', gap: 1.5, justifyContent: 'flex-end' }}>
        <Button 
          onClick={handleClose} 
          variant="outlined" 
          disabled={loading}
          sx={{
            fontFamily: "Inter", fontSize: "13px", fontWeight: 500,
            textTransform: "none", borderRadius: "8px",
            border: "1px solid #d0d5dd", color: "#374151",
            px: "16px", py: "7px",
            "&:hover": { borderColor: "#9aa3ae", backgroundColor: "#f9fafb" },
          }}
        >
          {cancelText}
        </Button>
        <Button
          onClick={onConfirm}
          color={typeof confirmColor === 'string' && confirmColor.startsWith('#') ? undefined : confirmColor}
          variant="contained"
          autoFocus
          disabled={loading}
          sx={{
            fontFamily: "Inter", fontSize: "13px", fontWeight: 600,
            textTransform: "none", borderRadius: "8px",
            px: "20px", py: "7px",
            boxShadow: "none",
            backgroundColor: confirmColor === 'error' ? "#ef4444" : "#2262ef",
            color: "#fff",
            "&:hover": { backgroundColor: confirmColor === 'error' ? "#dc2626" : "#1a50cc", boxShadow: "none" },
            ...(typeof confirmColor === 'string' && confirmColor.startsWith('#') ? {
              bgcolor: confirmColor,
              color: '#fff',
              '&:hover': {
                bgcolor: confirmColor === '#0f766e' ? '#0d5e58' : confirmColor,
                boxShadow: 'none',
              }
            } : {})
          }}
          startIcon={
            loading ? <CircularProgress size={16} color="inherit" /> : null
          }
        >
          {confirmText}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmationDialog;
