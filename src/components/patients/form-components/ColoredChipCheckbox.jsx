import { Box, Typography } from "@mui/material";
import { COLORS } from "../../../constants/colors";
import { radius, fontSize, fontWeight } from "../../../constants/styles";

const ColoredChipCheckbox = ({ checked, onChange, label, shape = "square", sx = {} }) => {
  const isCircle = shape === "circle";

  return (
    <Box
      onClick={() => onChange(!checked)}
      sx={{
        display: "flex", alignItems: "center", width: "100%", cursor: "pointer",
        p: "10px 14px", borderRadius: radius.md, minHeight: "44px",
        transition: "all 0.2s ease-in-out",
        ...(checked
          ? { backgroundColor: COLORS.ACCENT_BG, border: `1.2px solid ${COLORS.ACCENT}`, color: COLORS.ACCENT }
          : { backgroundColor: COLORS.SURFACE_INPUT, border: "1.2px solid transparent", color: COLORS.TEXT_BODY, "&:hover": { backgroundColor: COLORS.BORDER } }
        ),
        ...sx
      }}
    >
      <Box
        sx={{
          width: 18, height: 18, borderRadius: isCircle ? "50%" : "4px", flexShrink: 0,
          display: "flex", alignItems: "center", justifyContent: "center", mr: 1.5,
          ...(checked
            ? { backgroundColor: isCircle ? COLORS.WHITE : COLORS.ACCENT, border: isCircle ? `5px solid ${COLORS.ACCENT}` : `1px solid ${COLORS.ACCENT}` }
            : { backgroundColor: COLORS.WHITE, border: `1px solid ${COLORS.TEXT_MUTED}` }
          )
        }}
      >
        {checked && !isCircle && (
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={COLORS.WHITE} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12"></polyline>
          </svg>
        )}
      </Box>
      <Typography sx={{ fontFamily: "Inter", fontSize: fontSize.md, fontWeight: fontWeight.medium, lineHeight: 1.3 }}>
        {label}
      </Typography>
    </Box>
  );
};

export default ColoredChipCheckbox;
