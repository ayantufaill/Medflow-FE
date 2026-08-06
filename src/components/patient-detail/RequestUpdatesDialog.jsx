import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogActions,
  Typography,
  IconButton,
  Checkbox,
  Box,
  Button,
  Popover,
} from "@mui/material";
import {
  Send as SendIcon,
  Close as CloseIcon,
  Update as UpdateIcon,
} from "@mui/icons-material";
import { COLORS } from "../../constants/colors";
import { radius, fontSize, fontWeight } from "../../constants/styles";

export default function RequestUpdatesDialog({
  open,
  anchorEl,
  onClose,
  onSend,
}) {
  const [requestChecks, setRequestChecks] = useState({
    dentalHistory: false,
    medicalHistory: true,
    hipaa: false,
    confidential: true,
    tdsFinancial: true,
    hipaa2026: false,
  });

  const isPopover = Boolean(anchorEl);
  const isOpen = open || isPopover;

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

    if (!sections.length || !onSend) {
      onClose();
      return;
    }

    await onSend(sections);
    onClose();
  };

  const content = (
    <Box sx={{ width: isPopover ? "100%" : "auto" }}>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          px: 2.5,
          py: 1.5,
          backgroundColor: COLORS.SURFACE_TINT,
          borderBottom: `1px solid ${COLORS.BORDER}`,
          borderTopLeftRadius: radius.lg,
          borderTopRightRadius: radius.lg,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1, flex: 1 }}>
          <UpdateIcon sx={{ fontSize: "20px", color: COLORS.ACCENT }} />
          <Typography
            sx={{
              fontSize: "15px",
              fontWeight: 600,
              color: COLORS.TEXT_PRIMARY,
            }}
          >
            Request Patient Updates
          </Typography>
        </Box>
        <IconButton
          onClick={onClose}
          size="small"
          sx={{ color: COLORS.TEXT_SECONDARY }}
        >
          <CloseIcon sx={{ fontSize: "18px" }} />
        </IconButton>
      </Box>

      <DialogContent sx={{ p: 0 }}>
        <Box sx={{ display: "flex", flexDirection: "column", py: 1 }}>
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
              onClick={() => toggleRequest(key)}
              sx={{
                display: "flex",
                alignItems: "center",
                px: 3,
                py: 1,
                cursor: "pointer",
                "&:hover": { backgroundColor: COLORS.SURFACE_HOVER },
              }}
            >
              <Checkbox
                checked={requestChecks[key]}
                size="small"
                disableRipple
                sx={{
                  p: 0,
                  mr: 2,
                  color: COLORS.BORDER,
                  "&.Mui-checked": { color: COLORS.ACCENT },
                }}
              />
              <Box sx={{ flex: 1 }}>
                <Typography
                  sx={{
                    fontSize: "14px",
                    color: COLORS.TEXT_PRIMARY,
                    fontWeight: 500,
                  }}
                >
                  {label}
                </Typography>
              </Box>
              <Typography sx={{ fontSize: "12px", color: COLORS.TEXT_MUTED }}>
                (Sent {sent})
              </Typography>
            </Box>
          ))}

          <Box
            sx={{
              px: 3,
              py: 1.5,
              mt: 1,
              backgroundColor: COLORS.SURFACE_TINT,
              borderTop: `1px solid ${COLORS.BORDER}`,
              borderBottom: `1px solid ${COLORS.BORDER}`,
            }}
          >
            <Typography
              sx={{
                fontSize: "13px",
                fontWeight: 600,
                color: COLORS.TEXT_SECONDARY,
                textTransform: "uppercase",
                letterSpacing: "0.5px",
              }}
            >
              Custom Forms
            </Typography>
          </Box>

          <Box sx={{ pt: 1 }}>
            {[
              { key: "tdsFinancial", label: "TDS Financial Agreement" },
              { key: "hipaa2026", label: "HIPAA 2026" },
            ].map(({ key, label }) => (
              <Box
                key={key}
                onClick={() => toggleRequest(key)}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  px: 3,
                  py: 1,
                  cursor: "pointer",
                  "&:hover": { backgroundColor: COLORS.SURFACE_HOVER },
                }}
              >
                <Checkbox
                  checked={requestChecks[key]}
                  size="small"
                  disableRipple
                  sx={{
                    p: 0,
                    mr: 2,
                    color: COLORS.BORDER,
                    "&.Mui-checked": { color: COLORS.ACCENT },
                  }}
                />
                <Typography
                  sx={{
                    fontSize: "14px",
                    color: COLORS.TEXT_PRIMARY,
                    fontWeight: 500,
                  }}
                >
                  {label}
                </Typography>
              </Box>
            ))}
          </Box>
        </Box>
      </DialogContent>

      <DialogActions
        sx={{
          p: 2,
          borderTop: `1px solid ${COLORS.BORDER}`,
          backgroundColor: COLORS.SURFACE_CARD,
          borderBottomLeftRadius: radius.lg,
          borderBottomRightRadius: radius.lg,
          gap: 1,
        }}
      >
        <Button
          onClick={onClose}
          sx={{
            textTransform: "none",
            color: COLORS.TEXT_SECONDARY,
            fontWeight: 500,
            "&:hover": { backgroundColor: COLORS.SURFACE_HOVER },
          }}
        >
          Cancel
        </Button>
        <Button
          variant="contained"
          onClick={handleSendRequest}
          startIcon={<SendIcon sx={{ fontSize: "16px" }} />}
          sx={{
            textTransform: "none",
            backgroundColor: COLORS.ACCENT,
            fontWeight: 600,
            boxShadow: "none",
            borderRadius: radius.md,
            px: 2.5,
            "&:hover": {
              backgroundColor: COLORS.ACCENT_HOVER,
              boxShadow: "none",
            },
          }}
        >
          Send Request
        </Button>
      </DialogActions>
    </Box>
  );

  if (isPopover) {
    return (
      <Popover
        open={isOpen}
        anchorEl={anchorEl}
        onClose={onClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "left" }}
        sx={{ zIndex: 27000 }}
        slotProps={{
          paper: {
            sx: {
              mt: 1,
              borderRadius: radius.lg,
              overflow: "hidden",
              width: "450px",
              maxWidth: "92vw",
              boxShadow: "0 12px 32px rgba(0, 0, 0, 0.16)",
            },
          },
        }}
      >
        {content}
      </Popover>
    );
  }

  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      sx={{ zIndex: 27000 }}
      PaperProps={{
        sx: { width: "450px", maxWidth: "92vw", borderRadius: radius.lg, p: 0 },
      }}
    >
      {content}
    </Dialog>
  );
}
