import { Box, Typography } from "@mui/material";

const TITLE_PREFIX = /^(dr|mr|mrs|ms|prof)\.?\s+/i;

function deriveInitials(name) {
  if (!name) return "?";
  return name
    .replace(TITLE_PREFIX, "")
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0].toUpperCase())
    .join("");
}

const InitialsAvatar = ({ name, initials, size = 40, fontSize = 13, bg = "#2262ef" }) => (
  <Box sx={{
    width: size, height: size, borderRadius: "50%",
    backgroundColor: bg,
    display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
  }}>
    <Typography sx={{ fontFamily: "Inter", fontSize, fontWeight: 700, color: "#fff", lineHeight: 1 }}>
      {initials || deriveInitials(name)}
    </Typography>
  </Box>
);

export default InitialsAvatar;
