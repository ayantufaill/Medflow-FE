import { Box, IconButton, Typography } from "@mui/material";

/* ── uppercase section label ──────────────────────────────── */
export const SL = ({ children }) => (
  <Typography sx={{
    fontFamily: "Inter", fontSize: "9px", fontWeight: 700,
    color: "#9aa3ae", letterSpacing: "0.7px", textTransform: "uppercase", mb: "4px",
  }}>
    {children}
  </Typography>
);

/* ── thin vertical divider (header) ──────────────────────── */
export const VDiv = () => (
  <Box sx={{ width: "1px", height: "22px", backgroundColor: "#dde1e7", flexShrink: 0, mx: "2px" }} />
);

/* ── icon button used in the header action strip ──────────── */
export const ActionBtn = ({ icon, title, active }) => (
  <IconButton title={title} size="small" sx={{
    width: "26px", height: "26px", borderRadius: "6px", p: 0,
    color: active ? "#2262ef" : "#6b7280",
    backgroundColor: active ? "rgba(34,98,239,0.10)" : "transparent",
    "& .MuiSvgIcon-root": { fontSize: "15px" },
    "&:hover": { backgroundColor: active ? "rgba(34,98,239,0.15)" : "rgba(0,0,0,0.06)" },
  }}>
    {icon}
  </IconButton>
);

/* ── letter badge (P/H/T colored, F/D neutral) ───────────── */
const BADGE_STYLES = {
  P: { bg: "#dbeafe", text: "#2262ef" },
  H: { bg: "#dcfce7", text: "#16a34a" },
  T: { bg: "#fef3c7", text: "#d97706" },
};

export const LetterBadge = ({ letter }) => {
  const s = BADGE_STYLES[letter] || { bg: "#f1f5f9", text: "#64748b" };
  return (
    <Box sx={{
      px: "7px", height: "20px", borderRadius: "10px",
      backgroundColor: s.bg,
      display: "flex", alignItems: "center", justifyContent: "center",
    }}>
      <Typography sx={{ fontFamily: "Inter", fontSize: "10px", fontWeight: 600, color: s.text }}>
        {letter}
      </Typography>
    </Box>
  );
};

/* ── note line with left icon ─────────────────────────────── */
export const NoteLine = ({ icon, text, iconColor }) => (
  <Box sx={{ display: "flex", alignItems: "center", gap: "6px", mb: "4px" }}>
    <Box sx={{ color: iconColor || "#9aa3ae", display: "flex", alignItems: "center", flexShrink: 0 }}>
      {icon}
    </Box>
    <Typography sx={{ fontFamily: "Inter", fontSize: "11px", color: "#374151" }}>{text}</Typography>
  </Box>
);

/* ── contact line with left icon + text truncation ────────── */
export const ContactLine = ({ icon, text, color }) => (
  <Box sx={{ display: "flex", alignItems: "center", gap: "6px", mb: "4px", overflow: "hidden" }}>
    <Box sx={{ color: color || "#9aa3ae", display: "flex", flexShrink: 0 }}>{icon}</Box>
    <Typography sx={{
      fontFamily: "Inter", fontSize: "11px", color: color || "#374151",
      overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
    }}>
      {text}
    </Typography>
  </Box>
);

/* ── appointment block (label with icon, date·time, provider) */
export const ApptBlock = ({ label, date, time, provider, icon }) => (
  <Box sx={{ flex: 1 }}>
    <Box sx={{ display: "flex", alignItems: "center", gap: "4px", mb: "3px" }}>
      {icon && <Box sx={{ color: "#9aa3ae", display: "flex", flexShrink: 0 }}>{icon}</Box>}
      <SL>{label}</SL>
    </Box>
    <Typography sx={{ fontFamily: "Inter", fontSize: "11px", fontWeight: 600, color: "#09121f" }}>
      {date} · {time}
    </Typography>
    {provider && (
      <Typography sx={{ fontFamily: "Inter", fontSize: "10px", color: "#9aa3ae", mt: "1px" }}>{provider}</Typography>
    )}
  </Box>
);

/* ── shared sx for provider Select dropdowns ──────────────── */
export const selectSx = {
  fontFamily: "Inter", fontSize: "11px", color: "#6b7280",
  borderRadius: "8px",
  "& .MuiOutlinedInput-notchedOutline": { borderColor: "#e0e5eb" },
  "& .MuiSelect-select": { py: "6px", pl: "8px", display: "flex", alignItems: "center", gap: "6px" },
};
