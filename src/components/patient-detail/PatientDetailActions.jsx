import { Box, Button, IconButton, Menu, MenuItem, ListItemIcon, ListItemText, Checkbox, Tooltip } from '@mui/material';
import {
  Edit as EditIcon,
  PersonOff as PersonOffIcon,
  ExpandMore as ExpandMoreIcon,
  Close as CloseIcon,
  CheckCircle as CheckCircleIcon,
  Sync as SyncIcon,
  ChatBubbleOutline as ChatIcon,
  MailOutline as MailIcon,
  PrintOutlined as PrintIcon,
  DescriptionOutlined as FileIcon,
  AccountBox as AccountBoxIcon,
} from '@mui/icons-material';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import MyChartFileDialog from './MyChartFileDialog';
import AuditPatientHistoryDialog from './AuditPatientHistoryDialog';
import PatientChat from '../shared/PatientChat';
import PatientRouteSlipDialog from '../appointments/PatientRouteSlipDialog';
import { COLORS } from '../../constants/colors';
import { radius, fontSize, fontWeight } from '../../constants/styles';

const actionButtonSx = {
  textTransform: 'none',
  fontFamily: 'Inter',
  fontWeight: fontWeight.semibold,
  fontSize: fontSize.base,
  borderRadius: radius.md,
  boxShadow: 'none',
};

const iconButtonSx = { p: 0.5, color: COLORS.TEXT_SECONDARY, '&:hover': { color: COLORS.ACCENT, backgroundColor: COLORS.ACCENT_BG } };

/**
 * Compact icon toolbar (edit + utility icons) on the left, Deactivate/Convert/
 * Request Updates on the right — matches the schedule module's icon-button
 * treatment (small, muted, accent on hover) instead of the previous large
 * dark-navy (#1a237e) icons and a separate labeled "Edit" button.
 */
export default function PatientDetailActions({
  onEdit,
  onSave,
  onCancelEdit,
  onDeactivate,
  onActivate,
  onConvertToNonPatient,
  onSendUpdateRequest,
  isActive,
  patient,
  isEditMode = false,
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
  const [myChartFileDialogOpen, setMyChartFileDialogOpen] = useState(false);
  const [auditDialogOpen, setAuditDialogOpen] = useState(false);
  const [patientChatOpen, setPatientChatOpen] = useState(false);
  const [routeSlipOpen, setRouteSlipOpen] = useState(false);
  const navigate = useNavigate();

  const handleRequestOpen = (e) => setRequestMenuAnchor(e.currentTarget);
  const handleRequestClose = () => setRequestMenuAnchor(null);
  const handleMyChartFileOpen = () => setMyChartFileDialogOpen(true);
  const handleMyChartFileClose = () => setMyChartFileDialogOpen(false);
  const handleAuditDialogOpen = () => setAuditDialogOpen(true);
  const handleAuditDialogClose = () => setAuditDialogOpen(false);
  const handlePatientChatOpen = () => setPatientChatOpen(true);
  const handlePatientChatClose = () => setPatientChatOpen(false);
  const handleRouteSlipOpen = () => setRouteSlipOpen(true);
  const handleRouteSlipClose = () => setRouteSlipOpen(false);

  const patientId = patient?._id || patient?.id;
  const patientName = patient
    ? (patient.name || `${patient.firstName || ''} ${patient.lastName || ''}`.trim() || undefined)
    : undefined;
  const handleOpenAdditionalDocs = () => {
    if (patientId) navigate(`/patients/${patientId}/additional-documents`);
  };

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
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flexWrap: 'wrap' }}>
        {isEditMode ? (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
            <Button
              variant="contained"
              size="small"
              startIcon={<CheckCircleIcon fontSize="small" />}
              onClick={onSave}
              sx={{ ...actionButtonSx, backgroundColor: COLORS.STATUS_SUCCESS, '&:hover': { backgroundColor: COLORS.STATUS_SUCCESS, opacity: 0.9 } }}
            >
              Save
            </Button>
            <Button
              variant="outlined"
              size="small"
              startIcon={<CloseIcon fontSize="small" />}
              onClick={onCancelEdit}
              sx={{ ...actionButtonSx, borderColor: COLORS.BORDER, color: COLORS.TEXT_BODY, backgroundColor: COLORS.SURFACE_CARD, '&:hover': { backgroundColor: COLORS.SURFACE_HOVER, borderColor: COLORS.TEXT_MUTED } }}
            >
              Cancel
            </Button>
          </Box>
        ) : (
          /* Icon Toolbar — Edit + small utility icons, all in one compact row */
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.25 }}>
            <Tooltip title="Edit patient details">
              <IconButton size="small" sx={iconButtonSx} onClick={onEdit}>
                <EditIcon sx={{ fontSize: 18 }} />
              </IconButton>
            </Tooltip>

            {/* Hx (History) Icon — moved the audit-log action here from the Document
                icon below, since "Hx" unambiguously means history, not documents. */}
            <Tooltip title="View patient history">
              <IconButton size="small" sx={iconButtonSx} onClick={handleAuditDialogOpen}>
                <Box sx={{ position: 'relative', display: 'inline-flex' }}>
                  <SyncIcon sx={{ fontSize: 20 }} />
                  <Box
                    sx={{
                      position: 'absolute',
                      top: '50%',
                      left: '50%',
                      transform: 'translate(-50%, -50%)',
                      fontSize: '6px',
                      fontWeight: 'bold',
                      color: COLORS.ACCENT,
                    }}
                  >
                    Hx
                  </Box>
                </Box>
              </IconButton>
            </Tooltip>

            {/* Chat Icon */}
            <Tooltip title="Messages & communication history">
              <IconButton size="small" sx={iconButtonSx} onClick={handlePatientChatOpen}>
                <ChatIcon sx={{ fontSize: 18 }} />
              </IconButton>
            </Tooltip>

            {/* Email with Check Icon — same communication hub as Chat: there's no
                separate single-email-compose feature in this app, and the hub's
                history already shows email confirmations (the checkmark this icon
                itself displays), so this opens the same dialog rather than a fake
                "resend email" action that wouldn't actually send anything. */}
            <Tooltip title="Email confirmations">
              <IconButton size="small" sx={iconButtonSx} onClick={handlePatientChatOpen}>
                <Box sx={{ position: 'relative' }}>
                  <MailIcon sx={{ fontSize: 18 }} />
                  <CheckCircleIcon
                    sx={{
                      position: 'absolute',
                      bottom: -2,
                      right: -2,
                      fontSize: 10,
                      fontWeight: 'bold',
                      color: 'inherit',
                    }}
                  />
                </Box>
              </IconButton>
            </Tooltip>

            {/* Print Icon */}
            <Tooltip title="Print route slip">
              <IconButton size="small" sx={iconButtonSx} onClick={handleRouteSlipOpen}>
                <PrintIcon sx={{ fontSize: 18 }} />
              </IconButton>
            </Tooltip>

            {/* Document/File Icon — now points at the "Additional Docs" tab (same
                route PatientSectionTabs.jsx uses) instead of the history dialog. */}
            <Tooltip title="Additional documents">
              <IconButton size="small" sx={iconButtonSx} onClick={handleOpenAdditionalDocs}>
                <FileIcon sx={{ fontSize: 18 }} />
              </IconButton>
            </Tooltip>

            {/* Profile/User Icon */}
            <Tooltip title="MyChart profile">
              <IconButton size="small" sx={iconButtonSx} onClick={handleMyChartFileOpen}>
                <AccountBoxIcon sx={{ fontSize: 20 }} />
              </IconButton>
            </Tooltip>
          </Box>
        )}

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          {isActive ? (
            <Button
              variant="contained"
              size="small"
              startIcon={<PersonOffIcon fontSize="small" />}
              onClick={onDeactivate}
              sx={{ ...actionButtonSx, backgroundColor: COLORS.STATUS_ERROR, '&:hover': { backgroundColor: COLORS.STATUS_ERROR, opacity: 0.9 } }}
            >
              Deactivate
            </Button>
          ) : (
            <Button
              variant="contained"
              size="small"
              startIcon={<CheckCircleIcon fontSize="small" />}
              onClick={onActivate}
              sx={{ ...actionButtonSx, backgroundColor: COLORS.STATUS_SUCCESS, '&:hover': { backgroundColor: COLORS.STATUS_SUCCESS, opacity: 0.9 } }}
            >
              Activate
            </Button>
          )}
          <Button
            variant="contained"
            size="small"
            onClick={onConvertToNonPatient}
            sx={{ ...actionButtonSx, backgroundColor: COLORS.ACCENT, '&:hover': { backgroundColor: COLORS.ACCENT_HOVER } }}
          >
            Convert
          </Button>
          <Button
            variant="outlined"
            size="small"
            endIcon={<ExpandMoreIcon />}
            onClick={handleRequestOpen}
            sx={{ ...actionButtonSx, borderColor: COLORS.BORDER, color: COLORS.TEXT_BODY, backgroundColor: COLORS.SURFACE_CARD, '&:hover': { backgroundColor: COLORS.SURFACE_HOVER, borderColor: COLORS.TEXT_MUTED } }}
          >
            Request updates
          </Button>
        </Box>
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
      
      {/* MyChart File Dialog */}
      <MyChartFileDialog 
        open={myChartFileDialogOpen} 
        onClose={handleMyChartFileClose}
        patient={patient}
      />
      
      {/* Audit Patient History Dialog */}
      <AuditPatientHistoryDialog
        open={auditDialogOpen}
        onClose={handleAuditDialogClose}
      />

      {/* Patient Chat — communication hub, shared by both the Chat and Mail icons */}
      <PatientChat
        open={patientChatOpen}
        onClose={handlePatientChatClose}
        patientName={patientName}
      />

      {/* Route Slip — reuses the same printable dialog OperatorySidebar.jsx opens */}
      <PatientRouteSlipDialog
        open={routeSlipOpen}
        onClose={handleRouteSlipClose}
        patient={patient}
        patientDetails={patient}
      />
    </>
  );
}
