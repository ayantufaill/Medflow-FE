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
import RouteSlipDialog from '../appointments/schedule/route-slip-modal/RouteSlipDialog';
import { useScheduleState } from '../../hooks/redux';
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
  onRequestUpdatesClick,
  isActive,
  patient,
  isEditMode = false,
}) {
  const [myChartFileDialogOpen, setMyChartFileDialogOpen] = useState(false);
  const [auditDialogOpen, setAuditDialogOpen] = useState(false);
  const [patientChatOpen, setPatientChatOpen] = useState(false);
  const { setRouteSlipDialogOpen } = useScheduleState();
  const navigate = useNavigate();

  const handleMyChartFileOpen = () => setMyChartFileDialogOpen(true);
  const handleMyChartFileClose = () => setMyChartFileDialogOpen(false);
  const handleAuditDialogOpen = () => setAuditDialogOpen(true);
  const handleAuditDialogClose = () => setAuditDialogOpen(false);
  const handlePatientChatOpen = () => setPatientChatOpen(true);
  const handlePatientChatClose = () => setPatientChatOpen(false);

  const patientId = patient?._id || patient?.id;
  const patientName = patient
    ? (patient.name || `${patient.firstName || ''} ${patient.lastName || ''}`.trim() || undefined)
    : undefined;
  const handleOpenAdditionalDocs = () => {
    if (patientId) navigate(`/patients/${patientId}/additional-documents`);
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

            {/* Hx (Communication) Icon — opens patient communication/chat */}
            <Tooltip title="Patient communication">
              <IconButton size="small" sx={iconButtonSx} onClick={handlePatientChatOpen}>
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
              <IconButton size="small" sx={iconButtonSx} onClick={() => setRouteSlipDialogOpen(true)}>
                <PrintIcon sx={{ fontSize: 18 }} />
              </IconButton>
            </Tooltip>

            {/* Document/File Icon — opens patient history audit dialog */}
            <Tooltip title="View patient history">
              <IconButton size="small" sx={iconButtonSx} onClick={handleAuditDialogOpen}>
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
            onClick={onRequestUpdatesClick}
            sx={{ ...actionButtonSx, borderColor: COLORS.BORDER, color: COLORS.TEXT_BODY, backgroundColor: COLORS.SURFACE_CARD, '&:hover': { backgroundColor: COLORS.SURFACE_HOVER, borderColor: COLORS.TEXT_MUTED } }}
          >
            Request updates
          </Button>
        </Box>
      </Box>
      
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

      {/* Route Slip — uses the new modernized RouteSlipDialog that handles its own Redux state */}
      <RouteSlipDialog />
    </>
  );
}
