import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Dialog,
  DialogContent,
  Box,
  Typography,
  CircularProgress,
  Alert,
  IconButton,
  Button,
  Grid,
} from '@mui/material';
import {
  Close as CloseIcon,
  Visibility as VisibilityIcon,
} from '@mui/icons-material';
import { COLORS } from '../../constants/colors';
import { fontSize, fontWeight } from '../../constants/styles';
import {
  fetchProviderById,
  selectCachedProviderById,
  selectProviderDetailLoading,
} from '../../store/slices/providerSlice';

const InfoRow = ({ label, value }) => (
  <Box sx={{ display: 'flex', gap: 1, py: 0.5, alignItems: 'baseline' }}>
    <Typography sx={{ fontSize: fontSize.base, color: COLORS.TEXT_MUTED, whiteSpace: 'nowrap', flexShrink: 0 }}>
      {label}:
    </Typography>
    <Typography sx={{ fontSize: fontSize.base, color: COLORS.TEXT_PRIMARY, fontWeight: fontWeight.semibold, wordBreak: 'break-word' }}>
      {value || '—'}
    </Typography>
  </Box>
);

const SectionTitle = ({ children }) => (
  <Typography sx={{
    fontFamily: 'Inter, sans-serif',
    fontWeight: 700,
    fontSize: '13px',
    color: '#0f172a',
    mb: 1.5,
    pb: 0.75,
    borderBottom: `1px solid ${COLORS.BORDER_LIGHT}`,
  }}>
    {children}
  </Typography>
);

const formatSpecialty = (value) => {
  if (!value) return '';
  if (Array.isArray(value)) {
    const cleaned = value.map((v) => (typeof v === 'string' ? v.trim() : '')).filter(Boolean);
    return cleaned.length ? cleaned.join(', ') : '';
  }
  return typeof value === 'string' ? value.trim() || '' : '';
};

const ViewProviderDialog = ({ providerId, providerName, open, onClose }) => {
  const dispatch = useDispatch();

  const provider = useSelector((state) => selectCachedProviderById(state, providerId));
  const detailLoading = useSelector(selectProviderDetailLoading);

  useEffect(() => {
    if (open && providerId) {
      dispatch(fetchProviderById(providerId));
    }
  }, [open, providerId, dispatch]);

  const isLoading = detailLoading && !provider;

  const userId = provider?.userId || {};
  const addr = provider?.address || {};

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
            width: '40px', height: '40px', borderRadius: '10px', backgroundColor: '#f0fdf4',
            display: 'flex', alignItems: 'center', justifyContent: 'center', mr: '16px', flexShrink: 0
          }}>
            <VisibilityIcon sx={{ fontSize: '22px', color: '#16a34a' }} />
          </Box>
          <Box>
            <Typography sx={{ fontFamily: 'Inter, sans-serif', fontWeight: 700, fontSize: '18px', color: '#0f172a', lineHeight: 1 }}>
              {providerName || 'Provider Details'}
            </Typography>
            <Typography sx={{ fontFamily: 'Inter, sans-serif', fontWeight: 500, fontSize: '13px', color: '#64748b', mt: '4px', lineHeight: 1 }}>
              View provider information and credentials
            </Typography>
          </Box>
        </Box>
        <IconButton onClick={onClose} size="small" sx={{ color: '#64748b', '&:hover': { color: '#0f172a', bgcolor: 'rgba(0,0,0,0.05)' } }}>
          <CloseIcon sx={{ fontSize: '20px' }} />
        </IconButton>
      </Box>

      {/* Content */}
      <DialogContent sx={{ p: '24px', bgcolor: '#fafbfc', flex: 1, overflowY: 'auto' }}>
        {isLoading ? (
          <Box display="flex" justifyContent="center" alignItems="center" py={8}>
            <CircularProgress />
          </Box>
        ) : !provider ? (
          <Alert severity="error" sx={{ borderRadius: '8px' }}>Provider data could not be loaded.</Alert>
        ) : (
          <Grid container spacing={3}>
            {/* Personal Info */}
            <Grid item xs={12} sm={6}>
              <Box sx={{ bgcolor: '#fff', border: `1px solid ${COLORS.BORDER}`, borderRadius: '10px', p: 2.5 }}>
                <SectionTitle>Personal Information</SectionTitle>
                <InfoRow label="First Name" value={userId.firstName || provider.firstName} />
                <InfoRow label="Last Name" value={userId.lastName || provider.lastName} />
                <InfoRow label="Middle Name" value={userId.middleName || provider.middleName} />
                <InfoRow label="Preferred Name" value={provider.preferredName || userId.preferredName} />
                <InfoRow label="Title" value={provider.title} />
                <InfoRow label="Suffix" value={provider.suffixTitle || provider.suffix} />
                <Box sx={{ display: 'flex', gap: 1, py: 0.5, alignItems: 'center' }}>
                  <Typography sx={{ fontSize: fontSize.base, color: COLORS.TEXT_MUTED, whiteSpace: 'nowrap', flexShrink: 0 }}>
                    Color:
                  </Typography>
                  {provider.color ? (
                    <Box sx={{ width: 16, height: 16, borderRadius: '3px', backgroundColor: provider.color, border: '1px solid rgba(0,0,0,0.15)' }} />
                  ) : (
                    <Typography sx={{ fontSize: fontSize.base, color: COLORS.TEXT_PRIMARY, fontWeight: fontWeight.semibold }}>—</Typography>
                  )}
                </Box>
              </Box>
            </Grid>

            {/* Contact Info */}
            <Grid item xs={12} sm={6}>
              <Box sx={{ bgcolor: '#fff', border: `1px solid ${COLORS.BORDER}`, borderRadius: '10px', p: 2.5 }}>
                <SectionTitle>Contact Information</SectionTitle>
                <InfoRow label="Email" value={userId.email || provider.email} />
                <InfoRow label="Mobile Phone" value={provider.phone || userId.phone || provider.mobilePhone} />
                <InfoRow label="Home Phone" value={provider.homePhone || userId.homePhone} />
                <InfoRow label="Office Phone" value={provider.officePhone || provider.workPhone} />
              </Box>
            </Grid>

            {/* Professional Info */}
            <Grid item xs={12} sm={6}>
              <Box sx={{ bgcolor: '#fff', border: `1px solid ${COLORS.BORDER}`, borderRadius: '10px', p: 2.5 }}>
                <SectionTitle>Professional Information</SectionTitle>
                <InfoRow label="Provider Type" value={provider.providerType || provider.title} />
                <InfoRow label="Specialty" value={formatSpecialty(provider.specialty)} />
                <InfoRow label="Organization" value={provider.organizationName} />
                <InfoRow label="NPI Number" value={provider.npiNumber} />
                <InfoRow label="License Number" value={provider.licenseNumber} />
                <InfoRow label="Federal Tax ID" value={provider.federalTaxId || provider.taxId || provider.federalTaxNumber} />
                <InfoRow label="Additional Provider ID" value={provider.additionalProviderId} />
                <InfoRow label="Signature on File" value={provider.signatureOnFile ? 'Yes' : provider.signatureOnFile === false ? 'No' : ''} />
                <InfoRow label="Description" value={provider.description} />
              </Box>
            </Grid>

            {/* Address Info */}
            <Grid item xs={12} sm={6}>
              <Box sx={{ bgcolor: '#fff', border: `1px solid ${COLORS.BORDER}`, borderRadius: '10px', p: 2.5 }}>
                <SectionTitle>Address</SectionTitle>
                <InfoRow label="Street Address" value={addr.street || addr.address1 || provider.streetAddress} />
                <InfoRow label="Additional Address" value={addr.additionalAddress || addr.address2} />
                <InfoRow label="City" value={addr.city || provider.city} />
                <InfoRow label="State" value={addr.state || provider.state} />
                <InfoRow label="Zip Code" value={addr.zipCode || addr.zip || provider.zipCode} />
                <InfoRow label="Country" value={addr.country || provider.country} />
              </Box>
            </Grid>

            {/* Status */}
            <Grid item xs={12}>
              <Box sx={{ bgcolor: '#fff', border: `1px solid ${COLORS.BORDER}`, borderRadius: '10px', p: 2.5 }}>
                <SectionTitle>Status</SectionTitle>
                <Box sx={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                  <InfoRow label="Active" value={provider.isActive ? 'Yes' : 'No'} />
                  <InfoRow label="Provider Class" value={provider.providerClass} />
                  <InfoRow label="Provider Category" value={provider.providerCategory} />
                </Box>
              </Box>
            </Grid>
          </Grid>
        )}
      </DialogContent>

      {/* Modal Footer */}
      <Box sx={{
        height: '57px', px: '24px', flexShrink: 0,
        display: 'flex', alignItems: 'center', justifyContent: 'flex-end',
        backgroundColor: '#ffffff',
        borderTop: `1px solid ${COLORS.BORDER}`
      }}>
        <Button
          variant="outlined"
          onClick={onClose}
          sx={{
            textTransform: 'none', fontFamily: 'Inter, sans-serif', fontWeight: 600, fontSize: '13px',
            borderColor: '#cbd5e1', color: '#0f172a', borderRadius: '6px',
            px: '16px', height: '36px',
            '&:hover': { bgcolor: '#f8fafc', borderColor: '#cbd5e1' }
          }}
        >
          Close
        </Button>
      </Box>
    </Dialog>
  );
};

export default ViewProviderDialog;
