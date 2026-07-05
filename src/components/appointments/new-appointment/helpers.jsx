import { Box, Checkbox, Typography } from "@mui/material";

export const Label = ({ children, sx }) => (
  <Typography sx={{ fontFamily: "Inter", fontSize: "12px", fontWeight: 500, color: "#374151", mb: "4px", ...sx }}>
    {children}
  </Typography>
);

export const FieldBox = ({ label, children, sx }) => (
  <Box sx={sx}>
    <Label>{label}</Label>
    {children}
  </Box>
);

export const SquareCheckbox = ({ checked, onChange, size = 16 }) => (
  <Checkbox
    size="small"
    checked={checked}
    onChange={onChange}
    icon={
      <Box component="span" sx={{
        display: "block", width: size, height: size,
        border: "1.5px solid #9aa3ae", borderRadius: "3px",
        backgroundColor: "transparent", flexShrink: 0,
      }} />
    }
    checkedIcon={
      <Box component="span" sx={{
        display: "flex", width: size, height: size,
        border: "1.5px solid #2262ef", borderRadius: "3px",
        backgroundColor: "#2262ef", alignItems: "center",
        justifyContent: "center", flexShrink: 0,
      }}>
        <Box component="span" sx={{
          display: "block", width: 9, height: 5,
          borderLeft: "2px solid #fff", borderBottom: "2px solid #fff",
          transform: "rotate(-45deg)", mt: "-2px",
        }} />
      </Box>
    }
    sx={{ p: "2px" }}
  />
);

export const providerLabel = (p) => {
  if (!p) return "";
  const u = p.userId || p;
  return [u.firstName, u.lastName].filter(Boolean).join(" ").trim() || p.providerCode || "";
};
