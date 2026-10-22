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
import CollectionsOutlinedIcon from "@mui/icons-material/CollectionsOutlined";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { COLORS } from "../../constants/colors";
import { fontSize, fontWeight, radius } from "../../constants/styles";

const MountPreviewSlot = ({ imageSrc, index, aspectRatio = "4/3", label }) => (
  <Box
    sx={{
      backgroundColor: "#0f172a",
      borderRadius: radius.sm,
      border: "1px solid #334155",
      overflow: "hidden",
      position: "relative",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      aspectRatio,
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
      <Box sx={{ textAlign: "center", p: 1 }}>
        <Typography sx={{ fontFamily: "Inter", fontSize: fontSize.sm, color: "#cbd5e1", fontWeight: fontWeight.medium }}>
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
        borderRadius: radius.sm,
        backgroundColor: "rgba(0,0,0,0.75)",
        fontFamily: "Inter",
        fontSize: "10px",
        color: "#e2e8f0",
        fontWeight: fontWeight.semibold,
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
        aria-labelledby="mount-preview-title"
        fullWidth
        maxWidth="lg"
        sx={{ zIndex: 9999 }}
        PaperProps={{
          sx: {
            borderRadius: radius.lg,
            border: `1px solid ${COLORS.BORDER}`,
            overflow: "hidden",
            boxShadow: "0px 8px 24px rgba(0, 0, 0, 0.1)",
          },
        }}
      >
        <DialogTitle
          component="div"
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1.5,
            borderBottom: `1px solid ${COLORS.BORDER}`,
            backgroundColor: COLORS.SURFACE_TINT,
            py: 1.25,
            px: { xs: 2, sm: 2.5 },
          }}
        >
          <Box
            sx={{
              width: 36,
              height: 36,
              borderRadius: radius.md,
              backgroundColor: "#eff6ff",
              color: COLORS.ACCENT,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <CollectionsOutlinedIcon sx={{ fontSize: 20 }} />
          </Box>
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography id="mount-preview-title" component="h2" sx={{ fontFamily: "Inter", fontSize: fontSize.xl, fontWeight: fontWeight.bold, color: COLORS.TEXT_PRIMARY }}>
              Mount Preview
            </Typography>
            <Typography sx={{ fontFamily: "Inter", fontSize: fontSize.sm, color: COLORS.TEXT_SECONDARY }}>
              Review images{title ? ` for ${title}` : ""} before saving.
            </Typography>
          </Box>
          <IconButton
            size="small"
            aria-label="Close mount preview"
            onClick={onClose}
            disabled={importLoading}
            sx={{ color: COLORS.TEXT_SECONDARY }}
          >
            <CloseIcon fontSize="small" />
          </IconButton>
        </DialogTitle>

        <DialogContent
          sx={{
            p: { xs: 2, sm: 3 },
            ".MuiDialogTitle-root + &": { pt: { xs: 2, sm: 3 } },
            maxHeight: "75vh",
            overflowY: "auto",
            backgroundColor: COLORS.SURFACE_CARD,
          }}
        >
          {/* Metadata Banner */}
          <Box
            sx={{
              mb: 2.5,
              p: { xs: 1.5, sm: 2 },
              borderRadius: radius.md,
              backgroundColor: COLORS.SURFACE_CARD,
              border: `1px solid ${COLORS.BORDER}`,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              flexWrap: "wrap",
              gap: 1.5,
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
              <Box
                sx={{
                  width: 38,
                  height: 38,
                  borderRadius: radius.md,
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
                <Typography sx={{ fontFamily: "Inter", fontSize: fontSize.xl, fontWeight: fontWeight.bold, color: COLORS.TEXT_PRIMARY }}>
                  {mountName.trim() || layout}
                </Typography>
                <Typography sx={{ fontFamily: "Inter", fontSize: fontSize.base, color: COLORS.TEXT_SECONDARY }}>
                  Layout: <strong style={{ color: COLORS.TEXT_BODY }}>{layout}</strong> • {previewFiles.length} image(s) selected
                </Typography>
              </Box>
            </Box>

            <Box sx={{ display: "flex", alignItems: "center", gap: 0.75, px: 1.25, py: 0.75, borderRadius: radius.pill, backgroundColor: "#ecfdf5" }}>
              <CheckCircleIcon sx={{ fontSize: 18, color: COLORS.STATUS_CONFIRMED }} />
              <Typography sx={{ fontFamily: "Inter", fontSize: fontSize.base, fontWeight: fontWeight.semibold, color: COLORS.STATUS_CONFIRMED }}>
                Ready to save
              </Typography>
            </Box>
          </Box>

          {/* Mount Dark Canvas Grid Preview */}
          <Box
            sx={{
              backgroundColor: "#0b1220",
              borderRadius: radius.lg,
              border: "1px solid #1e293b",
              p: { xs: 2, md: 3 },
              minHeight: { xs: 220, sm: 320 },
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
              <Box sx={{ display: "grid", gridTemplateColumns: { xs: "repeat(2, minmax(0, 1fr))", sm: "repeat(4, minmax(0, 1fr))" }, gap: 1.5, maxWidth: 840, mx: "auto", width: "100%" }}>
                <MountPreviewSlot imageSrc={previewUrls[0]} index={0} aspectRatio="4/3" label="Right Molar BW" />
                <MountPreviewSlot imageSrc={previewUrls[1]} index={1} aspectRatio="4/3" label="Right Premolar BW" />
                <MountPreviewSlot imageSrc={previewUrls[2]} index={2} aspectRatio="4/3" label="Left Premolar BW" />
                <MountPreviewSlot imageSrc={previewUrls[3]} index={3} aspectRatio="4/3" label="Left Molar BW" />
              </Box>
            ) : layout === "4 PA" ? (
              <Box sx={{ display: "grid", gridTemplateColumns: { xs: "repeat(2, minmax(0, 1fr))", sm: "repeat(4, minmax(0, 1fr))" }, gap: 1.5, maxWidth: 680, mx: "auto", width: "100%" }}>
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
              <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "repeat(3, minmax(0, 1fr))" }, gap: 2, maxWidth: 860, mx: "auto", width: "100%" }}>
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
            py: 1.5,
            px: { xs: 2, sm: 3 },
            display: "flex",
            justifyContent: "flex-end",
            alignItems: "center",
            gap: 1,
            borderTop: `1px solid ${COLORS.BORDER}`,
            backgroundColor: COLORS.SURFACE_CARD,
          }}
        >
          <Button
            variant="outlined"
            onClick={onCancel}
            disabled={importLoading}
            startIcon={<ArrowBackIcon sx={{ fontSize: "16px" }} />}
            sx={{
              textTransform: "none",
              px: 2,
              py: 0.875,
              borderRadius: radius.md,
              borderColor: "#d0d5dd",
              color: COLORS.TEXT_BODY,
              fontFamily: "Inter",
              fontSize: fontSize.md,
              fontWeight: fontWeight.medium,
              "&:hover": { backgroundColor: COLORS.SURFACE_HOVER, borderColor: COLORS.TEXT_MUTED },
            }}
          >
            Back to layouts
          </Button>

          <Button
            variant="contained"
            disableElevation
            onClick={onSave}
            disabled={importLoading}
            startIcon={importLoading ? <CircularProgress size={16} color="inherit" /> : null}
            sx={{
              textTransform: "none",
              px: 2.5,
              py: 0.875,
              borderRadius: radius.md,
              backgroundColor: COLORS.ACCENT,
              color: COLORS.WHITE,
              fontFamily: "Inter",
              fontSize: fontSize.md,
              fontWeight: fontWeight.semibold,
              boxShadow: "none",
              "&:hover": { backgroundColor: COLORS.ACCENT_HOVER, boxShadow: "none" },
              "&.Mui-disabled": { backgroundColor: "#c5d3f8", color: COLORS.WHITE },
            }}
          >
            {importLoading ? "Saving..." : "Save Mount"}
          </Button>
        </DialogActions>
      </Dialog>

  );
};

export default MountPreviewDialog;
