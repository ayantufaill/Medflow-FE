import { Box, Chip, Typography } from "@mui/material";
import { COLORS } from "../../../constants/colors";
import { radius, fontSize, fontWeight } from "../../../constants/styles";

const SectionCard = ({ icon: Icon, title, subtitle, badge, children, sx = {} }) => (
  <Box
    sx={{
      backgroundColor: COLORS.SURFACE_CARD,
      borderRadius: radius.xl,
      border: `0.8px solid ${COLORS.BORDER}`,
      p: { xs: 2, sm: 2.5 },
      mb: 3,
      ...sx,
    }}
  >
    {/* Header */}
    <Box
      sx={{
        display: "flex",
        alignItems: "flex-start",
        justifyContent: "space-between",
        mb: 2.5,
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
        {Icon && (
          <Box
            sx={{
              width: 40,
              height: 40,
              borderRadius: "50%",
              backgroundColor: COLORS.SURFACE_INPUT,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <Icon sx={{ fontSize: 20, color: COLORS.TEXT_SECONDARY }} />
          </Box>
        )}
        <Box>
          <Typography
            sx={{
              fontFamily: "Inter",
              fontWeight: fontWeight.semibold,
              fontSize: fontSize.lg,
              color: COLORS.TEXT_PRIMARY,
              lineHeight: 1.3,
            }}
          >
            {title}
          </Typography>
          {subtitle && (
            <Typography
              sx={{
                fontFamily: "Inter",
                fontSize: fontSize.base,
                color: COLORS.TEXT_MUTED,
                lineHeight: 1.3,
                mt: 0.25,
              }}
            >
              {subtitle}
            </Typography>
          )}
        </Box>
      </Box>
      {badge && (
        <Chip
          label={badge === "required" ? "REQUIRED" : "OPTIONAL"}
          size="small"
          sx={{
            fontFamily: "Inter",
            fontWeight: fontWeight.semibold,
            fontSize: fontSize.xs,
            letterSpacing: "0.5px",
            height: 24,
            backgroundColor: badge === "required" ? COLORS.ACCENT_BG : COLORS.SURFACE_INPUT,
            color: badge === "required" ? COLORS.ACCENT : COLORS.TEXT_MUTED,
            border: `1px solid ${badge === "required" ? "rgba(34, 98, 239, 0.3)" : COLORS.BORDER}`,
          }}
        />
      )}
    </Box>
    <Box sx={{ borderBottom: `1px solid ${COLORS.BORDER_LIGHT}`, mx: { xs: -2, sm: -2.5 }, mb: 3 }} />
    {children}
  </Box>
);

export default SectionCard;
