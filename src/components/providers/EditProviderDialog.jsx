import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Tabs,
  Tab,
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
import OnlineProviderForm from './OnlineProviderForm';
import {
  fetchProviderById,
  selectCachedProviderById,
  selectProviderDetailLoading,
  updateProviderInList,
  invalidateProviderDetail,
} from '../../store/slices/providerSlice';

const FORM_ID = 'edit-provider-dialog-form';
const ONLINE_FORM_ID = 'edit-online-provider-dialog-form';

const EditProviderDialog = ({ providerId, providerName, open, onClose, onSaved }) => {
  const dispatch = useDispatch();
  const { showSnackbar } = useSnackbar();

  const provider = useSelector((state) => selectCachedProviderById(state, providerId));
  const detailLoading = useSelector(selectProviderDetailLoading);

  const [activeTab, setActiveTab] = useState(0);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (open && providerId) {
      dispatch(fetchProviderById(providerId));
      setActiveTab(0);
      setError('');
    }
  }, [open, providerId, dispatch]);

  const handleSubmit = async (data) => {
    try {
      setSaving(true);
      setError('');
      const updated = await providerService.updateProvider(providerId, data);
      dispatch(updateProviderInList(updated));
      dispatch(invalidateProviderDetail(providerId));
      showSnackbar('Provider updated successfully', 'success');
      onSaved?.(updated);
      onClose();
    } catch (err) {
      const msg =
        err.response?.data?.error?.message ||
        err.response?.data?.message ||
        'Failed to update provider. Please try again.';
      setError(msg);
      showSnackbar(msg, 'error');
    } finally {
      setSaving(false);
    }
  };

  const isLoading = detailLoading && !provider;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{ sx: { maxHeight: '90vh' } }}
    >
      {/* Header */}
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
          Edit {providerName || 'Provider'}
        </Typography>
        <IconButton size="small" onClick={onClose} sx={{ color: 'white' }}>
          <CloseIcon fontSize="small" />
        </IconButton>
      </DialogTitle>

      {/* Tabs */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider', px: 3, backgroundColor: '#fafafa' }}>
        <Tabs
          value={activeTab}
          onChange={(_, v) => setActiveTab(v)}
          sx={{
            '& .MuiTab-root': { textTransform: 'none', fontWeight: 500, fontSize: '0.875rem', minHeight: 40 },
            minHeight: 40,
          }}
        >
          <Tab label="Provider" disableRipple />
          <Tab label="Online Provider" disableRipple />
        </Tabs>
      </Box>

      {/* Content */}
      <DialogContent sx={{ px: 3, py: 2 }}>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>
            {error}
          </Alert>
        )}

        {activeTab === 0 && (
          isLoading ? (
            <Box display="flex" justifyContent="center" py={6}>
              <CircularProgress />
            </Box>
          ) : !provider ? (
            <Alert severity="error">Provider data could not be loaded.</Alert>
          ) : (
            <EditProviderForm
              formId={FORM_ID}
              provider={provider}
              onSubmit={handleSubmit}
              loading={saving}
            />
          )
        )}

        {activeTab === 1 && (
          isLoading ? (
            <Box display="flex" justifyContent="center" py={6}>
              <CircularProgress />
            </Box>
          ) : !provider ? (
            <Alert severity="error">Provider data could not be loaded.</Alert>
          ) : (
            <OnlineProviderForm
              formId={ONLINE_FORM_ID}
              provider={provider}
              onSubmit={handleSubmit}
            />
          )
        )}
      </DialogContent>

      {/* Footer */}
      <DialogActions sx={{ px: 3, py: 1.5, borderTop: '1px solid', borderColor: 'divider', gap: 1 }}>
        <Typography variant="caption" color="text.secondary" sx={{ flex: 1 }}>
          * required field
        </Typography>
        <Button onClick={onClose} disabled={saving} variant="outlined" size="small">
          Cancel
        </Button>
        <Button
          type="submit"
          form={activeTab === 0 ? FORM_ID : ONLINE_FORM_ID}
          variant="contained"
          size="small"
          disabled={saving || isLoading || !provider}
          startIcon={saving ? <CircularProgress size={14} color="inherit" /> : null}
          sx={{ backgroundColor: '#1a3a6b' }}
        >
          {saving ? 'Saving...' : 'Save'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditProviderDialog;
