import { Box, Chip, Typography } from "@mui/material";
import { COLORS } from "../../constants/colors";
import { radius, fontSize, fontWeight } from "../../constants/styles";

// Preset badge tones — 'required'/'optional' (New Patient Intake form),
// 'verified' (e.g. Contact Information once phone/email are confirmed).
// Pass badge="verified" etc, or badge={{ label, color, bg, border }} for a
// one-off tone this list doesn't cover.
const BADGE_PRESETS = {
  required: { label: "REQUIRED", color: COLORS.ACCENT, bg: COLORS.ACCENT_BG, border: "rgba(34, 98, 239, 0.3)" },
  optional: { label: "OPTIONAL", color: COLORS.TEXT_MUTED, bg: COLORS.SURFACE_INPUT, border: COLORS.BORDER },
  verified: { label: "VERIFIED", color: COLORS.STATUS_SUCCESS, bg: "rgba(22, 163, 74, 0.10)", border: "rgba(22, 163, 74, 0.3)" },
};

// Generic card used for every boxed section across the app (New Patient
// Intake form, Patient Detail page, etc.) — icon + title + subtitle in a
// tinted header strip (matching the schedule module's card-header
// convention, see RightPanelCard.jsx/AppointmentModalHeader.jsx), optional
// tone badge or a custom header action (e.g. an "Add" button), and a padded
// body for the section's own content.
const SectionCard = ({ icon: Icon, title, subtitle, badge, action, children, sx = {} }) => {
  const badgeStyle = typeof badge === "string" ? BADGE_PRESETS[badge] : badge;

  return (
    <Box
      sx={{
        backgroundColor: COLORS.SURFACE_CARD,
        borderRadius: radius.xl,
        border: `0.8px solid ${COLORS.BORDER}`,
        overflow: "hidden",
        mb: 2,
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
        {action}
        {!action && badgeStyle && (
          <Chip
            label={badgeStyle.label}
            size="small"
            sx={{
              fontFamily: "Inter",
              fontWeight: fontWeight.semibold,
              fontSize: fontSize.xs,
              letterSpacing: "0.5px",
              height: 24,
              backgroundColor: badgeStyle.bg,
              color: badgeStyle.color,
              border: `1px solid ${badgeStyle.border}`,
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
};

export default SectionCard;
