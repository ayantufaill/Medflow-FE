import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Typography,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CollectionsIcon from "@mui/icons-material/Collections";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { COLORS } from "../../constants/colors";
import { actionButtonSx } from "./imagesConstants";

const MountPreviewSlot = ({ imageSrc, index, aspectRatio = "4/3", label }) => (
  <Box
    sx={{
      backgroundColor: "#05070a",
      borderRadius: "6px",
      border: "1.5px solid #1e293b",
      overflow: "hidden",
      position: "relative",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      aspectRatio,
      boxShadow: "inset 0 0 10px rgba(0,0,0,0.6)",
    }}
  >
    {imageSrc ? (
      <Box
        component="img"
        src={imageSrc}
        alt={`X-Ray ${index + 1}`}
        sx={{
          width: "100%",
          height: "100%",
          objectFit: "contain",
          backgroundColor: "#000",
        }}
      />
    ) : (
      <Box sx={{ textAlign: "center", p: 1, opacity: 0.35 }}>
        <Typography sx={{ fontFamily: "Inter", fontSize: "11px", color: "#94a3b8", fontWeight: 600 }}>
          {label || `Slot ${index + 1}`}
        </Typography>
      </Box>
    )}
    <Box
      sx={{
        position: "absolute",
        top: 4,
        left: 4,
        px: 0.7,
        py: 0.2,
        borderRadius: "4px",
        backgroundColor: "rgba(0,0,0,0.7)",
        fontFamily: "Inter",
        fontSize: "10px",
        color: "#94a3b8",
        fontWeight: 600,
      }}
    >
      #{index + 1}
    </Box>
  </Box>
);

const MountPreviewDialog = ({
  open,
  onClose,
  title,
  mountName,
  layout,
  previewFiles,
  previewUrls,
  importLoading,
  onCancel,
  onSave,
}) => {
  return (
          <Dialog
        open={open}
        onClose={() => !importLoading && onClose()}
        fullWidth
        maxWidth="lg"
        sx={{ zIndex: 9999 }}
        PaperProps={{
          sx: {
            borderRadius: "10px",
            overflow: "hidden",
            boxShadow: "0px 10px 40px rgba(0,0,0,0.14)",
          },
        }}
      >
        <DialogTitle
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            borderBottom: "1px solid #e2e8f0",
            py: 1.8,
            px: 3,
          }}
        >
          <Typography
            sx={{
              fontFamily: "Inter",
              fontSize: "15px",
              color: "#64748b",
            }}
          >
            Patients / {title} / Imaging /{" "}
            <Box component="span" sx={{ fontWeight: 700, color: "#0f172a" }}>
              Mount Preview
            </Box>
          </Typography>
          <IconButton
            size="small"
            onClick={() => onClose()}
            disabled={importLoading}
            sx={{ color: "#94a3b8", "&:hover": { color: "#334155" } }}
          >
            <CloseIcon fontSize="small" />
          </IconButton>
        </DialogTitle>

        <DialogContent
          sx={{
            p: 3,
            maxHeight: "75vh",
            overflowY: "auto",
            backgroundColor: "#f8fafc",
          }}
        >
          {/* Metadata Banner */}
          <Box
            sx={{
              mb: 2.5,
              p: 2,
              borderRadius: "8px",
              backgroundColor: "#ffffff",
              border: `1px solid ${COLORS.BORDER}`,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              flexWrap: "wrap",
              gap: 2,
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
              <Box
                sx={{
                  width: 38,
                  height: 38,
                  borderRadius: "8px",
                  backgroundColor: COLORS.ACCENT_BG,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: COLORS.ACCENT,
                }}
              >
                <CollectionsIcon sx={{ fontSize: 22 }} />
              </Box>
              <Box>
                <Typography sx={{ fontFamily: "Inter", fontSize: "15px", fontWeight: 700, color: COLORS.TEXT_PRIMARY }}>
                  {mountName.trim() || layout}
                </Typography>
                <Typography sx={{ fontFamily: "Inter", fontSize: "12px", color: COLORS.TEXT_MUTED }}>
                  Layout: <strong style={{ color: COLORS.TEXT_BODY }}>{layout}</strong> • {previewFiles.length} image(s) selected
                </Typography>
              </Box>
            </Box>

            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <CheckCircleIcon sx={{ fontSize: 18, color: COLORS.STATUS_CONFIRMED }} />
              <Typography sx={{ fontFamily: "Inter", fontSize: "12px", fontWeight: 600, color: COLORS.STATUS_CONFIRMED }}>
                Ready to save
              </Typography>
            </Box>
          </Box>

          {/* Mount Dark Canvas Grid Preview */}
          <Box
            sx={{
              backgroundColor: "#000000",
              borderRadius: "10px",
              border: "1.5px solid #1e293b",
              p: { xs: 2, md: 3 },
              minHeight: 380,
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
            }}
          >
            {/* Dynamic slot layout preview based on selected layout */}
            {layout === "2 BW/PA" ? (
              <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2, maxWidth: 640, mx: "auto", width: "100%" }}>
                <MountPreviewSlot imageSrc={previewUrls[0]} index={0} aspectRatio="4/3" label="Right BW/PA" />
                <MountPreviewSlot imageSrc={previewUrls[1]} index={1} aspectRatio="4/3" label="Left BW/PA" />
              </Box>
            ) : layout === "4 BW" ? (
              <Box sx={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 1.5, maxWidth: 840, mx: "auto", width: "100%" }}>
                <MountPreviewSlot imageSrc={previewUrls[0]} index={0} aspectRatio="4/3" label="Right Molar BW" />
                <MountPreviewSlot imageSrc={previewUrls[1]} index={1} aspectRatio="4/3" label="Right Premolar BW" />
                <MountPreviewSlot imageSrc={previewUrls[2]} index={2} aspectRatio="4/3" label="Left Premolar BW" />
                <MountPreviewSlot imageSrc={previewUrls[3]} index={3} aspectRatio="4/3" label="Left Molar BW" />
              </Box>
            ) : layout === "4 PA" ? (
              <Box sx={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 1.5, maxWidth: 680, mx: "auto", width: "100%" }}>
                <MountPreviewSlot imageSrc={previewUrls[0]} index={0} aspectRatio="3/4" label="PA #1" />
                <MountPreviewSlot imageSrc={previewUrls[1]} index={1} aspectRatio="3/4" label="PA #2" />
                <MountPreviewSlot imageSrc={previewUrls[2]} index={2} aspectRatio="3/4" label="PA #3" />
                <MountPreviewSlot imageSrc={previewUrls[3]} index={3} aspectRatio="3/4" label="PA #4" />
              </Box>
            ) : layout === "4 BW/PA" ? (
              <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2, maxWidth: 680, mx: "auto", width: "100%" }}>
                <MountPreviewSlot imageSrc={previewUrls[0]} index={0} aspectRatio="4/3" label="Upper Right" />
                <MountPreviewSlot imageSrc={previewUrls[1]} index={1} aspectRatio="4/3" label="Upper Left" />
                <MountPreviewSlot imageSrc={previewUrls[2]} index={2} aspectRatio="4/3" label="Lower Right" />
                <MountPreviewSlot imageSrc={previewUrls[3]} index={3} aspectRatio="4/3" label="Lower Left" />
              </Box>
            ) : layout === "4 BW 2 PA" ? (
              <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 2, maxWidth: 860, mx: "auto", width: "100%" }}>
                <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
                  <MountPreviewSlot imageSrc={previewUrls[0]} index={0} aspectRatio="4/3" label="Right Molar" />
                  <MountPreviewSlot imageSrc={previewUrls[1]} index={1} aspectRatio="4/3" label="Right Premolar" />
                </Box>
                <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
                  <MountPreviewSlot imageSrc={previewUrls[2]} index={2} aspectRatio="3/4" label="Maxillary Anterior" />
                  <MountPreviewSlot imageSrc={previewUrls[3]} index={3} aspectRatio="3/4" label="Mandibular Anterior" />
                </Box>
                <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
                  <MountPreviewSlot imageSrc={previewUrls[4]} index={4} aspectRatio="4/3" label="Left Premolar" />
                  <MountPreviewSlot imageSrc={previewUrls[5]} index={5} aspectRatio="4/3" label="Left Molar" />
                </Box>
              </Box>
            ) : (
              /* Grid and FMX series preview: responsive balanced layout */
              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: {
                    xs: "repeat(2, 1fr)",
                    sm: "repeat(3, 1fr)",
                    md: previewFiles.length > 8 ? "repeat(5, 1fr)" : "repeat(4, 1fr)",
                  },
                  gap: 1.5,
                  maxWidth: 920,
                  mx: "auto",
                  width: "100%",
                }}
              >
                {previewUrls.map((url, i) => (
                  <MountPreviewSlot key={i} imageSrc={url} index={i} aspectRatio="4/3" label={`Slot ${i + 1}`} />
                ))}
              </Box>
            )}
          </Box>
        </DialogContent>

        <DialogActions
          sx={{
            py: 2,
            px: 3,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            borderTop: "1px solid #e2e8f0",
            backgroundColor: "#ffffff",
          }}
        >
          {/* Cancel button: opens the layout dialog again as requested */}
          <Button
            onClick={onCancel}
            disabled={importLoading}
            startIcon={<ArrowBackIcon sx={{ fontSize: "16px" }} />}
            sx={{
              textTransform: "none",
              px: 2.5,
              py: 0.7,
              borderRadius: "6px",
              border: "1px solid #cbd5e1",
              color: "#374151",
              fontFamily: "Inter",
              fontSize: "13px",
              fontWeight: 600,
              "&:hover": { backgroundColor: "#f8fafc", borderColor: "#94a3b8" },
            }}
          >
            Cancel
          </Button>

          <Button
            variant="contained"
            disableElevation
            onClick={onSave}
            disabled={importLoading}
            startIcon={importLoading ? <CircularProgress size={16} color="inherit" /> : null}
            sx={{
              ...actionButtonSx,
              px: 3.5,
              py: 0.7,
              backgroundColor: COLORS.ACCENT,
              color: "#ffffff",
              "&:hover": { backgroundColor: COLORS.ACCENT_HOVER },
            }}
          >
            {importLoading ? "Saving..." : "Save Mount"}
          </Button>
        </DialogActions>
      </Dialog>

  );
};

export default MountPreviewDialog;
