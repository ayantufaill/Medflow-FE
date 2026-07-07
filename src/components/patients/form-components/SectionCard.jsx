import { Box, Chip, Typography } from "@mui/material";
import { COLORS } from "../../../constants/colors";
import { radius, fontSize, fontWeight } from "../../../constants/styles";

// Card header uses a tinted strip + border-bottom, same treatment as the
// schedule module's card headers (RightPanelCard.jsx, AppointmentModalHeader.jsx)
// — SURFACE_TINT background, accent-tinted icon box, border-bottom separating
// header from body — instead of a plain white header blending into the card.
const SectionCard = ({ icon: Icon, title, subtitle, badge, children, sx = {} }) => (
  <Box
    sx={{
      backgroundColor: COLORS.SURFACE_CARD,
      borderRadius: radius.xl,
      border: `0.8px solid ${COLORS.BORDER}`,
      overflow: "hidden",
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
        backgroundColor: COLORS.SURFACE_TINT,
        borderBottom: `1px solid ${COLORS.BORDER}`,
        px: { xs: 2, sm: 2.5 },
        py: 2,
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
        {Icon && (
          <Box
            sx={{
              width: 40,
              height: 40,
              borderRadius: "50%",
              backgroundColor: COLORS.ACCENT_BG,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <Icon sx={{ fontSize: 20, color: COLORS.ACCENT }} />
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
                color: COLORS.TEXT_SECONDARY,
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

    {/* Body */}
    <Box sx={{ p: { xs: 2, sm: 2.5 } }}>
      {children}
    </Box>
  </Box>
);

export default SectionCard;
