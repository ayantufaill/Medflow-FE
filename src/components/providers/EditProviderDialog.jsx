import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Dialog,
  DialogContent,
  Box,
  Typography,
  Tabs,
  Tab,
  CircularProgress,
  Alert,
  IconButton,
  Button,
} from '@mui/material';
import {
  Close as CloseIcon,
  Save as SaveIcon,
  Edit as EditIcon,
} from '@mui/icons-material';
import { useSnackbar } from '../../contexts/SnackbarContext';
import { COLORS } from '../../constants/colors';
import EditProviderForm from './EditProviderForm';
import OnlineProviderForm from './OnlineProviderForm';
import {
  fetchProviderById,
  selectCachedProviderById,
  selectProviderDetailLoading,
  updateProvider,
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
      const updated = await dispatch(updateProvider({ providerId, updates: data })).unwrap();
      showSnackbar('Provider updated successfully', 'success');
      onSaved?.(updated);
      onClose();
    } catch (err) {
      let msg = 'Failed to update provider. Please try again.';
      if (err?.name === 'ConditionError') return;

      if (typeof err === 'string') {
        msg = err;
      } else if (err?.message) {
        msg = err.message;
      }

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
      sx={{ zIndex: 9999 }}
      PaperProps={{
        sx: {
          borderRadius: '14px',
          boxShadow: '0px 10px 30px rgba(0,0,0,0.1)',
          overflow: 'hidden',
          maxHeight: '88vh',
          display: 'flex',
          flexDirection: 'column',
        }
      }}
    >
      {/* Modal Header */}
      <Box sx={{
        px: '24px', height: '73px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        backgroundColor: COLORS.SURFACE_TINT,
        borderBottom: `1px solid ${COLORS.BORDER}`,
        flexShrink: 0
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Box sx={{
            width: '40px', height: '40px', borderRadius: '10px', backgroundColor: '#eff6ff',
            display: 'flex', alignItems: 'center', justifyContent: 'center', mr: '16px', flexShrink: 0
          }}>
            <EditIcon sx={{ fontSize: '22px', color: '#3b82f6' }} />
          </Box>
          <Box>
            <Typography sx={{ fontFamily: 'Inter, sans-serif', fontWeight: 600, fontSize: '16px', color: '#0f172a', lineHeight: 1 }}>
              Edit {providerName || 'Provider'}
            </Typography>
            <Typography sx={{ fontFamily: 'Inter, sans-serif', fontWeight: 400, fontSize: '11.5px', color: '#64748b', mt: '4px', lineHeight: 1 }}>
              Update provider information, credentials, and settings
            </Typography>
          </Box>
        </Box>
        <IconButton onClick={onClose} size="small" disabled={saving} sx={{ color: '#64748b', '&:hover': { color: '#0f172a', bgcolor: 'rgba(0,0,0,0.05)' } }}>
          <CloseIcon sx={{ fontSize: '20px' }} />
        </IconButton>
      </Box>

      {/* Tabs */}
      <Box sx={{ borderBottom: `1px solid ${COLORS.BORDER}`, px: '24px', backgroundColor: '#ffffff', flexShrink: 0 }}>
        <Tabs
          value={activeTab}
          onChange={(_, v) => setActiveTab(v)}
          sx={{
            minHeight: 44,
            '& .MuiTab-root': {
              textTransform: 'none',
              fontFamily: 'Inter, sans-serif',
              fontWeight: 600,
              fontSize: '13px',
              color: '#64748b',
              minHeight: 44,
              px: 2,
              '&.Mui-selected': { color: '#1d4ed8' },
            },
            '& .MuiTabs-indicator': { backgroundColor: '#1d4ed8', height: '2.5px', borderRadius: '2px' },
          }}
        >
          <Tab label="Provider" disableRipple />
          <Tab label="Online Provider" disableRipple />
        </Tabs>
      </Box>

      {/* Content */}
      <DialogContent sx={{ p: '24px', bgcolor: COLORS.BACKGROUND, flex: 1, overflowY: 'auto' }}>
        {error && (
          <Alert severity="error" sx={{ mb: 2.5, borderRadius: '8px', fontFamily: 'Inter, sans-serif' }} onClose={() => setError('')}>
            {error}
          </Alert>
        )}

        {activeTab === 0 && (
          isLoading ? (
            <Box display="flex" justifyContent="center" alignItems="center" py={8}>
              <CircularProgress />
            </Box>
          ) : !provider ? (
            <Alert severity="error" sx={{ borderRadius: '8px' }}>Provider data could not be loaded.</Alert>
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
            <Box display="flex" justifyContent="center" alignItems="center" py={8}>
              <CircularProgress />
            </Box>
          ) : !provider ? (
            <Alert severity="error" sx={{ borderRadius: '8px' }}>Provider data could not be loaded.</Alert>
          ) : (
            <OnlineProviderForm
              formId={ONLINE_FORM_ID}
              provider={provider}
              onSubmit={handleSubmit}
            />
          )
        )}
      </DialogContent>

      {/* Modal Footer Actions */}
      <Box sx={{
        height: '57px', px: '24px', flexShrink: 0,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        backgroundColor: '#ffffff',
        borderTop: `1px solid ${COLORS.BORDER}`
      }}>
        <Typography sx={{ fontFamily: 'Inter, sans-serif', fontSize: '12px', fontWeight: 500, color: '#94a3b8' }}>
          * required field
        </Typography>
        <Box sx={{ display: 'flex', gap: '12px' }}>
          <Button
            variant="outlined"
            onClick={onClose}
            disabled={saving}
            sx={{
              textTransform: 'none', fontFamily: 'Inter, sans-serif', fontWeight: 600, fontSize: '13px',
              borderColor: '#cbd5e1', color: '#0f172a', borderRadius: '6px',
              px: '16px', height: '36px',
              '&:hover': { bgcolor: '#f8fafc', borderColor: '#cbd5e1' }
            }}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            form={activeTab === 0 ? FORM_ID : ONLINE_FORM_ID}
            variant="contained"
            disableElevation
            disabled={saving || isLoading || !provider}
            startIcon={saving ? <CircularProgress size={16} color="inherit" /> : <SaveIcon sx={{ fontSize: '17px !important' }} />}
            sx={{
              textTransform: 'none', fontFamily: 'Inter, sans-serif', fontWeight: 600, fontSize: '13px',
              bgcolor: '#1d4ed8', color: '#ffffff', borderRadius: '6px',
              px: '24px', height: '36px',
              '&:hover': { bgcolor: '#1e40af' }
            }}
          >
            {saving ? 'Saving...' : 'Save Changes'}
          </Button>
        </Box>
      </Box>
    </Dialog>
  );
};

export default EditProviderDialog;
