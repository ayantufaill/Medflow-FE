import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  CircularProgress,
  Typography,
  IconButton
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

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
    >
      <DialogTitle
        id="confirmation-dialog-title"
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          px: 3,
          py: 2,
          bgcolor: '#f8fafc',
          borderBottom: '1px solid #e2e8f0',
        }}
      >
        <Typography sx={{ fontWeight: 600, color: '#1e293b', fontSize: '1.1rem' }}>
          {title}
        </Typography>
        <IconButton onClick={handleClose} size="small" sx={{ color: '#64748b' }}>
          <CloseIcon fontSize="small" />
        </IconButton>
      </DialogTitle>
      <DialogContent sx={{ p: 3, pt: '24px !important' }}>
        {customContent ? (
          <>
            <DialogContentText
              id="confirmation-dialog-description"
              sx={{ mb: 2 }}
            >
              {message}
            </DialogContentText>
            {customContent}
          </>
        ) : (
          <DialogContentText id="confirmation-dialog-description">
            {message}
          </DialogContentText>
        )}
      </DialogContent>
      <DialogActions sx={{ px: 3, py: 2, borderTop: '1px solid #e2e8f0', bgcolor: '#fff', gap: 1 }}>
        <Button 
          onClick={handleClose} 
          variant="outlined" 
          disabled={loading}
          sx={{
            color: '#64748b',
            borderColor: '#cbd5e1',
            textTransform: 'none',
            borderRadius: '8px',
            fontWeight: 600,
            px: 3,
            '&:hover': { borderColor: '#94a3b8', bgcolor: '#f1f5f9' },
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
            textTransform: 'none',
            borderRadius: '8px',
            fontWeight: 600,
            px: 3,
            boxShadow: 'none',
            ...(typeof confirmColor === 'string' && confirmColor.startsWith('#') ? {
              bgcolor: confirmColor,
              color: '#fff',
              '&:hover': {
                bgcolor: confirmColor === '#0f766e' ? '#0d5e58' : confirmColor,
                boxShadow: 'none',
              }
            } : {
              '&:hover': { boxShadow: 'none' }
            })
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
