import { Box, Typography } from "@mui/material";

/**
 * AuthStatsRow — Three metric stat blocks displayed in the left panel.
 *
 * Figma specs:
 *   - Row:    420×46.8px, no margin-top (gap handled by sub-copy mb: 38px)
 *   - Number: Manrope 700, 24px, lh 28px, #FFFFFF
 *   - Label:  Manrope 400, 11px, lh 16px, uppercase, rgba(255,255,255,0.6)
 *   - Gap between blocks: 32px
 */
const stats = [
  { value: "32k+", label: "PATIENT RECORDS" },
  { value: "98.2%", label: "CLAIM ACCURACY" },
  { value: "<120ms", label: "AVG. RESPONSE" },
];

const AuthStatsRow = () => {
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "flex-start",
        gap: "32px",
        minHeight: "46.8px",
      }}
    >
      {stats.map((stat) => (
        <Box key={stat.label}>
          {/* Stat number */}
          <Typography
            sx={{
              fontFamily: "Manrope, sans-serif",
              fontWeight: 700,
              fontSize: "24px",
              lineHeight: "28px",
              color: "#ffffff",
              mb: "2px",
            }}
          >
            {stat.value}
          </Typography>

          {/* Stat label */}
          <Typography
            sx={{
              fontFamily: "Manrope, sans-serif",
              fontWeight: 400,
              fontSize: "11px",
              lineHeight: "16px",
              color: "rgba(255, 255, 255, 0.6)",
              textTransform: "uppercase",
              letterSpacing: "0.06em",
            }}
          >
            {stat.label}
          </Typography>
        </Box>
      ))}
    </Box>
  );
};

export default AuthStatsRow;
