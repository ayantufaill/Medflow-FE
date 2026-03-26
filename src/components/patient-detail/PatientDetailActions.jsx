import { Box, Button, IconButton, Menu, MenuItem, ListItemIcon, ListItemText, Checkbox } from '@mui/material';
import {
  Edit as EditIcon,
  PersonOff as PersonOffIcon,
  ExpandMore as ExpandMoreIcon,
  Close as CloseIcon,
  CheckCircle as CheckCircleIcon,
} from '@mui/icons-material';
import { useState } from 'react';

/**
 * Screenshot: Edit (white, pencil, light gray text), then 5 small utility icons (refresh, document, envelope, printer, person+), then Deactivate (red), Convert (blue), Request Patient Updates.
 * Modal: dark blue header; Close = light gray background, dark gray text.
 */
export default function PatientDetailActions({
  onEdit,
  onDeactivate,
  onActivate,
  onConvertToNonPatient,
  onSendUpdateRequest,
  isActive,
}) {
  const [requestMenuAnchor, setRequestMenuAnchor] = useState(null);
  const [requestChecks, setRequestChecks] = useState({
    dentalHistory: false,
    medicalHistory: true,
    hipaa: false,
    confidential: true,
    tdsFinancial: true,
    hipaa2026: false,
  });

  const handleRequestOpen = (e) => setRequestMenuAnchor(e.currentTarget);
  const handleRequestClose = () => setRequestMenuAnchor(null);

  const toggleRequest = (key) => {
    setRequestChecks((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSendRequest = async () => {
    const sectionMap = {
      dentalHistory: 'dental-history',
      medicalHistory: 'medical-history',
      hipaa: 'hipaa',
      confidential: 'consent',
      tdsFinancial: 'custom-form',
      hipaa2026: 'custom-form',
    };

    const sections = Object.entries(requestChecks)
      .filter(([, checked]) => checked)
      .map(([key]) => sectionMap[key])
      .filter(Boolean);

    if (!sections.length || !onSendUpdateRequest) {
      handleRequestClose();
      return;
    }

    await onSendUpdateRequest(sections);
    handleRequestClose();
  };

  return (
    <>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, flexWrap: 'wrap' }}>
        <Button
          variant="outlined"
          size="small"
          startIcon={<EditIcon fontSize="small" />}
          onClick={onEdit}
          sx={{
            textTransform: 'none',
            fontWeight: 600,
            borderRadius: 1.5,
            borderColor: 'grey.300',
            color: 'grey.700',
            bgcolor: 'white',
          }}
        >
          Edit
        </Button>
        {isActive ? (
          <Button
            variant="contained"
            color="error"
            size="small"
            startIcon={<PersonOffIcon />}
            onClick={onDeactivate}
            sx={{ textTransform: 'none', fontWeight: 600, borderRadius: 1.5 }}
          >
            Deactivate Patient
          </Button>
        ) : (
          <Button
            variant="contained"
            size="small"
            startIcon={<CheckCircleIcon />}
            onClick={onActivate}
            sx={{ 
              textTransform: 'none', 
              fontWeight: 600, 
              borderRadius: 1.5,
              bgcolor: '#43a047',
              '&:hover': { bgcolor: '#388e3c' },
            }}
          >
            Activate Patient
          </Button>
        )}
        <Button
          variant="contained"
          size="small"
          color="primary"
          onClick={onConvertToNonPatient}
          sx={{ textTransform: 'none', fontWeight: 600, borderRadius: 1.5 }}
        >
          Convert To Non-Patient
        </Button>
        <Button
          variant="outlined"
          size="small"
          endIcon={<ExpandMoreIcon />}
          onClick={handleRequestOpen}
          sx={{
            textTransform: 'none',
            fontWeight: 600,
            borderRadius: 1.5,
            borderColor: 'grey.300',
            color: 'grey.700',
            bgcolor: 'white',
          }}
        >
          Request Patient Updates
        </Button>
      </Box>

      <Menu
        anchorEl={requestMenuAnchor}
        open={Boolean(requestMenuAnchor)}
        onClose={handleRequestClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        PaperProps={{
          sx: {
            minWidth: 360,
            borderRadius: 1.5,
            boxShadow: '0 4px 24px rgba(0,0,0,0.15)',
            overflow: 'hidden',
          },
        }}
      >
        <MenuItem
          dense
          disabled
          sx={{
            bgcolor: 'primary.main',
            color: 'white',
            fontWeight: 700,
            fontSize: '0.875rem',
            py: 1.25,
            opacity: 1,
          }}
        >
          Request Patient Updates
        </MenuItem>
        {[
          { key: 'dentalHistory', label: 'Dental History', sent: '1/22/2026' },
          { key: 'medicalHistory', label: 'Medical History', sent: '1/22/2026' },
          { key: 'hipaa', label: 'HIPAA', sent: '1/22/2026' },
          { key: 'confidential', label: 'Confidential', sent: '1/22/2026' },
        ].map(({ key, label, sent }) => (
          <MenuItem key={key} dense onClick={() => toggleRequest(key)} sx={{ py: 0.75 }}>
            <ListItemIcon sx={{ minWidth: 40 }}>
              <Checkbox checked={requestChecks[key]} size="small" disableRipple />
            </ListItemIcon>
            <ListItemText
              primary={label}
              secondary={`(Sent ${sent})`}
              primaryTypographyProps={{ fontSize: '0.8rem' }}
              secondaryTypographyProps={{ color: 'grey.600', fontSize: '0.8rem' }}
            />
          </MenuItem>
        ))}
        <MenuItem dense sx={{ borderTop: 1, borderColor: 'divider', mt: 0.5, pt: 1 }}>
          <ListItemText primary="Custom Forms" primaryTypographyProps={{ fontWeight: 700, fontSize: '0.8rem', color: 'grey.800' }} />
        </MenuItem>
        <MenuItem dense onClick={() => toggleRequest('tdsFinancial')} sx={{ py: 0.75 }}>
          <ListItemIcon sx={{ minWidth: 40 }}>
            <Checkbox checked={requestChecks.tdsFinancial} size="small" disableRipple />
          </ListItemIcon>
          <ListItemText primary="TDS Financial Agreement" primaryTypographyProps={{ fontSize: '0.8rem' }} />
        </MenuItem>
        <MenuItem dense onClick={() => toggleRequest('hipaa2026')} sx={{ py: 0.75 }}>
          <ListItemIcon sx={{ minWidth: 40 }}>
            <Checkbox checked={requestChecks.hipaa2026} size="small" disableRipple />
          </ListItemIcon>
          <ListItemText primary="HIPAA 2026" primaryTypographyProps={{ fontSize: '0.8rem' }} />
        </MenuItem>
        <Box sx={{ display: 'flex', gap: 1, p: 1.5, flexWrap: 'wrap', borderTop: 1, borderColor: 'divider' }}>
          <Button
            variant="contained"
            size="small"
            endIcon={<ExpandMoreIcon sx={{ fontSize: 18 }} />}
            onClick={handleSendRequest}
            sx={{
              bgcolor: '#ed6c02',
              color: 'white',
              textTransform: 'none',
              fontWeight: 600,
              borderRadius: 1.5,
              '&:hover': { bgcolor: '#e65100' },
            }}
          >
            Send Request
          </Button>
          <Button
            variant="contained"
            size="small"
            startIcon={<CloseIcon />}
            onClick={handleRequestClose}
            sx={{
              textTransform: 'none',
              borderRadius: 1.5,
              bgcolor: 'grey.600',
              color: 'white',
              '&:hover': { bgcolor: 'grey.700' },
            }}
          >
            Close
          </Button>
        </Box>
      </Menu>
    </>
  );
}
