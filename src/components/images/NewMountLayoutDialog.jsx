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
import { COLORS } from "../../constants/colors";

// ─── Visual Mount Thumbnail Card ──────────────────────────────
const MountThumbnailCard = ({ name, isSelected, onClick, children }) => (
  <Box
    onClick={onClick}
    sx={{
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      cursor: "pointer",
      userSelect: "none",
      transition: "transform 0.12s ease",
      "&:hover": { transform: "translateY(-1px)" },
    }}
  >
    <Box
      sx={{
        width: 138,
        height: 82,
        backgroundColor: "#000000",
        borderRadius: "8px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        p: "6px",
        border: isSelected ? `2.5px solid ${COLORS.ACCENT}` : "1.5px solid #1e293b",
        boxShadow: isSelected ? "0 0 0 2px rgba(35, 98, 239, 0.3)" : "none",
        transition: "border-color 0.15s ease",
        "&:hover": {
          borderColor: isSelected ? COLORS.ACCENT : "#4b5563",
        },
      }}
    >
      <svg viewBox="0 0 100 60" style={{ width: "100%", height: "100%", overflow: "visible" }}>
        {children}
      </svg>
    </Box>
    <Typography
      sx={{
        fontFamily: "Inter",
        fontSize: "11px",
        fontWeight: isSelected ? 700 : 600,
        color: isSelected ? COLORS.ACCENT : "#0f172a",
        mt: 0.8,
        textAlign: "center",
        whiteSpace: "nowrap",
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
        fullWidth
        maxWidth="lg"
        sx={{ zIndex: 9999 }}
        PaperProps={{
          sx: {
            borderRadius: "10px",
            overflow: "hidden",
            boxShadow: "0px 10px 40px rgba(0,0,0,0.12)",
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
              New Mount
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
          }}
        >
          {/* Name Field */}
          <Typography
            sx={{
              fontFamily: "Inter",
              fontWeight: 700,
              fontSize: "14px",
              color: "#0f172a",
              mb: 1,
            }}
          >
            Name
          </Typography>
          <TextField
            size="small"
            placeholder="Optional"
            value={mountName}
            onChange={(e) => onMountNameChange(e.target.value)}
            sx={{
              mb: 3,
              maxWidth: 320,
              "& .MuiOutlinedInput-root": {
                borderRadius: "6px",
                fontFamily: "Inter",
                fontSize: "13px",
                "& fieldset": { borderColor: "#cbd5e1" },
              },
            }}
          />

          {/* Mount Layout Section */}
          <Typography
            sx={{
              fontFamily: "Inter",
              fontWeight: 700,
              fontSize: "14px",
              color: "#0f172a",
              mb: 1.5,
            }}
          >
            Mount Layout
          </Typography>

          {/* 1. Intraoral Photo */}
          <Typography
            sx={{
              fontFamily: "Inter",
              fontWeight: 600,
              fontSize: "12px",
              color: "#334155",
              mb: 1,
            }}
          >
            Intraoral Photo
          </Typography>
          <Box sx={{ display: "flex", gap: 2, mb: 3 }}>
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
              fontWeight: 600,
              fontSize: "12px",
              color: "#334155",
              mb: 1,
            }}
          >
            Intraoral X-Ray
          </Typography>

          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "repeat(2, 1fr)",
                sm: "repeat(3, 1fr)",
                md: "repeat(6, 1fr)",
              },
              gap: "16px 14px",
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
            py: 2,
            px: 3,
            display: "flex",
            justifyContent: "center",
            gap: 1.5,
            borderTop: "1px solid #f1f5f9",
          }}
        >
          <Button
            onClick={() => onClose()}
            disabled={importLoading}
            sx={{
              textTransform: "none",
              px: 3.5,
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
            onClick={onContinue}
            disabled={importLoading}
            sx={{
              textTransform: "none",
              px: 3.5,
              py: 0.7,
              borderRadius: "6px",
              backgroundColor: "#e2eafc",
              color: "#2563eb",
              fontFamily: "Inter",
              fontSize: "13px",
              fontWeight: 700,
              boxShadow: "none",
              "&:hover": {
                backgroundColor: "#2563eb",
                color: "#ffffff",
                boxShadow: "none",
              },
            }}
          >
            Continue
          </Button>
        </DialogActions>
      </Dialog>

  );
};

export default NewMountLayoutDialog;
