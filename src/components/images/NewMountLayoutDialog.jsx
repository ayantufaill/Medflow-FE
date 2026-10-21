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
import CollectionsOutlinedIcon from "@mui/icons-material/CollectionsOutlined";
import { COLORS } from "../../constants/colors";
import { fontSize, fontWeight, radius, standardFieldSx } from "../../constants/styles";

// ─── Visual Mount Thumbnail Card ──────────────────────────────
const MountThumbnailCard = ({ name, isSelected, onClick, children }) => (
  <Box
    component="button"
    type="button"
    onClick={onClick}
    aria-label={`Select ${name} mount layout`}
    aria-pressed={isSelected}
    sx={{
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      gap: 1,
      width: "100%",
      minWidth: 0,
      p: 1.25,
      border: `1px solid ${isSelected ? COLORS.ACCENT : COLORS.BORDER}`,
      borderRadius: radius.md,
      backgroundColor: isSelected ? COLORS.ACCENT_BG : COLORS.SURFACE_CARD,
      cursor: "pointer",
      userSelect: "none",
      fontFamily: "Inter",
      transition: "border-color 0.15s ease, background-color 0.15s ease",
      "&:hover": { borderColor: COLORS.ACCENT, backgroundColor: isSelected ? COLORS.ACCENT_BG : COLORS.SURFACE_HOVER },
      "&:focus-visible": { outline: `2px solid ${COLORS.ACCENT}`, outlineOffset: 2 },
    }}
  >
    <Box
      component="span"
      sx={{
        width: "100%",
        maxWidth: 138,
        aspectRatio: "138 / 82",
        backgroundColor: "#000000",
        borderRadius: radius.sm,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        p: "6px",
        border: "1px solid #1e293b",
      }}
    >
      <svg viewBox="0 0 100 60" style={{ width: "100%", height: "100%", overflow: "visible" }}>
        {children}
      </svg>
    </Box>
    <Typography
      component="span"
      sx={{
        fontFamily: "Inter",
        fontSize: fontSize.base,
        fontWeight: isSelected ? fontWeight.bold : fontWeight.semibold,
        color: isSelected ? COLORS.ACCENT : COLORS.TEXT_PRIMARY,
        textAlign: "center",
        lineHeight: 1.3,
      }}
    >
      {name}
    </Typography>
  </Box>
);

const TILE_COLOR = "#4b5d73";


const NewMountLayoutDialog = ({
  open,
  onClose,
  title,
  mountName,
  onMountNameChange,
  layout,
  onLayoutChange,
  onContinue,
  importLoading,
}) => {
  return (
    <Dialog
      open={open}
      onClose={() => !importLoading && onClose()}
      aria-labelledby="import-images-title"
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
            <Typography id="import-images-title" component="h2" sx={{ fontFamily: "Inter", fontSize: fontSize.xl, fontWeight: fontWeight.bold, color: COLORS.TEXT_PRIMARY }}>
              Import Images
            </Typography>
            <Typography sx={{ fontFamily: "Inter", fontSize: fontSize.sm, color: COLORS.TEXT_SECONDARY }}>
              Choose a mount layout{title ? ` for ${title}` : ""}, then select images.
            </Typography>
          </Box>
          <IconButton
            size="small"
            aria-label="Close import images"
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
          {/* Name Field */}
          <Typography
            sx={{
              fontFamily: "Inter",
              fontWeight: fontWeight.semibold,
              fontSize: fontSize.md,
              color: COLORS.TEXT_PRIMARY,
              mb: 1,
            }}
          >
            Name
          </Typography>
          <TextField
            size="small"
            placeholder="Optional"
            slotProps={{ htmlInput: { "aria-label": "Mount name" } }}
            value={mountName}
            onChange={(e) => onMountNameChange(e.target.value)}
            sx={{
              mb: 3,
              width: "100%",
              maxWidth: 320,
              ...standardFieldSx,
            }}
          />

          {/* Mount Layout Section */}
          <Typography
            sx={{
              fontFamily: "Inter",
              fontWeight: fontWeight.semibold,
              fontSize: fontSize.md,
              color: COLORS.TEXT_PRIMARY,
              mb: 1.5,
            }}
          >
            Mount Layout
          </Typography>

          {/* 1. Intraoral Photo */}
          <Typography
            sx={{
              fontFamily: "Inter",
              fontWeight: fontWeight.semibold,
              fontSize: fontSize.base,
              color: COLORS.TEXT_BODY,
              mb: 1,
            }}
          >
            Intraoral Photo
          </Typography>
          <Box sx={{ display: "grid", gridTemplateColumns: { xs: "repeat(2, minmax(0, 1fr))", sm: "repeat(3, minmax(0, 1fr))", md: "repeat(6, minmax(0, 1fr))" }, gap: 1.5, mb: 3 }}>
            <MountThumbnailCard
              name="Grid"
              isSelected={layout === "Grid"}
              onClick={() => onLayoutChange("Grid")}
            >
              {[0, 1, 2, 3].map((row) =>
                [0, 1, 2, 3].map((col) => (
                  <rect
                    key={`${row}-${col}`}
                    x={6 + col * 23}
                    y={6 + row * 13}
                    width={19}
                    height={9.5}
                    rx={1.5}
                    fill={TILE_COLOR}
                  />
                ))
              )}
            </MountThumbnailCard>
          </Box>

          {/* 2. Intraoral X-Ray */}
          <Typography
            sx={{
              fontFamily: "Inter",
              fontWeight: fontWeight.semibold,
              fontSize: fontSize.base,
              color: COLORS.TEXT_BODY,
              mb: 1,
            }}
          >
            Intraoral X-Ray
          </Typography>

          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "repeat(2, minmax(0, 1fr))",
                sm: "repeat(3, minmax(0, 1fr))",
                md: "repeat(6, minmax(0, 1fr))",
              },
              gap: 1.5,
            }}
          >
            {/* Card 1: 2 BW/PA */}
            <MountThumbnailCard
              name="2 BW/PA"
              isSelected={layout === "2 BW/PA"}
              onClick={() => onLayoutChange("2 BW/PA")}
            >
              <rect x={6} y={13} width={41} height={34} rx={2} fill={TILE_COLOR} />
              <rect x={53} y={13} width={41} height={34} rx={2} fill={TILE_COLOR} />
            </MountThumbnailCard>

            {/* Card 2: 4 BW */}
            <MountThumbnailCard
              name="4 BW"
              isSelected={layout === "4 BW"}
              onClick={() => onLayoutChange("4 BW")}
            >
              <rect x={6} y={18} width={20} height={24} rx={2} fill={TILE_COLOR} />
              <rect x={28} y={18} width={20} height={24} rx={2} fill={TILE_COLOR} />
              <rect x={52} y={18} width={20} height={24} rx={2} fill={TILE_COLOR} />
              <rect x={74} y={18} width={20} height={24} rx={2} fill={TILE_COLOR} />
            </MountThumbnailCard>

            {/* Card 3: 4 PA */}
            <MountThumbnailCard
              name="4 PA"
              isSelected={layout === "4 PA"}
              onClick={() => onLayoutChange("4 PA")}
            >
              <rect x={11} y={7} width={16} height={46} rx={2} fill={TILE_COLOR} />
              <rect x={31} y={7} width={16} height={46} rx={2} fill={TILE_COLOR} />
              <rect x={51} y={7} width={16} height={46} rx={2} fill={TILE_COLOR} />
              <rect x={71} y={7} width={16} height={46} rx={2} fill={TILE_COLOR} />
            </MountThumbnailCard>

            {/* Card 4: 4 BW/PA */}
            <MountThumbnailCard
              name="4 BW/PA"
              isSelected={layout === "4 BW/PA"}
              onClick={() => onLayoutChange("4 BW/PA")}
            >
              <rect x={8} y={7} width={40} height={21} rx={2} fill={TILE_COLOR} />
              <rect x={52} y={7} width={40} height={21} rx={2} fill={TILE_COLOR} />
              <rect x={8} y={32} width={40} height={21} rx={2} fill={TILE_COLOR} />
              <rect x={52} y={32} width={40} height={21} rx={2} fill={TILE_COLOR} />
            </MountThumbnailCard>

            {/* Card 5: 4 BW 2 PA */}
            <MountThumbnailCard
              name="4 BW 2 PA"
              isSelected={layout === "4 BW 2 PA"}
              onClick={() => onLayoutChange("4 BW 2 PA")}
            >
              <rect x={6} y={20} width={18} height={20} rx={2} fill={TILE_COLOR} />
              <rect x={26} y={20} width={18} height={20} rx={2} fill={TILE_COLOR} />
              <rect x={47} y={6} width={12} height={22} rx={2} fill={TILE_COLOR} />
              <rect x={47} y={32} width={12} height={22} rx={2} fill={TILE_COLOR} />
              <rect x={62} y={20} width={18} height={20} rx={2} fill={TILE_COLOR} />
              <rect x={82} y={20} width={18} height={20} rx={2} fill={TILE_COLOR} />
            </MountThumbnailCard>

            {/* Card 6: 4 BW 4 PA */}
            <MountThumbnailCard
              name="4 BW 4 PA"
              isSelected={layout === "4 BW 4 PA"}
              onClick={() => onLayoutChange("4 BW 4 PA")}
            >
              <rect x={8} y={20} width={13} height={20} rx={2} fill={TILE_COLOR} />
              <rect x={23} y={20} width={13} height={20} rx={2} fill={TILE_COLOR} />
              <rect x={39} y={6} width={9} height={22} rx={2} fill={TILE_COLOR} />
              <rect x={49} y={6} width={9} height={22} rx={2} fill={TILE_COLOR} />
              <rect x={39} y={32} width={9} height={22} rx={2} fill={TILE_COLOR} />
              <rect x={49} y={32} width={9} height={22} rx={2} fill={TILE_COLOR} />
              <rect x={61} y={20} width={13} height={20} rx={2} fill={TILE_COLOR} />
              <rect x={76} y={20} width={13} height={20} rx={2} fill={TILE_COLOR} />
            </MountThumbnailCard>

            {/* Row 2, Card 1: Pediatric 6 */}
            <MountThumbnailCard
              name="Pediatric 6"
              isSelected={layout === "Pediatric 6"}
              onClick={() => onLayoutChange("Pediatric 6")}
            >
              <rect x={25} y={6} width={14} height={21} rx={2} fill={TILE_COLOR} />
              <rect x={42} y={6} width={14} height={21} rx={2} fill={TILE_COLOR} />
              <rect x={59} y={6} width={14} height={21} rx={2} fill={TILE_COLOR} />
              <rect x={12} y={32} width={20} height={20} rx={2} fill={TILE_COLOR} />
              <rect x={42} y={32} width={14} height={21} rx={2} fill={TILE_COLOR} />
              <rect x={68} y={32} width={20} height={20} rx={2} fill={TILE_COLOR} />
            </MountThumbnailCard>

            {/* Row 2, Card 2: FMX 14 */}
            <MountThumbnailCard
              name="FMX 14"
              isSelected={layout === "FMX 14"}
              onClick={() => onLayoutChange("FMX 14")}
            >
              <rect x={6} y={8} width={10} height={20} rx={1.5} fill={TILE_COLOR} />
              <rect x={6} y={32} width={10} height={20} rx={1.5} fill={TILE_COLOR} />
              <rect x={20} y={12} width={12} height={16} rx={1.5} fill={TILE_COLOR} />
              <rect x={34} y={12} width={12} height={16} rx={1.5} fill={TILE_COLOR} />
              <rect x={48} y={12} width={12} height={16} rx={1.5} fill={TILE_COLOR} />
              <rect x={62} y={12} width={12} height={16} rx={1.5} fill={TILE_COLOR} />
              <rect x={20} y={32} width={12} height={16} rx={1.5} fill={TILE_COLOR} />
              <rect x={34} y={32} width={12} height={16} rx={1.5} fill={TILE_COLOR} />
              <rect x={48} y={32} width={12} height={16} rx={1.5} fill={TILE_COLOR} />
              <rect x={62} y={32} width={12} height={16} rx={1.5} fill={TILE_COLOR} />
              <rect x={84} y={8} width={10} height={20} rx={1.5} fill={TILE_COLOR} />
              <rect x={84} y={32} width={10} height={20} rx={1.5} fill={TILE_COLOR} />
            </MountThumbnailCard>

            {/* Row 2, Card 3: FMX 18 */}
            <MountThumbnailCard
              name="FMX 18"
              isSelected={layout === "FMX 18"}
              onClick={() => onLayoutChange("FMX 18")}
            >
              {/* Top row: 5 tiles */}
              <rect x={6} y={6} width={15} height={15} rx={1.5} fill={TILE_COLOR} />
              <rect x={24} y={6} width={15} height={15} rx={1.5} fill={TILE_COLOR} />
              <rect x={42} y={6} width={15} height={15} rx={1.5} fill={TILE_COLOR} />
              <rect x={60} y={6} width={15} height={15} rx={1.5} fill={TILE_COLOR} />
              <rect x={78} y={6} width={15} height={15} rx={1.5} fill={TILE_COLOR} />
              {/* Middle row: 2 BW on left, 2 BW on right */}
              <rect x={6} y={23} width={15} height={14} rx={1.5} fill={TILE_COLOR} />
              <rect x={24} y={23} width={15} height={14} rx={1.5} fill={TILE_COLOR} />
              <rect x={60} y={23} width={15} height={14} rx={1.5} fill={TILE_COLOR} />
              <rect x={78} y={23} width={15} height={14} rx={1.5} fill={TILE_COLOR} />
              {/* Bottom row: 5 tiles */}
              <rect x={6} y={39} width={15} height={15} rx={1.5} fill={TILE_COLOR} />
              <rect x={24} y={39} width={15} height={15} rx={1.5} fill={TILE_COLOR} />
              <rect x={42} y={39} width={15} height={15} rx={1.5} fill={TILE_COLOR} />
              <rect x={60} y={39} width={15} height={15} rx={1.5} fill={TILE_COLOR} />
              <rect x={78} y={39} width={15} height={15} rx={1.5} fill={TILE_COLOR} />
            </MountThumbnailCard>

            {/* Row 2, Card 4: FMX 20 */}
            <MountThumbnailCard
              name="FMX 20"
              isSelected={layout === "FMX 20"}
              onClick={() => onLayoutChange("FMX 20")}
            >
              <rect x={8} y={8} width={11} height={19} rx={1.5} fill={TILE_COLOR} />
              <rect x={22} y={8} width={11} height={19} rx={1.5} fill={TILE_COLOR} />
              <rect x={36} y={8} width={11} height={19} rx={1.5} fill={TILE_COLOR} />
              <rect x={51} y={8} width={11} height={19} rx={1.5} fill={TILE_COLOR} />
              <rect x={65} y={8} width={11} height={19} rx={1.5} fill={TILE_COLOR} />
              <rect x={79} y={8} width={11} height={19} rx={1.5} fill={TILE_COLOR} />
              <rect x={8} y={33} width={11} height={19} rx={1.5} fill={TILE_COLOR} />
              <rect x={22} y={33} width={11} height={19} rx={1.5} fill={TILE_COLOR} />
              <rect x={36} y={33} width={11} height={19} rx={1.5} fill={TILE_COLOR} />
              <rect x={51} y={33} width={11} height={19} rx={1.5} fill={TILE_COLOR} />
              <rect x={65} y={33} width={11} height={19} rx={1.5} fill={TILE_COLOR} />
              <rect x={79} y={33} width={11} height={19} rx={1.5} fill={TILE_COLOR} />
            </MountThumbnailCard>

            {/* Row 2, Card 5: Mixed FMX */}
            <MountThumbnailCard
              name="Mixed FMX"
              isSelected={layout === "Mixed FMX"}
              onClick={() => onLayoutChange("Mixed FMX")}
            >
              <rect x={6} y={15} width={15} height={13} rx={1.5} fill={TILE_COLOR} />
              <rect x={6} y={31} width={15} height={13} rx={1.5} fill={TILE_COLOR} />
              <rect x={24} y={6} width={14} height={20} rx={1.5} fill={TILE_COLOR} />
              <rect x={42} y={6} width={14} height={20} rx={1.5} fill={TILE_COLOR} />
              <rect x={60} y={6} width={14} height={20} rx={1.5} fill={TILE_COLOR} />
              <rect x={24} y={32} width={14} height={20} rx={1.5} fill={TILE_COLOR} />
              <rect x={42} y={32} width={14} height={20} rx={1.5} fill={TILE_COLOR} />
              <rect x={60} y={32} width={14} height={20} rx={1.5} fill={TILE_COLOR} />
              <rect x={78} y={15} width={15} height={13} rx={1.5} fill={TILE_COLOR} />
              <rect x={78} y={31} width={15} height={13} rx={1.5} fill={TILE_COLOR} />
            </MountThumbnailCard>

            {/* Row 2, Card 6: Cross 5 */}
            <MountThumbnailCard
              name="Cross 5"
              isSelected={layout === "Cross 5"}
              onClick={() => onLayoutChange("Cross 5")}
            >
              <rect x={42} y={4} width={16} height={19} rx={2} fill={TILE_COLOR} />
              <rect x={18} y={21} width={20} height={17} rx={2} fill={TILE_COLOR} />
              <rect x={42} y={21} width={16} height={17} rx={2} fill={TILE_COLOR} />
              <rect x={62} y={21} width={20} height={17} rx={2} fill={TILE_COLOR} />
              <rect x={42} y={40} width={16} height={18} rx={2} fill={TILE_COLOR} />
            </MountThumbnailCard>
          </Box>
        </DialogContent>

        <DialogActions
          sx={{
            py: 1.5,
            px: { xs: 2, sm: 3 },
            display: "flex",
            justifyContent: "flex-end",
            gap: 1,
            borderTop: `1px solid ${COLORS.BORDER}`,
            backgroundColor: COLORS.SURFACE_CARD,
          }}
        >
          <Button
            variant="outlined"
            onClick={onClose}
            disabled={importLoading}
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
            Cancel
          </Button>
          <Button
            variant="contained"
            disableElevation
            onClick={onContinue}
            disabled={importLoading}
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
              "&:hover": {
                backgroundColor: COLORS.ACCENT_HOVER,
                boxShadow: "none",
              },
              "&.Mui-disabled": { backgroundColor: "#c5d3f8", color: COLORS.WHITE },
            }}
          >
            Continue
          </Button>
        </DialogActions>
      </Dialog>

  );
};

export default NewMountLayoutDialog;
