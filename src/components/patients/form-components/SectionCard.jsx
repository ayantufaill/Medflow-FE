import { Box, Chip, Typography } from "@mui/material";

const SectionCard = ({ icon: Icon, title, subtitle, badge, children, sx = {} }) => (
  <Box
    sx={{
      backgroundColor: "#fff",
      borderRadius: "16px",
      border: "0.8px solid #E2E8F0",
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
              backgroundColor: "#F1F5F9",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <Icon sx={{ fontSize: 20, color: "#475569" }} />
          </Box>
        )}
        <Box>
          <Typography
            sx={{
              fontWeight: 600,
              fontSize: "1rem",
              color: "#1E293B",
              lineHeight: 1.3,
            }}
          >
            {title}
          </Typography>
          {subtitle && (
            <Typography
              sx={{
                fontSize: "0.8rem",
                color: "#94A3B8",
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
            fontWeight: 600,
            fontSize: "0.65rem",
            letterSpacing: "0.5px",
            height: 24,
            backgroundColor: badge === "required" ? "#EFF6FF" : "#F8FAFC",
            color: badge === "required" ? "#2563EB" : "#94A3B8",
            border: `1px solid ${badge === "required" ? "#BFDBFE" : "#E2E8F0"}`,
          }}
        />
      )}
    </Box>
    <Box sx={{ borderBottom: "1px solid #F1F5F9", mx: { xs: -2, sm: -2.5 }, mb: 3 }} />
    {children}
  </Box>
);

export default SectionCard;
