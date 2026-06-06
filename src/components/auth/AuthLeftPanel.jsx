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
      {/* Figma: 476×28px, top: 52px, left: 52px */}
      <Box
        sx={{
          position: "absolute",
          top: 52,
          left: 52,
          height: 28,
          display: "flex",
          alignItems: "center",
          gap: "8px",
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
            lineHeight: "28px",
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
        {/* Figma: 420×135px, Manrope 800 ExtraBold, 42px, lh 44.94px, ls -0.84px */}
        <Typography
          component="h2"
          sx={{
            fontFamily: "Manrope, sans-serif",
            fontWeight: 800,
            fontSize: "42px",
            lineHeight: "44.94px",
            color: "#ffffff",
            mb: "21px",
            letterSpacing: "-0.84px",
          }}
        >
          The clinical operating system for modern dentistry.
        </Typography>

        {/* Sub-copy */}
        {/* Figma: 420×70px, Manrope 400 Regular, 14px, lh 23.1px, ls 0% */}
        <Typography
          sx={{
            fontFamily: "Manrope, sans-serif",
            fontWeight: 400,
            fontSize: "14px",
            lineHeight: "23.1px",
            color: "rgba(255, 255, 255, 0.65)",
            mb: "38px",
            letterSpacing: 0,
          }}
        >
          Unified patient records, precision charting, intelligent scheduling,
          and automated insurance — in one calm, fast interface.
        </Typography>

        {/* Stats Row */}
        <AuthStatsRow />
      </Box>

      {/* ── Footer Bar ── */}
      {/* Figma: 476×13.2px, top: 754.8px, left: 52px → bottom: 52px (820-754.8-13.2) */}
      <Box
        sx={{
          position: "absolute",
          bottom: "52px",
          left: "52px",
          width: "476px",
          height: "13.2px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          zIndex: 2,
        }}
      >
        <Typography
          sx={{
            fontFamily: "Manrope, sans-serif",
            fontWeight: 400,
            fontSize: "11px",
            lineHeight: "13.2px",
            color: "rgba(255, 255, 255, 0.4)",
            letterSpacing: "0.04em",
          }}
        >
          HIPAA &nbsp;·&nbsp; SOC 2 &nbsp;·&nbsp; AES-256
        </Typography>
        <Typography
          sx={{
            fontFamily: "Manrope, sans-serif",
            fontWeight: 400,
            fontSize: "11px",
            lineHeight: "13.2px",
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
