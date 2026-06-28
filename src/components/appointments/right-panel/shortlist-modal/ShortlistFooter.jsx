import { Box, Typography } from "@mui/material";

const ShortlistFooter = ({ total, selectedCount }) => (
  <Box sx={{
    backgroundColor: "#f8fafc",
    px: "24px", py: "12px",
    borderTop: "1px solid #f0f2f5",
    display: "flex", justifyContent: "space-between", alignItems: "center",
    flexShrink: 0,
  }}>
    <Typography sx={{ fontFamily: "Inter", fontSize: "12px", color: "#9aa3ae" }}>
      {total} shortlisted
    </Typography>
    <Typography sx={{ fontFamily: "Inter", fontSize: "12px", color: "#9aa3ae" }}>
      {selectedCount} selected
    </Typography>
  </Box>
);

export default ShortlistFooter;
