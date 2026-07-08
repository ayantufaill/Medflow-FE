import {
  Box,
  Button,
  IconButton,
  Dialog,
  DialogContent,
  DialogActions,
  DialogTitle,
  Checkbox,
  Typography,
  Divider,
} from "@mui/material";
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
  Check as CheckIcon,
  SwapHoriz as ConvertIcon,
  CheckCircleOutline as ActiveIcon
} from "@mui/icons-material";
import { useState } from "react";
import MyChartFileDialog from "./MyChartFileDialog";
import AuditPatientHistoryDialog from "./AuditPatientHistoryDialog";

const buttonSx = {
  textTransform: "none",
  fontWeight: 700,
  fontSize: "0.75rem",
  borderRadius: 1.5,
  px: 2,
  py: 1,
  height: 38,
  boxShadow: "none",
  "&:hover": {
    boxShadow: "none"
  }
};

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
  const [requestDialogOpen, setRequestDialogOpen] = useState(false);
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

  const handleRequestClose = () => setRequestDialogOpen(false);
  const handleMyChartFileOpen = () => setMyChartFileDialogOpen(true);
  const handleMyChartFileClose = () => setMyChartFileDialogOpen(false);
  const handleAuditDialogOpen = () => setAuditDialogOpen(true);
  const handleAuditDialogClose = () => setAuditDialogOpen(false);

  const toggleRequest = (key) => {
    setRequestChecks((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSendRequest = async () => {
    const sectionMap = {
      dentalHistory: "dental-history",
      medicalHistory: "medical-history",
      hipaa: "hipaa",
      confidential: "consent",
      tdsFinancial: "custom-form",
      hipaa2026: "custom-form",
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
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 1.5,
          flexWrap: "wrap",
          justifyContent: "flex-end",
        }}
      >
        {/* Outlined Action Icons Toolbar Group */}
        <Box 
          sx={{ 
            display: "flex", 
            alignItems: "center", 
            gap: 0.25, 
            border: "1px solid #e2e8f0", 
            borderRadius: "6px", 
            p: "3px", 
            bgcolor: "#ffffff" 
          }}
        >
          {isEditMode ? (
            <>
              <IconButton size="small" onClick={onSave} sx={{ color: "#16a34a" }} title="Save">
                <CheckIcon sx={{ fontSize: 18 }} />
              </IconButton>
              <IconButton size="small" onClick={onCancelEdit} sx={{ color: "#dc2626" }} title="Cancel">
                <CloseIcon sx={{ fontSize: 18 }} />
              </IconButton>
            </>
          ) : (
            <IconButton size="small" onClick={onEdit} sx={{ color: "#475569" }} title="Edit">
              <EditIcon sx={{ fontSize: 18 }} />
            </IconButton>
          )}

          <Divider orientation="vertical" flexItem sx={{ mx: 0.5, my: 0.5 }} />

          <IconButton size="small" sx={{ color: "#475569" }} title="History Sync">
            <Box sx={{ position: "relative", display: "inline-flex" }}>
              <SyncIcon sx={{ fontSize: 18 }} />
              <Box
                sx={{
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                  fontSize: "5px",
                  fontWeight: "bold",
                  color: "#4db6ac",
                }}
              >
                Hx
              </Box>
            </Box>
          </IconButton>

          <IconButton size="small" sx={{ color: "#475569" }} title="Chat">
            <ChatIcon sx={{ fontSize: 18 }} />
          </IconButton>

          <IconButton size="small" sx={{ color: "#475569" }} title="Email">
            <Box sx={{ position: "relative", display: "inline-flex" }}>
              <MailIcon sx={{ fontSize: 18 }} />
              <CheckCircleIcon
                sx={{
                  position: "absolute",
                  bottom: -1,
                  right: -1,
                  fontSize: 8,
                  color: "#1e3a8a",
                }}
              />
            </Box>
          </IconButton>

          <IconButton size="small" sx={{ color: "#475569" }} title="Print">
            <PrintIcon sx={{ fontSize: 18 }} />
          </IconButton>

          <IconButton
            size="small"
            sx={{ color: "#475569" }}
            onClick={handleAuditDialogOpen}
            title="Audit History"
          >
            <FileIcon sx={{ fontSize: 18 }} />
          </IconButton>

          <IconButton
            size="small"
            sx={{ color: "#475569" }}
            onClick={handleMyChartFileOpen}
            title="MyChart Files"
          >
            <AccountBoxIcon sx={{ fontSize: 18 }} />
          </IconButton>
        </Box>

        {/* Deactivate Button */}
        {isActive ? (
          <Button
            variant="contained"
            size="small"
            startIcon={<PersonOffIcon sx={{ fontSize: 16 }} />}
            onClick={onDeactivate}
            sx={{ 
              ...buttonSx,
              bgcolor: "#ef4444", 
              color: "#ffffff",
              "&:hover": { bgcolor: "#dc2626" }
            }}
          >
            Deactivate
          </Button>
        ) : (
          <Button
            variant="contained"
            size="small"
            startIcon={<ActiveIcon sx={{ fontSize: 16 }} />}
            onClick={onActivate}
            sx={{ 
              ...buttonSx,
              bgcolor: "#22c55e", 
              color: "#ffffff",
              "&:hover": { bgcolor: "#16a34a" }
            }}
          >
            Activate
          </Button>
        )}

        {/* Convert Button */}
        <Button
          variant="contained"
          size="small"
          startIcon={<ConvertIcon sx={{ fontSize: 16 }} />}
          onClick={onConvertToNonPatient}
          sx={{ 
            ...buttonSx,
            bgcolor: "#3b82f6", 
            color: "#ffffff",
            "&:hover": { bgcolor: "#2563eb" }
          }}
        >
          Convert
        </Button>

        {/* Request Updates Dropdown Button */}
        <Button
          variant="outlined"
          size="small"
          endIcon={<ExpandMoreIcon sx={{ fontSize: 16 }} />}
          onClick={() => setRequestDialogOpen(true)}
          sx={{ 
            ...buttonSx,
            bgcolor: "#ffffff", 
            color: "#1e293b",
            borderColor: "#cbd5e1",
            "&:hover": { 
              bgcolor: "#f8fafc",
              borderColor: "#cbd5e1"
            }
          }}
        >
          Request updates
        </Button>
      </Box>

      {/* Request Updates Dialog */}
      <Dialog
        open={requestDialogOpen}
        onClose={handleRequestClose}
        maxWidth="sm"
        fullWidth
        PaperProps={{ sx: { borderRadius: 2, overflow: "hidden" } }}
      >
        <DialogTitle
          sx={{ bgcolor: "#163b6b", color: "white", py: 1.25, fontWeight: 700 }}
        >
          Request Patient Updates
        </DialogTitle>
        <DialogContent sx={{ px: 2, py: 1.5 }}>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 1.5 }}>
            Select the items to request from the patient.
          </Typography>
          {[
            {
              key: "dentalHistory",
              label: "Dental History",
              sent: "1/22/2026",
            },
            {
              key: "medicalHistory",
              label: "Medical History",
              sent: "1/22/2026",
            },
            { key: "hipaa", label: "HIPAA", sent: "1/22/2026" },
            { key: "confidential", label: "Confidential", sent: "1/22/2026" },
          ].map(({ key, label, sent }) => (
            <Box
              key={key}
              sx={{ display: "flex", alignItems: "center", py: 0.6, cursor: "pointer" }}
              onClick={() => toggleRequest(key)}
            >
              <Checkbox
                checked={requestChecks[key]}
                size="small"
                disableRipple
              />
              <Box>
                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                  {label}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  (Sent {sent})
                </Typography>
              </Box>
            </Box>
          ))}
          <Divider sx={{ my: 1 }} />
          <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 0.75 }}>
            Custom Forms
          </Typography>
          <Box
            sx={{ display: "flex", alignItems: "center", py: 0.4, cursor: "pointer" }}
            onClick={() => toggleRequest("tdsFinancial")}
          >
            <Checkbox
              checked={requestChecks.tdsFinancial}
              size="small"
              disableRipple
            />
            <Typography variant="body2">TDS Financial Agreement</Typography>
          </Box>
          <Box
            sx={{ display: "flex", alignItems: "center", py: 0.4, cursor: "pointer" }}
            onClick={() => toggleRequest("hipaa2026")}
          >
            <Checkbox
              checked={requestChecks.hipaa2026}
              size="small"
              disableRipple
            />
            <Typography variant="body2">HIPAA 2026</Typography>
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 2, pb: 2, justifyContent: "flex-start" }}>
          <Button
            variant="contained"
            size="small"
            endIcon={<ExpandMoreIcon />}
            onClick={handleSendRequest}
            sx={{
              bgcolor: "#ed6c02",
              color: "white",
              "&:hover": { bgcolor: "#d95d00" },
              textTransform: "none",
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
              bgcolor: "grey.600",
              color: "white",
              "&:hover": { bgcolor: "grey.700" },
              textTransform: "none",
            }}
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>

      <MyChartFileDialog
        open={myChartFileDialogOpen}
        onClose={handleMyChartFileClose}
        patient={patient}
      />
      <AuditPatientHistoryDialog
        open={auditDialogOpen}
        onClose={handleAuditDialogClose}
      />
    </>
  );
}
