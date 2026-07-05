import { Box, Typography } from "@mui/material";
import { PlaceOutlined } from "@mui/icons-material";

const SliderFooter = ({ pt }) => (
  <Box sx={{
    display: "flex", justifyContent: "space-between", alignItems: "center",
    px: "16px", py: "7px",
    borderTop: "1px solid #f0f2f5",
    backgroundColor: "#f8fafc",
    borderRadius: "0 0 16px 16px",
  }}>
    <Box sx={{ display: "flex", alignItems: "center", gap: "5px" }}>
      <PlaceOutlined sx={{ fontSize: "13px", color: "#9aa3ae" }} />
      <Typography sx={{ fontFamily: "Inter", fontSize: "11px", color: "#6b7280" }}>
        {pt.location}
      </Typography>
    </Box>
    <Typography sx={{ fontFamily: "Inter", fontSize: "11px", color: "#9aa3ae" }}>
      Last updated just now
    </Typography>
  </Box>
);

export default SliderFooter;
