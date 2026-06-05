import { Box, Typography } from "@mui/material";

/**
 * AuthStatsRow — Three metric stat blocks displayed in the left panel.
 *
 * Figma specs:
 *   - Number:  Manrope 700, 24px, #FFFFFF
 *   - Label:   Manrope 400, 11px, uppercase, rgba(255,255,255,0.6)
 *   - Gap between blocks: 32px
 *   - Margin top from sub-copy: 24px
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
        mt: "24px",
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
              lineHeight: 1.1,
              color: "#ffffff",
              mb: "4px",
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
