import { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  CircularProgress,
  Alert,
  IconButton,
} from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';
import { useSnackbar } from '../../contexts/SnackbarContext';
import { providerService } from '../../services/provider.service';
import EditProviderForm from './EditProviderForm';

const FORM_ID = 'add-provider-dialog-form';

const AddProviderDialog = ({ open, onClose, onSaved, title = 'Add Provider' }) => {
  const { showSnackbar } = useSnackbar();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const handleClose = () => {
    if (saving) return;
    setError('');
    onClose();
  };

  const handleSubmit = async (data) => {
    try {
      setSaving(true);
      setError('');
      const created = await providerService.createProvider(data);
      showSnackbar('Provider created successfully', 'success');
      onSaved?.(created);
      handleClose();
    } catch (err) {
      const msg =
        err.response?.data?.error?.message ||
        err.response?.data?.message ||
        'Failed to create provider. Please try again.';
      setError(msg);
      showSnackbar(msg, 'error');
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="md"
      fullWidth
      PaperProps={{ sx: { maxHeight: '90vh' } }}
    >
      <DialogTitle
        sx={{
          backgroundColor: '#1a3a6b',
          color: 'white',
          py: 1.5,
          px: 3,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <Typography variant="subtitle1" fontWeight={600}>
          {title}
        </Typography>
        <IconButton size="small" onClick={handleClose} sx={{ color: 'white' }}>
          <CloseIcon fontSize="small" />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ px: 3, py: 2 }}>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>
            {error}
          </Alert>
        )}
        <EditProviderForm
          formId={FORM_ID}
          provider={null}
          onSubmit={handleSubmit}
          loading={saving}
        />
      </DialogContent>

      <DialogActions sx={{ px: 3, py: 1.5, borderTop: '1px solid', borderColor: 'divider', gap: 1 }}>
        <Typography variant="caption" color="text.secondary" sx={{ flex: 1 }}>
          * required field
        </Typography>
        <Button onClick={handleClose} disabled={saving} variant="outlined" size="small"
          sx={{ color: '#c8a830', borderColor: '#c8a830', '&:hover': { borderColor: '#a88820' } }}>
          Cancel
        </Button>
        <Button
          type="submit"
          form={FORM_ID}
          variant="contained"
          size="small"
          disabled={saving}
          startIcon={saving ? <CircularProgress size={14} color="inherit" /> : null}
          sx={{ backgroundColor: '#c8a830', '&:hover': { backgroundColor: '#a88820' } }}
        >
          {saving ? 'Saving...' : 'Save'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddProviderDialog;
