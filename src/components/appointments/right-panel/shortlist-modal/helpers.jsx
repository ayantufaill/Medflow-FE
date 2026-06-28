import { Box, Typography } from "@mui/material";
import { KeyboardArrowDown } from "@mui/icons-material";
import { COL } from "./tableConfig";

/* ── table cell wrapper ────────────────────────────────────── */
export const Cell = ({ col, children, sx }) => (
  <Box sx={{ width: COL[col].width, flex: COL[col].flex, minWidth: COL[col].minWidth, flexShrink: 0, ...sx }}>
    {children}
  </Box>
);

/* ── small uppercase column header text ────────────────────── */
export const ColLabel = ({ children }) => (
  <Typography sx={{ fontFamily: "Inter", fontSize: "11px", fontWeight: 700, color: "#9aa3ae", letterSpacing: "0.4px", textTransform: "uppercase" }}>
    {children}
  </Typography>
);

/* ── tiny uppercase label above filter controls ─────────────── */
export const FilterLabel = ({ children }) => (
  <Typography sx={{ fontFamily: "Inter", fontSize: "10px", fontWeight: 600, color: "#9aa3ae", letterSpacing: "0.5px", textTransform: "uppercase", mb: "5px" }}>
    {children}
  </Typography>
);

/* ── plain bordered input with optional right adornment ─────── */
export const FilterInput = ({ placeholder, endAdornment }) => (
  <Box sx={{
    display: "flex", alignItems: "center",
    width: "100%",
    border: "1px solid #d1d5db",
    borderRadius: "6px",
    px: "10px", height: "36px",
    backgroundColor: "#fff",
    gap: "4px",
  }}>
    <Box
      component="input"
      placeholder={placeholder}
      sx={{
        flex: 1, border: "none", outline: "none",
        fontFamily: "Inter", fontSize: "13px", color: "#374151",
        backgroundColor: "transparent",
        "&::placeholder": { color: "#9aa3ae" },
      }}
    />
    {endAdornment}
  </Box>
);

/* ── select lookalike ──────────────────────────────────────── */
export const FilterSelect = ({ value = "All" }) => (
  <Box sx={{
    display: "flex", alignItems: "center", justifyContent: "space-between",
    width: "100%",
    border: "1px solid #d1d5db",
    borderRadius: "6px",
    px: "10px", height: "36px",
    backgroundColor: "#fff",
    cursor: "pointer",
  }}>
    <Typography sx={{ fontFamily: "Inter", fontSize: "13px", color: "#374151" }}>{value}</Typography>
    <KeyboardArrowDown sx={{ fontSize: "16px", color: "#9aa3ae" }} />
  </Box>
);

/* ── procedure chip ────────────────────────────────────────── */
export const ProcChip = ({ label }) => (
  <Box sx={{ backgroundColor: "#e0f2fe", borderRadius: "4px", px: "7px", py: "2px" }}>
    <Typography sx={{ fontFamily: "Inter", fontSize: "11px", color: "#0369a1" }}>{label}</Typography>
  </Box>
);
