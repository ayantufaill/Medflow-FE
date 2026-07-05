import { Box, Divider, Typography } from "@mui/material";
import { ShieldOutlined } from "@mui/icons-material";
import { SL } from "./helpers";

const CoveragePanel = () => (
  <Box sx={{ flex: 1, minWidth: 0, px: "16px", py: "12px", borderRight: "1px solid #f0f2f5" }}>
    <Box sx={{ display: "flex", alignItems: "flex-start", gap: "6px", mb: "4px" }}>
      <ShieldOutlined sx={{ fontSize: "13px", color: "#9aa3ae", mt: "1px", flexShrink: 0 }} />
      <Typography sx={{ fontFamily: "Inter", fontSize: "11px", fontWeight: 600, color: "#09121f" }}>
        Patient has no active coverage
      </Typography>
    </Box>
    <Typography sx={{
      fontFamily: "Inter", fontSize: "11px", color: "#2262ef",
      cursor: "pointer", pl: "19px",
      "&:hover": { textDecoration: "underline" },
    }}>
      + Add insurance
    </Typography>

    <Divider sx={{ my: "10px", borderColor: "#f0f2f5" }} />

    <SL>Patient Flags</SL>
    <Typography sx={{
      fontFamily: "Inter", fontSize: "11px", color: "#2262ef",
      cursor: "pointer",
      "&:hover": { textDecoration: "underline" },
    }}>
      + Add flags
    </Typography>
  </Box>
);

export default CoveragePanel;
