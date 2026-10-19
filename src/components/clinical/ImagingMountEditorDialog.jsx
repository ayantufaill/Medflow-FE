import { useState, useMemo, useRef } from "react";
import {
  Box,
  Dialog,
  IconButton,
  Typography,
  Button,
  Tooltip,
  Menu,
  MenuItem,
  Slider,
  Popover,
} from "@mui/material";
import {
  Close as CloseIcon,
  ZoomIn as ZoomInIcon,
  ZoomOut as ZoomOutIcon,
  FitScreen as FitScreenIcon,
  RotateRight as RotateRightIcon,
  InvertColors as InvertColorsIcon,
  Tune as TuneIcon,
  Undo as UndoIcon,
  ContentCopy as ContentCopyIcon,
  Inventory2Outlined as ArchiveIcon,
  SwapHoriz as SwapHorizIcon,
  IosShare as ShareIcon,
  GridViewOutlined as GridViewIcon,
  CropSquareOutlined as SingleViewIcon,
  ViewColumnOutlined as SplitViewIcon,
  WindowOutlined as QuadViewIcon,
  MoreVert as MoreVertIcon,
  StorageOutlined as DatabaseIcon,
  EditOutlined as PencilIcon,
  StraightenOutlined as RulerIcon,
  TimelineOutlined as LineIcon,
  RadioButtonUnchecked as CircleIcon,
  TitleOutlined as TextIcon,
  NorthEastOutlined as ArrowIcon,
  ChangeHistoryOutlined as PolygonIcon,
  PanToolOutlined as PanIcon,
  ContrastOutlined as ContrastIcon,
  FlipOutlined as FlipIcon,
  Fullscreen as FullscreenIcon,
  KeyboardArrowDown as ArrowDownIcon,
  Add as AddIcon,
} from "@mui/icons-material";
import { useSnackbar } from "../../contexts/SnackbarContext";

// ─── Dental X-Ray Graphic Renderers (High Fidelity Radiographs) ───
const UpperAnteriorXRay = () => (
  <svg viewBox="0 0 160 200" style={{ width: "100%", height: "100%", display: "block" }}>
    <defs>
      <radialGradient id="boneBg" cx="50%" cy="50%" r="75%">
        <stop offset="0%" stopColor="#1a1c22" />
        <stop offset="60%" stopColor="#0f1115" />
        <stop offset="100%" stopColor="#050608" />
      </radialGradient>
      <linearGradient id="enamelGrad" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#e2e8f0" stopOpacity="0.95" />
        <stop offset="40%" stopColor="#cbd5e1" stopOpacity="0.85" />
        <stop offset="85%" stopColor="#94a3b8" stopOpacity="0.75" />
        <stop offset="100%" stopColor="#475569" stopOpacity="0.6" />
      </linearGradient>
      <linearGradient id="pulpGrad" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#0a0c10" stopOpacity="0.9" />
        <stop offset="100%" stopColor="#1e2430" stopOpacity="0.7" />
      </linearGradient>
      <filter id="radiographicGrain" x="0%" y="0%" width="100%" height="100%">
        <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="3" result="noise" />
        <feColorMatrix type="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 0.12 0" />
        <feComposite in2="SourceGraphic" in="glare" operator="over" />
      </filter>
    </defs>
    <rect width="160" height="200" fill="url(#boneBg)" />
    {/* Alveolar bone trabecular texture */}
    <g opacity="0.35" stroke="#94a3b8" strokeWidth="0.5" strokeDasharray="1,3">
      {[...Array(14)].map((_, i) => (
        <path key={i} d={`M ${10 + i * 10} 20 Q ${50 + i * 5} ${80 + i * 4} ${150 - i * 5} ${170 - i * 3}`} fill="none" />
      ))}
    </g>
    {/* Central Incisor #8 */}
    <g>
      <path
        d="M 60 30 C 58 60 52 105 48 135 C 46 150 49 160 54 165 C 60 170 70 170 74 165 C 77 155 78 120 78 60 C 78 40 70 30 60 30 Z"
        fill="url(#enamelGrad)"
      />
      {/* Root canal / pulp chamber */}
      <path d="M 61 50 Q 62 100 63 150 Q 64 160 62 165" stroke="url(#pulpGrad)" strokeWidth="3.2" strokeLinecap="round" fill="none" />
    </g>
    {/* Central Incisor #9 */}
    <g>
      <path
        d="M 100 30 C 102 60 108 105 112 135 C 114 150 111 160 106 165 C 100 170 90 170 86 165 C 83 155 82 120 82 60 C 82 40 90 30 100 30 Z"
        fill="url(#enamelGrad)"
      />
      <path d="M 99 50 Q 98 100 97 150 Q 96 160 98 165" stroke="url(#pulpGrad)" strokeWidth="3.2" strokeLinecap="round" fill="none" />
    </g>
    {/* Lateral Incisor outlines */}
    <path d="M 32 45 C 30 75 26 120 22 145 C 20 155 24 162 28 165 C 36 168 44 165 46 155 C 48 135 52 90 50 45 Z" fill="#94a3b8" opacity="0.65" />
    <path d="M 128 45 C 130 75 134 120 138 145 C 140 155 136 162 132 165 C 124 168 116 165 114 155 C 112 135 108 90 110 45 Z" fill="#94a3b8" opacity="0.65" />
  </svg>
);

const LowerAnteriorXRay = () => (
  <svg viewBox="0 0 160 200" style={{ width: "100%", height: "100%", display: "block" }}>
    <defs>
      <radialGradient id="boneBgLower" cx="50%" cy="50%" r="75%">
        <stop offset="0%" stopColor="#171920" />
        <stop offset="60%" stopColor="#0d0f14" />
        <stop offset="100%" stopColor="#040507" />
      </radialGradient>
      <linearGradient id="lowerEnamel" x1="0%" y1="100%" x2="0%" y2="0%">
        <stop offset="0%" stopColor="#f1f5f9" stopOpacity="0.95" />
        <stop offset="35%" stopColor="#cbd5e1" stopOpacity="0.85" />
        <stop offset="80%" stopColor="#64748b" stopOpacity="0.65" />
        <stop offset="100%" stopColor="#334155" stopOpacity="0.45" />
      </linearGradient>
    </defs>
    <rect width="160" height="200" fill="url(#boneBgLower)" />
    {/* 4 Lower anterior slender incisors */}
    {[
      { cx: 42, w: 14, h: 120, pulp: 42 },
      { cx: 66, w: 15, h: 130, pulp: 66 },
      { cx: 92, w: 15, h: 130, pulp: 92 },
      { cx: 116, w: 14, h: 120, pulp: 116 },
    ].map((t, idx) => (
      <g key={idx}>
        <path
          d={`M ${t.cx - t.w / 2} 40 C ${t.cx - t.w / 2 + 2} 70 ${t.cx - t.w / 3} 120 ${t.cx - 2} ${40 + t.h} C ${t.cx} ${45 + t.h} ${t.cx + 2} ${45 + t.h} ${t.cx + 2} ${40 + t.h} C ${t.cx + t.w / 3} 120 ${t.cx + t.w / 2 - 2} 70 ${t.cx + t.w / 2} 40 Z`}
          fill="url(#lowerEnamel)"
        />
        <path d={`M ${t.pulp} 48 L ${t.pulp} ${30 + t.h}`} stroke="#0f172a" strokeWidth="2.2" strokeLinecap="round" />
      </g>
    ))}
  </svg>
);

const BitewingLeftXRay = () => (
  <svg viewBox="0 0 200 160" style={{ width: "100%", height: "100%", display: "block" }}>
    <defs>
      <radialGradient id="bwBg" cx="50%" cy="50%" r="75%">
        <stop offset="0%" stopColor="#1e222b" />
        <stop offset="50%" stopColor="#11141a" />
        <stop offset="100%" stopColor="#050608" />
      </radialGradient>
      <linearGradient id="crownGrad" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#e2e8f0" stopOpacity="0.95" />
        <stop offset="50%" stopColor="#94a3b8" stopOpacity="0.8" />
        <stop offset="100%" stopColor="#475569" stopOpacity="0.5" />
      </linearGradient>
    </defs>
    <rect width="200" height="160" fill="url(#bwBg)" />
    {/* Interocclusal space divider line */}
    <path d="M 10 80 Q 100 82 190 79" stroke="#050608" strokeWidth="4" />
    {/* Upper Molars & Premolars */}
    <g>
      <path d="M 25 25 C 20 50 20 70 28 78 C 45 80 55 78 58 70 C 62 55 58 35 50 25 Z" fill="url(#crownGrad)" />
      <path d="M 68 20 C 65 50 64 70 72 78 C 95 80 110 78 114 70 C 118 55 116 30 105 20 Z" fill="url(#crownGrad)" />
      <path d="M 124 20 C 122 50 120 70 128 78 C 152 80 170 78 174 70 C 178 50 175 30 165 20 Z" fill="url(#crownGrad)" />
      {/* Pulp chambers */}
      <circle cx="40" cy="55" r="5" fill="#090d14" />
      <circle cx="90" cy="52" r="7" fill="#090d14" />
      <circle cx="148" cy="52" r="7" fill="#090d14" />
    </g>
    {/* Lower Molars & Premolars */}
    <g>
      <path d="M 28 84 C 20 95 20 120 26 138 C 38 142 50 142 56 135 C 60 120 58 95 54 84 Z" fill="url(#crownGrad)" />
      <path d="M 66 84 C 60 95 62 120 70 142 C 90 146 108 144 114 135 C 118 118 116 95 110 84 Z" fill="url(#crownGrad)" />
      <path d="M 122 84 C 118 95 118 120 126 142 C 146 146 166 144 172 135 C 176 118 174 95 168 84 Z" fill="url(#crownGrad)" />
      {/* Pulp chambers */}
      <circle cx="42" cy="108" r="5" fill="#090d14" />
      <circle cx="92" cy="112" r="7" fill="#090d14" />
      <circle cx="146" cy="112" r="7" fill="#090d14" />
    </g>
  </svg>
);

const BitewingRightXRay = () => (
  <svg viewBox="0 0 200 160" style={{ width: "100%", height: "100%", display: "block" }}>
    <defs>
      <radialGradient id="bwRightBg" cx="50%" cy="50%" r="75%">
        <stop offset="0%" stopColor="#1e222b" />
        <stop offset="50%" stopColor="#11141a" />
        <stop offset="100%" stopColor="#050608" />
      </radialGradient>
      <linearGradient id="crownRightGrad" x1="100%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#e2e8f0" stopOpacity="0.95" />
        <stop offset="50%" stopColor="#94a3b8" stopOpacity="0.8" />
        <stop offset="100%" stopColor="#475569" stopOpacity="0.5" />
      </linearGradient>
    </defs>
    <rect width="200" height="160" fill="url(#bwRightBg)" />
    <path d="M 10 80 Q 100 78 190 81" stroke="#050608" strokeWidth="4" />
    {/* Upper Molars & Premolars */}
    <g>
      <path d="M 30 20 C 24 50 22 70 32 78 C 55 80 72 78 76 70 C 80 50 78 30 68 20 Z" fill="url(#crownRightGrad)" />
      <path d="M 86 20 C 82 50 84 70 92 78 C 115 80 130 78 134 70 C 138 55 136 30 125 20 Z" fill="url(#crownRightGrad)" />
      <path d="M 145 25 C 140 50 142 70 148 78 C 165 80 178 78 182 70 C 185 55 182 35 174 25 Z" fill="url(#crownRightGrad)" />
      <circle cx="54" cy="52" r="7" fill="#090d14" />
      <circle cx="110" cy="52" r="7" fill="#090d14" />
      <circle cx="162" cy="55" r="5" fill="#090d14" />
    </g>
    {/* Lower Molars & Premolars */}
    <g>
      <path d="M 28 84 C 22 95 24 120 32 142 C 52 146 72 144 78 135 C 82 118 80 95 74 84 Z" fill="url(#crownRightGrad)" />
      <path d="M 86 84 C 80 95 82 120 90 142 C 110 146 128 144 134 135 C 138 118 136 95 130 84 Z" fill="url(#crownRightGrad)" />
      <path d="M 144 84 C 140 95 142 120 148 138 C 160 142 172 142 178 135 C 182 120 180 95 174 84 Z" fill="url(#crownRightGrad)" />
      <circle cx="54" cy="112" r="7" fill="#090d14" />
      <circle cx="110" cy="112" r="7" fill="#090d14" />
      <circle cx="160" cy="108" r="5" fill="#090d14" />
    </g>
  </svg>
);

const getResolvedSrc = (item) => {
  if (!item) return "";
  if (typeof item === "string") return item;
  return item.url || item.fileUrl || item.path || item.preview || "";
};

// ─── Realistic X-Ray Mount Tile ──────────────────────────────
const RadiographFrame = ({
  imageSrc,
  fallbackComponent: FallbackComponent,
  date = "10/15/2026",
  isSelected,
  onClick,
  width = 175,
  height = 145,
  zoom = 1,
  rotation = 0,
  isInverted = false,
  brightness = 100,
  contrast = 100,
}) => {
  const resolvedSrc = getResolvedSrc(imageSrc);

  return (
    <Box
      onClick={onClick}
      sx={{
        width,
        height,
        position: "relative",
        cursor: "pointer",
        userSelect: "none",
        transition: "all 0.15s ease",
        transform: `scale(${zoom}) rotate(${rotation}deg)`,
        filter: `${isInverted ? "invert(1)" : ""} brightness(${brightness}%) contrast(${contrast}%)`,
        border: isSelected ? "2.5px solid #2563eb" : "1.5px solid #1e293b",
        boxShadow: isSelected ? "0 0 15px rgba(37, 99, 235, 0.45)" : "0 4px 15px rgba(0,0,0,0.6)",
        // Clipped / chamfered sensor corners matching digital dental sensors
        clipPath:
          "polygon(8% 0%, 92% 0%, 100% 8%, 100% 92%, 92% 100%, 8% 100%, 0% 92%, 0% 8%)",
        backgroundColor: "#05070a",
        overflow: "hidden",
        "&:hover": {
          borderColor: isSelected ? "#2563eb" : "#475569",
        },
      }}
    >
      {/* Content image or SVG fallback */}
      <Box sx={{ width: "100%", height: "100%", overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center", backgroundColor: "#020408" }}>
        {resolvedSrc ? (
          <Box
            component="img"
            src={resolvedSrc}
            alt="Radiograph"
            sx={{ width: "100%", height: "100%", objectFit: "contain" }}
          />
        ) : FallbackComponent ? (
          <FallbackComponent />
        ) : (
          <BitewingLeftXRay />
        )}
      </Box>

      {/* Sensor bottom metadata bar matching screenshot */}
      <Box
        sx={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: 18,
          backgroundColor: "rgba(10, 18, 30, 0.85)",
          backdropFilter: "blur(4px)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          px: 1,
          color: "#94a3b8",
          fontSize: "10px",
          fontFamily: "Inter",
          fontWeight: 600,
          zIndex: 2,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
          {/* Mini tooth pin indicator */}
          <Box
            sx={{
              width: 6,
              height: 6,
              borderRadius: "50%",
              backgroundColor: "#38bdf8",
            }}
          />
        </Box>
        <Typography sx={{ fontSize: "9.5px", color: "#cbd5e1", fontFamily: "Inter", letterSpacing: "0.2px" }}>
          {date}
        </Typography>
        <FullscreenIcon sx={{ fontSize: 11, opacity: 0.7 }} />
      </Box>
    </Box>
  );
};

// ─── Main ImagingMountEditorDialog Component ───────────────────
const ImagingMountEditorDialog = ({
  open,
  onClose,
  mount,
  patient,
  allMounts = [],
  onSelectMount,
  onSave,
}) => {
  const { showSnackbar } = useSnackbar();

  // Active Tool & Canvas State
  const [activeTool, setActiveTool] = useState("select");
  const [selectedFrameIndex, setSelectedFrameIndex] = useState(0);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [isInverted, setIsInverted] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [brightness, setBrightness] = useState(100);
  const [contrast, setContrast] = useState(100);
  const [viewMode, setViewMode] = useState("mount"); // "mount" | "single" | "split" | "quad"

  // Menus & Popovers
  const [mountDropdownAnchor, setMountDropdownAnchor] = useState(null);
  const [filterMenuAnchor, setFilterMenuAnchor] = useState(null);
  const [tuneAnchor, setTuneAnchor] = useState(null);
  const fileInputRef = useRef(null);

  const displayName = useMemo(() => {
    if (!patient) return "Finley Mathews";
    return [patient.FName || patient.firstName, patient.LName || patient.lastName]
      .filter(Boolean)
      .join(" ") || "Selected Patient";
  }, [patient]);

  const activeMount = useMemo(
    () =>
      mount || {
        id: "active",
        name: "4 BW",
        createdAt: "10/15/2026",
        content: "4 images",
        layout: "4 BW",
      },
    [mount]
  );

  const [addedImages, setAddedImages] = useState({});
  const mountImages = useMemo(() => {
    const base = activeMount.images || [];
    const extra = addedImages[activeMount.id] || [];
    return [...base, ...extra];
  }, [activeMount.id, activeMount.images, addedImages]);

  const handleAddImages = (e) => {
    const selectedFiles = Array.from(e.target.files || []);
    if (!selectedFiles.length) return;
    const newUrls = selectedFiles.map((f) => URL.createObjectURL(f));
    setAddedImages((prev) => ({
      ...prev,
      [activeMount.id]: [...(prev[activeMount.id] || []), ...newUrls],
    }));
    const nextImages = [...mountImages, ...newUrls];
    const updatedMount = {
      ...activeMount,
      images: nextImages,
      content: `${nextImages.length} X-Ray${nextImages.length === 1 ? "" : "s"}`,
    };
    if (onSave) onSave(updatedMount);
    showSnackbar(`Added ${selectedFiles.length} image(s) to mount`, "success");
  };

  const handleZoomIn = () => setZoomLevel((z) => Math.min(2.5, +(z + 0.15).toFixed(2)));
  const handleZoomOut = () => setZoomLevel((z) => Math.max(0.4, +(z - 0.15).toFixed(2)));
  const handleResetZoom = () => setZoomLevel(1);

  const handleRotate = () => setRotation((r) => (r + 90) % 360);
  const handleInvert = () => {
    setIsInverted((inv) => !inv);
    showSnackbar(isInverted ? "Color inversion off" : "Color inversion enabled", "info");
  };

  const handleResetAdjustments = () => {
    setBrightness(100);
    setContrast(100);
    setRotation(0);
    setIsInverted(false);
    setZoomLevel(1);
    showSnackbar("Display reset to default", "info");
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullScreen
      sx={{
        zIndex: 1350, // Above fixed app header (1302)
      }}
      PaperProps={{
        sx: {
          backgroundColor: "#000000",
          color: "#ffffff",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
        },
      }}
    >
      {/* ─── Top Navigation Bar ─────────────────────────────── */}
      <Box
        sx={{
          height: 48,
          backgroundColor: "#060d1a",
          borderBottom: "1px solid #142033",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          px: 2,
          zIndex: 10,
          flexShrink: 0,
        }}
      >
        {/* Left: Patient Name, Mount Dropdown Pill & Add (+) Button */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.75 }}>
          <Typography
            sx={{
              fontFamily: "Inter",
              fontSize: "14px",
              fontWeight: 600,
              color: "#ffffff",
              letterSpacing: "0.2px",
            }}
          >
            {displayName}
          </Typography>

          {/* Mount Pill Dropdown */}
          <Box
            onClick={(e) => setMountDropdownAnchor(e.currentTarget)}
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 2,
              backgroundColor: "#0a1322",
              border: "1px solid #1c2c44",
              borderRadius: "6px",
              px: 1.5,
              py: "4px",
              cursor: "pointer",
              transition: "all 0.15s ease",
              "&:hover": { backgroundColor: "#101d33", borderColor: "#273d60" },
            }}
          >
            <Typography sx={{ fontFamily: "Inter", fontSize: "12px", fontWeight: 700, color: "#ffffff" }}>
              {activeMount.name || activeMount.layout || "4 BW"}
            </Typography>
            <Typography sx={{ fontFamily: "Inter", fontSize: "12px", color: "#94a3b8" }}>
              {activeMount.createdAt || "10/15/2026"}
            </Typography>
            <Typography sx={{ fontFamily: "Inter", fontSize: "12px", color: "#94a3b8" }}>
              {(() => {
                const count = mountImages.length || 4;
                return `${count} Images`;
              })()}
            </Typography>
            <ArrowDownIcon sx={{ fontSize: 16, color: "#94a3b8" }} />
          </Box>

          {/* Add (+) circular blue button */}
          <Tooltip title="Add New Radiograph / Upload Image">
            <IconButton
              size="small"
              onClick={() => fileInputRef.current?.click()}
              sx={{
                width: 22,
                height: 22,
                backgroundColor: "#3b82f6",
                color: "#ffffff",
                borderRadius: "50%",
                p: 0,
                "&:hover": { backgroundColor: "#2563eb" },
              }}
            >
              <AddIcon sx={{ fontSize: 16 }} />
            </IconButton>
          </Tooltip>
          <input
            type="file"
            ref={fileInputRef}
            accept="image/*"
            multiple
            style={{ display: "none" }}
            onChange={handleAddImages}
          />
        </Box>

        {/* Right Action Icons, View Controls, Divider & Done Button */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 0.75 }}>
          <Tooltip title="Duplicate Mount">
            <IconButton size="small" sx={{ color: "#94a3b8", "&:hover": { color: "#ffffff" } }}>
              <ContentCopyIcon sx={{ fontSize: 17 }} />
            </IconButton>
          </Tooltip>

          <Tooltip title="Archive Mount">
            <IconButton size="small" sx={{ color: "#94a3b8", "&:hover": { color: "#ffffff" } }}>
              <ArchiveIcon sx={{ fontSize: 17 }} />
            </IconButton>
          </Tooltip>

          <Tooltip title="Transfer Mount">
            <IconButton size="small" sx={{ color: "#94a3b8", "&:hover": { color: "#ffffff" } }}>
              <SwapHorizIcon sx={{ fontSize: 17 }} />
            </IconButton>
          </Tooltip>

          <Tooltip title="Export / Share">
            <IconButton size="small" sx={{ color: "#94a3b8", "&:hover": { color: "#ffffff" } }}>
              <ShareIcon sx={{ fontSize: 17 }} />
            </IconButton>
          </Tooltip>

          {/* First Divider */}
          <Box sx={{ width: "1px", height: 18, backgroundColor: "#1e2e47", mx: 0.5 }} />

          {/* View Preset Layout Icons */}
          <Tooltip title="Full Mount Series View">
            <IconButton
              size="small"
              onClick={() => setViewMode("mount")}
              sx={{
                color: viewMode === "mount" ? "#38bdf8" : "#94a3b8",
                backgroundColor: viewMode === "mount" ? "rgba(56, 189, 248, 0.15)" : "transparent",
                "&:hover": { color: "#ffffff" },
              }}
            >
              <TuneIcon sx={{ fontSize: 17 }} />
            </IconButton>
          </Tooltip>
          <Tooltip title="Single View">
            <IconButton
              size="small"
              onClick={() => setViewMode("single")}
              sx={{
                color: viewMode === "single" ? "#38bdf8" : "#94a3b8",
                backgroundColor: viewMode === "single" ? "rgba(56, 189, 248, 0.15)" : "transparent",
                "&:hover": { color: "#ffffff" },
              }}
            >
              <SingleViewIcon sx={{ fontSize: 17 }} />
            </IconButton>
          </Tooltip>
          <Tooltip title="Split Compare">
            <IconButton
              size="small"
              onClick={() => setViewMode("split")}
              sx={{
                color: viewMode === "split" ? "#38bdf8" : "#94a3b8",
                backgroundColor: viewMode === "split" ? "rgba(56, 189, 248, 0.15)" : "transparent",
                "&:hover": { color: "#ffffff" },
              }}
            >
              <SplitViewIcon sx={{ fontSize: 17 }} />
            </IconButton>
          </Tooltip>
          <Tooltip title="Quad View">
            <IconButton
              size="small"
              onClick={() => setViewMode("quad")}
              sx={{
                color: viewMode === "quad" ? "#38bdf8" : "#94a3b8",
                backgroundColor: viewMode === "quad" ? "rgba(56, 189, 248, 0.15)" : "transparent",
                "&:hover": { color: "#ffffff" },
              }}
            >
              <QuadViewIcon sx={{ fontSize: 17 }} />
            </IconButton>
          </Tooltip>

          {/* Second Divider before More Options */}
          <Box sx={{ width: "1px", height: 18, backgroundColor: "#1e2e47", mx: 0.5 }} />

          <Tooltip title="More Options">
            <IconButton
              size="small"
              onClick={(e) => setFilterMenuAnchor(e.currentTarget)}
              sx={{ color: "#94a3b8", "&:hover": { color: "#ffffff" } }}
            >
              <MoreVertIcon sx={{ fontSize: 17 }} />
            </IconButton>
          </Tooltip>

          {/* Done Button */}
          <Button
            variant="contained"
            disableElevation
            onClick={() => {
              if (onSave) {
                onSave({
                  ...activeMount,
                  images: mountImages,
                  content: `${mountImages.length || activeMount.images?.length || 4} Images`,
                });
              }
              onClose();
            }}
            sx={{
              ml: 1,
              textTransform: "none",
              borderRadius: "6px",
              fontFamily: "Inter",
              fontSize: "13px",
              fontWeight: 600,
              px: 2.2,
              height: 30,
              backgroundColor: "#2563eb",
              "&:hover": { backgroundColor: "#1d4ed8" },
            }}
          >
            Done
          </Button>
        </Box>
      </Box>

      {/* ─── Main Viewport Area with Left Floating Tool Palette ── */}
      <Box
        sx={{
          flex: 1,
          position: "relative",
          backgroundColor: "#000000",
          overflow: "hidden",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {/* Left Floating Tool Palette (Matching Screenshot) */}
        <Box
          sx={{
            position: "absolute",
            left: 14,
            top: 20,
            bottom: 20,
            width: 42,
            backgroundColor: "rgba(10, 18, 30, 0.82)",
            backdropFilter: "blur(10px)",
            borderRadius: "10px",
            border: "1px solid rgba(255, 255, 255, 0.08)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            py: 1,
            gap: "2px",
            zIndex: 10,
            boxShadow: "0 8px 32px rgba(0,0,0,0.5)",
          }}
        >
          {[
            { id: "database", title: "Patient Records", icon: DatabaseIcon },
            { id: "draw", title: "Pencil / Draw Annotation", icon: PencilIcon },
            { id: "ruler", title: "Measure Length", icon: RulerIcon },
            { id: "line", title: "Draw Line", icon: LineIcon },
            { id: "circle", title: "Circle Area", icon: CircleIcon },
            { id: "text", title: "Text Note", icon: TextIcon },
            { id: "arrow", title: "Pointer Arrow", icon: ArrowIcon },
            { id: "polygon", title: "Polygon / Angle", icon: PolygonIcon },
            { id: "pan", title: "Pan & Move", icon: PanIcon },
            { id: "contrast", title: "Invert Radiograph", icon: ContrastIcon, action: handleInvert },
            { id: "tune", title: "Brightness & Contrast Sliders", icon: TuneIcon, action: (e) => setTuneAnchor(e.currentTarget) },
            { id: "flip", title: "Flip / Mirror", icon: FlipIcon, action: () => showSnackbar("Image mirrored", "info") },
            { id: "rotate", title: "Rotate Clockwise", icon: RotateRightIcon, action: handleRotate },
            { id: "undo", title: "Reset All Adjustments", icon: UndoIcon, action: handleResetAdjustments },
          ].map((tool) => {
            const Icon = tool.icon;
            const isToolActive = activeTool === tool.id;
            return (
              <Tooltip key={tool.id} title={tool.title} placement="right">
                <IconButton
                  size="small"
                  onClick={(e) => {
                    setActiveTool(tool.id);
                    if (tool.action) tool.action(e);
                  }}
                  sx={{
                    width: 32,
                    height: 32,
                    color: isToolActive ? "#38bdf8" : "#94a3b8",
                    backgroundColor: isToolActive ? "rgba(56, 189, 248, 0.15)" : "transparent",
                    borderRadius: "6px",
                    "&:hover": {
                      color: "#ffffff",
                      backgroundColor: "rgba(255, 255, 255, 0.08)",
                    },
                  }}
                >
                  <Icon sx={{ fontSize: 17 }} />
                </IconButton>
              </Tooltip>
            );
          })}
        </Box>

        {/* ─── Mount Radiographic Canvas (Centered Matching Screenshot) ─── */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: "100%",
            height: "100%",
            p: 4,
          }}
        >
          {/* Dynamic Mount Radiographic View */}
          {viewMode === "single" ? (
            /* Single Enlarge View */
            <RadiographFrame
              imageSrc={mountImages[selectedFrameIndex]}
              fallbackComponent={
                selectedFrameIndex === 0
                  ? UpperAnteriorXRay
                  : selectedFrameIndex === 1
                  ? BitewingLeftXRay
                  : selectedFrameIndex === 2
                  ? BitewingRightXRay
                  : LowerAnteriorXRay
              }
              date={activeMount.createdAt || "10/15/2026"}
              isSelected={true}
              onClick={() => {}}
              width={460}
              height={380}
              zoom={zoomLevel}
              rotation={rotation}
              isInverted={isInverted}
              brightness={brightness}
              contrast={contrast}
            />
          ) : viewMode === "split" ? (
            /* Split 2-Frame Compare View */
            <Box sx={{ display: "flex", gap: "16px", alignItems: "center", justifyContent: "center" }}>
              <RadiographFrame
                imageSrc={mountImages[0]}
                fallbackComponent={UpperAnteriorXRay}
                date={activeMount.createdAt || "10/15/2026"}
                isSelected={selectedFrameIndex === 0}
                onClick={() => setSelectedFrameIndex(0)}
                width={260}
                height={220}
                zoom={zoomLevel}
                rotation={rotation}
                isInverted={isInverted}
                brightness={brightness}
                contrast={contrast}
              />
              <RadiographFrame
                imageSrc={mountImages[1]}
                fallbackComponent={BitewingLeftXRay}
                date={activeMount.createdAt || "10/15/2026"}
                isSelected={selectedFrameIndex === 1}
                onClick={() => setSelectedFrameIndex(1)}
                width={260}
                height={220}
                zoom={zoomLevel}
                rotation={rotation}
                isInverted={isInverted}
                brightness={brightness}
                contrast={contrast}
              />
            </Box>
          ) : viewMode === "quad" ? (
            /* Quad 4-Frame 2x2 View */
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: "repeat(2, auto)",
                gap: "12px",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {[0, 1, 2, 3].map((idx) => (
                <RadiographFrame
                  key={idx}
                  imageSrc={mountImages[idx]}
                  fallbackComponent={
                    idx === 0
                      ? UpperAnteriorXRay
                      : idx === 1
                      ? BitewingLeftXRay
                      : idx === 2
                      ? BitewingRightXRay
                      : LowerAnteriorXRay
                  }
                  date={activeMount.createdAt || "10/15/2026"}
                  isSelected={selectedFrameIndex === idx}
                  onClick={() => setSelectedFrameIndex(idx)}
                  width={210}
                  height={165}
                  zoom={zoomLevel}
                  rotation={rotation}
                  isInverted={isInverted}
                  brightness={brightness}
                  contrast={contrast}
                />
              ))}
            </Box>
          ) : activeMount.layout === "2 BW/PA" || (mountImages.length === 2 && activeMount.layout !== "4 BW") ? (
            /* 2 Bitewings / PA side by side */
            <Box sx={{ display: "flex", gap: "16px", alignItems: "center", justifyContent: "center" }}>
              <RadiographFrame
                imageSrc={mountImages[0]}
                fallbackComponent={BitewingLeftXRay}
                date={activeMount.createdAt || "10/15/2026"}
                isSelected={selectedFrameIndex === 0}
                onClick={() => setSelectedFrameIndex(0)}
                width={220}
                height={170}
                zoom={zoomLevel}
                rotation={rotation}
                isInverted={isInverted}
                brightness={brightness}
                contrast={contrast}
              />
              <RadiographFrame
                imageSrc={mountImages[1]}
                fallbackComponent={BitewingRightXRay}
                date={activeMount.createdAt || "10/15/2026"}
                isSelected={selectedFrameIndex === 1}
                onClick={() => setSelectedFrameIndex(1)}
                width={220}
                height={170}
                zoom={zoomLevel}
                rotation={rotation}
                isInverted={isInverted}
                brightness={brightness}
                contrast={contrast}
              />
            </Box>
          ) : activeMount.layout === "Grid" || mountImages.length > 4 ? (
            /* Flexible Grid Layout */
            <Box
              sx={{
                display: "flex",
                flexWrap: "wrap",
                gap: "12px",
                maxWidth: 860,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {(mountImages.length > 0 ? mountImages : [0, 1, 2, 3]).map((item, idx) => (
                <RadiographFrame
                  key={idx}
                  imageSrc={mountImages.length > 0 ? item : undefined}
                  fallbackComponent={
                    idx % 4 === 0
                      ? UpperAnteriorXRay
                      : idx % 4 === 1
                      ? BitewingLeftXRay
                      : idx % 4 === 2
                      ? BitewingRightXRay
                      : LowerAnteriorXRay
                  }
                  date={activeMount.createdAt || "10/15/2026"}
                  isSelected={selectedFrameIndex === idx}
                  onClick={() => setSelectedFrameIndex(idx)}
                  width={195}
                  height={150}
                  zoom={zoomLevel}
                  rotation={rotation}
                  isInverted={isInverted}
                  brightness={brightness}
                  contrast={contrast}
                />
              ))}
            </Box>
          ) : (
            /* Default Cross Mount Format (Matches 4 BW layout in screenshot) */
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "8px",
                userSelect: "none",
              }}
            >
              {/* Top Tile: Upper Anterior PA */}
              <RadiographFrame
                imageSrc={mountImages[0]}
                fallbackComponent={UpperAnteriorXRay}
                date={activeMount.createdAt || "10/15/2026"}
                isSelected={selectedFrameIndex === 0}
                onClick={() => setSelectedFrameIndex(0)}
                width={165}
                height={190}
                zoom={zoomLevel}
                rotation={rotation}
                isInverted={isInverted}
                brightness={brightness}
                contrast={contrast}
              />

              {/* Middle Row: Left Bitewing & Right Bitewing */}
              <Box sx={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <RadiographFrame
                  imageSrc={mountImages[1]}
                  fallbackComponent={BitewingLeftXRay}
                  date={activeMount.createdAt || "10/15/2026"}
                  isSelected={selectedFrameIndex === 1}
                  onClick={() => setSelectedFrameIndex(1)}
                  width={195}
                  height={150}
                  zoom={zoomLevel}
                  rotation={rotation}
                  isInverted={isInverted}
                  brightness={brightness}
                  contrast={contrast}
                />
                <RadiographFrame
                  imageSrc={mountImages[2]}
                  fallbackComponent={BitewingRightXRay}
                  date={activeMount.createdAt || "10/15/2026"}
                  isSelected={selectedFrameIndex === 2}
                  onClick={() => setSelectedFrameIndex(2)}
                  width={195}
                  height={150}
                  zoom={zoomLevel}
                  rotation={rotation}
                  isInverted={isInverted}
                  brightness={brightness}
                  contrast={contrast}
                />
              </Box>

              {/* Bottom Tile: Lower Anterior PA */}
              <RadiographFrame
                imageSrc={mountImages[3]}
                fallbackComponent={LowerAnteriorXRay}
                date={activeMount.createdAt || "10/15/2026"}
                isSelected={selectedFrameIndex === 3}
                onClick={() => setSelectedFrameIndex(3)}
                width={165}
                height={190}
                zoom={zoomLevel}
                rotation={rotation}
                isInverted={isInverted}
                brightness={brightness}
                contrast={contrast}
              />
            </Box>
          )}
        </Box>

        {/* ─── Bottom Right Zoom Controls (Matching Screenshot) ─── */}
        <Box
          sx={{
            position: "absolute",
            right: 20,
            bottom: 20,
            backgroundColor: "rgba(10, 18, 30, 0.82)",
            backdropFilter: "blur(8px)",
            borderRadius: "20px",
            border: "1px solid rgba(255, 255, 255, 0.08)",
            display: "flex",
            alignItems: "center",
            px: 1.5,
            py: "4px",
            gap: 0.5,
            zIndex: 10,
            boxShadow: "0 4px 20px rgba(0,0,0,0.5)",
          }}
        >
          <Tooltip title="Zoom Out">
            <IconButton size="small" onClick={handleZoomOut} sx={{ color: "#94a3b8", "&:hover": { color: "#ffffff" } }}>
              <ZoomOutIcon sx={{ fontSize: 18 }} />
            </IconButton>
          </Tooltip>

          <Tooltip title="Zoom In">
            <IconButton size="small" onClick={handleZoomIn} sx={{ color: "#94a3b8", "&:hover": { color: "#ffffff" } }}>
              <ZoomInIcon sx={{ fontSize: 18 }} />
            </IconButton>
          </Tooltip>

          <Tooltip title="Fit Screen (Reset)">
            <IconButton size="small" onClick={handleResetZoom} sx={{ color: "#94a3b8", "&:hover": { color: "#ffffff" } }}>
              <FitScreenIcon sx={{ fontSize: 16 }} />
            </IconButton>
          </Tooltip>

          <Typography
            sx={{
              fontFamily: "Inter",
              fontSize: "12px",
              fontWeight: 600,
              color: "#cbd5e1",
              minWidth: 42,
              textAlign: "center",
              ml: 0.5,
            }}
          >
            {Math.round(zoomLevel * 50)}%
          </Typography>
        </Box>
      </Box>

      {/* ─── Mount Switcher Dropdown Menu ──────────────────── */}
      <Menu
        anchorEl={mountDropdownAnchor}
        open={Boolean(mountDropdownAnchor)}
        onClose={() => setMountDropdownAnchor(null)}
        sx={{ zIndex: 1450 }}
        PaperProps={{
          sx: {
            mt: 0.5,
            backgroundColor: "#0d1624",
            color: "#ffffff",
            border: "1px solid #1e2e47",
            borderRadius: "8px",
            boxShadow: "0 10px 30px rgba(0,0,0,0.5)",
            minWidth: 260,
          },
        }}
      >
        <Box sx={{ px: 2, py: 1, borderBottom: "1px solid #1e2e47" }}>
          <Typography sx={{ fontFamily: "Inter", fontSize: "11px", fontWeight: 700, color: "#94a3b8", textTransform: "uppercase" }}>
            Patient Imaging Mounts
          </Typography>
        </Box>
        {allMounts.map((m) => {
          const isCurrent = m.id === activeMount.id;
          return (
            <MenuItem
              key={m.id}
              onClick={() => {
                if (onSelectMount) onSelectMount(m);
                setMountDropdownAnchor(null);
              }}
              sx={{
                py: 1,
                px: 2,
                backgroundColor: isCurrent ? "rgba(35, 98, 239, 0.2)" : "transparent",
                "&:hover": { backgroundColor: "rgba(255, 255, 255, 0.08)" },
              }}
            >
              <Box>
                <Typography sx={{ fontFamily: "Inter", fontSize: "13px", fontWeight: isCurrent ? 700 : 500, color: isCurrent ? "#38bdf8" : "#ffffff" }}>
                  {m.name || m.layout}
                </Typography>
                <Typography sx={{ fontFamily: "Inter", fontSize: "11px", color: "#94a3b8" }}>
                  {m.createdAt} • {m.content}
                </Typography>
              </Box>
            </MenuItem>
          );
        })}
      </Menu>

      {/* ─── Tune Popover (Brightness & Contrast Sliders) ────── */}
      <Popover
        open={Boolean(tuneAnchor)}
        anchorEl={tuneAnchor}
        onClose={() => setTuneAnchor(null)}
        sx={{ zIndex: 1450 }}
        anchorOrigin={{ vertical: "center", horizontal: "right" }}
        transformOrigin={{ vertical: "center", horizontal: "left" }}
        PaperProps={{
          sx: {
            ml: 1.5,
            p: 2.5,
            backgroundColor: "#0d1624",
            color: "#ffffff",
            border: "1px solid #1e2e47",
            borderRadius: "10px",
            boxShadow: "0 10px 40px rgba(0,0,0,0.6)",
            width: 250,
          },
        }}
      >
        <Typography sx={{ fontFamily: "Inter", fontSize: "12px", fontWeight: 700, mb: 2, color: "#38bdf8" }}>
          Image Adjustments
        </Typography>

        <Typography sx={{ fontFamily: "Inter", fontSize: "11px", color: "#94a3b8", mb: 0.5 }}>
          Brightness ({brightness}%)
        </Typography>
        <Slider
          size="small"
          value={brightness}
          min={50}
          max={180}
          onChange={(e, val) => setBrightness(val)}
          sx={{ color: "#38bdf8", mb: 2 }}
        />

        <Typography sx={{ fontFamily: "Inter", fontSize: "11px", color: "#94a3b8", mb: 0.5 }}>
          Contrast ({contrast}%)
        </Typography>
        <Slider
          size="small"
          value={contrast}
          min={50}
          max={200}
          onChange={(e, val) => setContrast(val)}
          sx={{ color: "#38bdf8", mb: 2 }}
        />

        <Button
          fullWidth
          size="small"
          onClick={() => {
            setBrightness(100);
            setContrast(100);
          }}
          sx={{
            textTransform: "none",
            fontFamily: "Inter",
            fontSize: "11px",
            color: "#94a3b8",
            border: "1px solid #1e2e47",
            "&:hover": { color: "#ffffff", backgroundColor: "rgba(255, 255, 255, 0.05)" },
          }}
        >
          Reset Sliders
        </Button>
      </Popover>

      {/* ─── Extra Options Menu ─────────────────────────────── */}
      <Menu
        anchorEl={filterMenuAnchor}
        open={Boolean(filterMenuAnchor)}
        onClose={() => setFilterMenuAnchor(null)}
        sx={{ zIndex: 1450 }}
        PaperProps={{
          sx: {
            backgroundColor: "#0d1624",
            color: "#ffffff",
            border: "1px solid #1e2e47",
            borderRadius: "8px",
          },
        }}
      >
        <MenuItem onClick={() => { handleRotate(); setFilterMenuAnchor(null); }}>
          Rotate Mount 90°
        </MenuItem>
        <MenuItem onClick={() => { handleInvert(); setFilterMenuAnchor(null); }}>
          Toggle Invert Colors
        </MenuItem>
        <MenuItem onClick={() => { handleResetAdjustments(); setFilterMenuAnchor(null); }}>
          Reset All Display Filters
        </MenuItem>
      </Menu>
    </Dialog>
  );
};

export default ImagingMountEditorDialog;
