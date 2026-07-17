import { Box, Typography, Select, MenuItem } from "@mui/material";
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
export const FilterInput = ({ placeholder, endAdornment, value, onChange, type = "text" }) => (
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
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      sx={{
        flex: 1, border: "none", outline: "none",
        fontFamily: "Inter", fontSize: "13px", color: "#374151",
        backgroundColor: "transparent",
        "&::placeholder": { color: "#9aa3ae" },
        "&::-webkit-outer-spin-button, &::-webkit-inner-spin-button": {
          WebkitAppearance: "none",
          margin: 0,
        },
        "&[type=number]": {
          MozAppearance: "textfield",
        },
      }}
    />
    {endAdornment}
  </Box>
);

/* ── MUI select lookalike ──────────────────────────────────────── */
export const FilterSelect = ({ value, onChange, options = [] }) => (
  <Select 
    MenuProps={{ sx: { zIndex: 1700 } }}
    size="small" 
    fullWidth 
    displayEmpty
    value={value || ""}
    onChange={onChange}
    IconComponent={KeyboardArrowDown}
    sx={{ 
      fontFamily: "Inter", 
      fontSize: "13px", 
      borderRadius: "6px", 
      height: "36px",
      backgroundColor: "#fff",
      color: value ? "#374151" : "#9aa3ae",
      "& .MuiSelect-select": {
        paddingTop: "0",
        paddingBottom: "0",
        display: "flex",
        alignItems: "center",
        height: "100%",
        px: "10px",
      },
      "& .MuiSelect-icon": {
        color: "#9aa3ae",
        fontSize: "16px",
        right: "8px",
      },
      "& .MuiOutlinedInput-notchedOutline": {
        borderColor: "#d1d5db",
      },
      "&:hover .MuiOutlinedInput-notchedOutline": {
        borderColor: "#d1d5db",
      },
      "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
        borderColor: "#2262ef",
        borderWidth: "1px",
      }
    }}
  >
    <MenuItem value="" sx={{ fontFamily: "Inter", fontSize: "13px", color: "#374151" }}>All</MenuItem>
    {options.map(opt => (
      <MenuItem key={opt.value || opt} value={opt.value || opt} sx={{ fontFamily: "Inter", fontSize: "13px", color: "#374151" }}>
        {opt.label || opt}
      </MenuItem>
    ))}
  </Select>
);

/* ── procedure chip ────────────────────────────────────────── */
export const ProcChip = ({ label }) => (
  <Box sx={{ backgroundColor: "#e0f2fe", borderRadius: "4px", px: "7px", py: "2px" }}>
    <Typography sx={{ fontFamily: "Inter", fontSize: "11px", color: "#0369a1" }}>{label}</Typography>
  </Box>
);
