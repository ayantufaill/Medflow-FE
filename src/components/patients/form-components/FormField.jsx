import { Box, Typography } from "@mui/material";
import { COLORS } from "../../../constants/colors";
import { fontSize, fontWeight } from "../../../constants/styles";

const FormField = ({ label, required, children, sx = {} }) => (
  <Box sx={{ display: "flex", flexDirection: "column", gap: 0.75, ...sx }}>
    {label && (
      <Typography
        sx={{
          fontFamily: "Inter",
          fontSize: fontSize.base,
          fontWeight: fontWeight.medium,
          color: COLORS.TEXT_SECONDARY,
          textTransform: "uppercase",
          letterSpacing: "0.3px",
          lineHeight: 1,
        }}
      >
        {label}
        {required && (
          <Box component="span" sx={{ color: COLORS.ACCENT, ml: 0.5, fontWeight: "bold" }}>
            *
          </Box>
        )}
      </Typography>
    )}
    {children}
  </Box>
);

export default FormField;
