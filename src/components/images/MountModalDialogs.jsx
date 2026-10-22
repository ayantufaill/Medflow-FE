import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  TextField,
  Typography,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import DeviceHubIcon from "@mui/icons-material/DeviceHub";
import { COLORS } from "../../constants/colors";
import { radius, fontSize, fontWeight, standardFieldSx } from "../../constants/styles";
import { actionButtonSx } from "./imagesConstants";

export const EditMountDialog = ({ open, onClose, activeMount, mountName, onMountNameChange, onSave }) => (
  <Dialog
    open={open}
    onClose={onClose}
    fullWidth
    maxWidth="sm"
    sx={{ zIndex: 9999 }}
    PaperProps={{
      sx: { borderRadius: radius.lg, overflow: "hidden" },
    }}
  >
    <DialogTitle
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        backgroundColor: COLORS.SURFACE_TINT,
        borderBottom: `1px solid ${COLORS.BORDER}`,
        fontFamily: "Inter",
        fontSize: fontSize.md,
        fontWeight: fontWeight.bold,
        color: COLORS.TEXT_PRIMARY,
        py: 1.5,
        px: 2.5,
      }}
    >
      Edit Mount: {activeMount?.name}
      <IconButton size="small" onClick={onClose} sx={{ color: COLORS.TEXT_MUTED }}>
        <CloseIcon fontSize="small" />
      </IconButton>
    </DialogTitle>
    <DialogContent sx={{ p: 2.5, backgroundColor: COLORS.SURFACE_CARD }}>
      <Typography
        variant="subtitle2"
        sx={{ fontFamily: "Inter", fontWeight: fontWeight.semibold, color: COLORS.TEXT_PRIMARY, mb: 1 }}
      >
        Mount Name
      </Typography>
      <TextField
        fullWidth
        size="small"
        placeholder="e.g. 4 BW, Full Mouth Series..."
        value={mountName}
        onChange={(e) => onMountNameChange(e.target.value)}
        sx={{ ...standardFieldSx, mb: 2.5 }}
      />
    </DialogContent>
    <DialogActions
      sx={{
        px: 2.5,
        py: 1.5,
        borderTop: `1px solid ${COLORS.BORDER}`,
        backgroundColor: COLORS.SURFACE_FOOTER,
        gap: 1,
      }}
    >
      <Button
        onClick={onClose}
        sx={{
          textTransform: "none",
          borderRadius: radius.md,
          fontFamily: "Inter",
          fontSize: fontSize.base,
          color: COLORS.TEXT_SECONDARY,
        }}
      >
        Cancel
      </Button>
      <Button
        variant="contained"
        disableElevation
        onClick={onSave}
        sx={{
          ...actionButtonSx,
          backgroundColor: COLORS.ACCENT,
          "&:hover": { backgroundColor: COLORS.ACCENT_HOVER },
        }}
      >
        Save Changes
      </Button>
    </DialogActions>
  </Dialog>
);

export const TransferMountDialog = ({
  open,
  onClose,
  activeMount,
  destinationPatientId,
  onDestinationPatientIdChange,
  onTransfer,
}) => (
  <Dialog
    open={open}
    onClose={onClose}
    fullWidth
    maxWidth="xs"
    sx={{ zIndex: 9999 }}
    PaperProps={{
      sx: { borderRadius: radius.lg, overflow: "hidden" },
    }}
  >
    <DialogTitle
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        backgroundColor: COLORS.SURFACE_TINT,
        borderBottom: `1px solid ${COLORS.BORDER}`,
        fontFamily: "Inter",
        fontSize: fontSize.md,
        fontWeight: fontWeight.bold,
        color: COLORS.TEXT_PRIMARY,
        py: 1.5,
        px: 2.5,
      }}
    >
      Transfer Mount
      <IconButton size="small" onClick={onClose} sx={{ color: COLORS.TEXT_MUTED }}>
        <CloseIcon fontSize="small" />
      </IconButton>
    </DialogTitle>
    <DialogContent sx={{ p: 2.5, backgroundColor: COLORS.SURFACE_CARD }}>
      <Typography sx={{ fontFamily: "Inter", fontSize: fontSize.base, color: COLORS.TEXT_SECONDARY, mb: 2 }}>
        Transfer “{activeMount?.name}” to another patient.
      </Typography>
      <Typography
        variant="subtitle2"
        sx={{ fontFamily: "Inter", fontWeight: fontWeight.semibold, color: COLORS.TEXT_PRIMARY, mb: 1 }}
      >
        Destination Patient ID
      </Typography>
      <TextField
        fullWidth
        size="small"
        placeholder="Enter Patient ID"
        value={destinationPatientId}
        onChange={(e) => onDestinationPatientIdChange(e.target.value)}
        sx={standardFieldSx}
      />
    </DialogContent>
    <DialogActions
      sx={{
        px: 2.5,
        py: 1.5,
        borderTop: `1px solid ${COLORS.BORDER}`,
        backgroundColor: COLORS.SURFACE_FOOTER,
        gap: 1,
      }}
    >
      <Button
        onClick={onClose}
        sx={{
          textTransform: "none",
          borderRadius: radius.md,
          fontFamily: "Inter",
          fontSize: fontSize.base,
          color: COLORS.TEXT_SECONDARY,
        }}
      >
        Cancel
      </Button>
      <Button
        variant="contained"
        disableElevation
        disabled={!destinationPatientId.trim()}
        onClick={onTransfer}
        sx={{
          ...actionButtonSx,
          backgroundColor: COLORS.ACCENT,
          "&:hover": { backgroundColor: COLORS.ACCENT_HOVER },
        }}
      >
        Transfer
      </Button>
    </DialogActions>
  </Dialog>
);

export const ImagingSettingsDialog = ({ open, onClose }) => (
  <Dialog
    open={open}
    onClose={onClose}
    fullWidth
    maxWidth="sm"
    sx={{ zIndex: 9999 }}
    PaperProps={{
      sx: { borderRadius: radius.lg, overflow: "hidden" },
    }}
  >
    <DialogTitle
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        backgroundColor: COLORS.SURFACE_TINT,
        borderBottom: `1px solid ${COLORS.BORDER}`,
        fontFamily: "Inter",
        fontSize: fontSize.md,
        fontWeight: fontWeight.bold,
        color: COLORS.TEXT_PRIMARY,
        py: 1.5,
        px: 2.5,
      }}
    >
      Imaging Settings
      <IconButton size="small" onClick={onClose} sx={{ color: COLORS.TEXT_MUTED }}>
        <CloseIcon fontSize="small" />
      </IconButton>
    </DialogTitle>
    <DialogContent sx={{ p: 3, backgroundColor: COLORS.SURFACE_CARD }}>
      <Box sx={{ textAlign: "center", py: 2 }}>
        <DeviceHubIcon sx={{ fontSize: 48, color: COLORS.TEXT_MUTED, mb: 1.5 }} />
        <Typography sx={{ fontFamily: "Inter", fontSize: fontSize.md, fontWeight: fontWeight.semibold, color: COLORS.TEXT_PRIMARY, mb: 0.5 }}>
          Hardware & Device Configuration
        </Typography>
        <Typography sx={{ fontFamily: "Inter", fontSize: fontSize.base, color: COLORS.TEXT_SECONDARY, maxWidth: 380, mx: "auto" }}>
          No local imaging sensors or panoramic X-ray capture devices are currently connected. Connect a supported TWAIN or direct USB imaging bridge to configure automatic mount capturing.
        </Typography>
      </Box>
    </DialogContent>
    <DialogActions
      sx={{
        px: 2.5,
        py: 1.5,
        borderTop: `1px solid ${COLORS.BORDER}`,
        backgroundColor: COLORS.SURFACE_FOOTER,
      }}
    >
      <Button
        variant="contained"
        disableElevation
        onClick={onClose}
        sx={{
          ...actionButtonSx,
          backgroundColor: COLORS.ACCENT,
          "&:hover": { backgroundColor: COLORS.ACCENT_HOVER },
        }}
      >
        Done
      </Button>
    </DialogActions>
  </Dialog>
);
