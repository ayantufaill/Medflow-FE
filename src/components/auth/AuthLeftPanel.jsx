import { Box, Typography } from "@mui/material";
import AuthStatsRow from "./AuthStatsRow";

/**
 * AuthLeftPanel — Dark navy branding panel.
 * Contains: logo, decorative circle, headline, sub-copy, stats, footer bar.
 *
 * Figma specs:
 *   - bg: #082545
 *   - Circle: 682×682px, rgba(45,108,223,0.15), top: 69.2px, left: 240px
 *   - Content block: left: 52px, top: 261.94px, width: 420px
 */
const AuthLeftPanel = () => {
  return (
    <Box
      sx={{
        position: "relative",
        width: "100%",
        height: "100%",
        backgroundColor: "#082545",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* ── Logo Row ── */}
      <Box
        sx={{
          position: "absolute",
          top: 32,
          left: 32,
          display: "flex",
          alignItems: "center",
          gap: 1,
          zIndex: 2,
        }}
      >
        {/* Blue square logo icon */}
        <Box
          sx={{
            width: 20,
            height: 20,
            backgroundColor: "#2D6CDF",
            borderRadius: "4px",
            flexShrink: 0,
          }}
        />
        <Typography
          sx={{
            fontFamily: "Manrope, sans-serif",
            fontWeight: 700,
            fontSize: "18px",
            color: "#ffffff",
            letterSpacing: "-0.2px",
          }}
        >
          MedFlow
        </Typography>
      </Box>

      {/* ── Decorative Circle Overlay ── */}
      {/* Figma: 682×682px, top: 69.2px, left: 240px, rgba(45,108,223,0.15) */}
      <Box
        sx={{
          position: "absolute",
          width: 682,
          height: 682,
          borderRadius: "50%",
          backgroundColor: "rgba(45, 108, 223, 0.15)",
          top: "69.2px",
          left: "240px",
          zIndex: 1,
          pointerEvents: "none",
        }}
      />

      {/* ── Main Content Block ── */}
      {/* Figma: left: 52px, top: 261.94px, width: 420px */}
      <Box
        sx={{
          position: "absolute",
          left: 52,
          top: "261.94px",
          width: { md: "calc(100% - 72px)", lg: 420 },
          maxWidth: 420,
          zIndex: 2,
        }}
      >
        {/* Hero Headline */}
        <Typography
          component="h2"
          sx={{
            fontFamily: "Manrope, sans-serif",
            fontWeight: 700,
            fontSize: { md: "32px", lg: "40px" },
            lineHeight: 1.1,
            color: "#ffffff",
            mb: 2,
            letterSpacing: "-0.5px",
          }}
        >
          The clinical operating system for modern dentistry.
        </Typography>

        {/* Sub-copy */}
        <Typography
          sx={{
            fontFamily: "Manrope, sans-serif",
            fontWeight: 400,
            fontSize: "13px",
            lineHeight: 1.6,
            color: "rgba(255, 255, 255, 0.65)",
            mb: 0,
          }}
        >
          Unified patient records, precision charting, intelligent scheduling,
          and automated insurance — in one calm, fast interface.
        </Typography>

        {/* Stats Row */}
        <AuthStatsRow />
      </Box>

      {/* ── Footer Bar ── */}
      <Box
        sx={{
          position: "absolute",
          bottom: 24,
          left: 32,
          right: 32,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          zIndex: 2,
        }}
      >
        <Typography
          sx={{
            fontFamily: "Manrope, sans-serif",
            fontSize: "11px",
            color: "rgba(255, 255, 255, 0.4)",
            letterSpacing: "0.04em",
          }}
        >
          HIPAA &nbsp;·&nbsp; SOC 2 &nbsp;·&nbsp; AES-256
        </Typography>
        <Typography
          sx={{
            fontFamily: "Manrope, sans-serif",
            fontSize: "11px",
            color: "rgba(255, 255, 255, 0.4)",
          }}
        >
          v2.4.0
        </Typography>
      </Box>
    </Box>
  );
};

export default AuthLeftPanel;
