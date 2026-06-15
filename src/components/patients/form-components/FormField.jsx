import { Box, Typography } from "@mui/material";

const FormField = ({ label, required, children, sx = {} }) => (
  <Box sx={{ display: "flex", flexDirection: "column", gap: 0.75, ...sx }}>
    {label && (
      <Typography
        sx={{
          fontSize: "0.75rem",
          fontWeight: 500,
          color: "#64748B",
          textTransform: "uppercase",
          letterSpacing: "0.3px",
          lineHeight: 1,
        }}
      >
        {label}
        {required && (
          <Box component="span" sx={{ color: "#1a73e8", ml: 0.5, fontWeight: "bold" }}>
            *
          </Box>
        )}
      </Typography>
    )}
    {children}
  </Box>
);

export default FormField;
