import { Box, Typography, IconButton } from "@mui/material";
import { CalendarMonth, Close } from "@mui/icons-material";

const ShortlistModalHeader = ({ onClose }) => (
  <Box sx={{
    backgroundColor: "#f3f8fd",
    px: "24px", py: "14px",
    borderBottom: "1px solid #e8edf3",
    display: "flex", alignItems: "center", gap: "12px",
    flexShrink: 0,
  }}>
    <Box sx={{
      width: "40px", height: "40px",
      borderRadius: "10px",
      backgroundColor: "#dbeafe",
      display: "flex", alignItems: "center", justifyContent: "center",
      flexShrink: 0,
    }}>
      <CalendarMonth sx={{ fontSize: "20px", color: "#2262ef" }} />
    </Box>

    <Box>
      <Typography sx={{ fontFamily: "Inter", fontSize: "15px", fontWeight: 700, color: "#09121f" }}>
        Appointment Shortlist
      </Typography>
      <Typography sx={{ fontFamily: "Inter", fontSize: "12px", color: "#9aa3ae" }}>
        Schedule treatment or recare
      </Typography>
    </Box>

    <Box sx={{ flex: 1 }} />

    <IconButton onClick={onClose} size="small" sx={{ color: "#9aa3ae", "&:hover": { backgroundColor: "#e8edf3" } }}>
      <Close sx={{ fontSize: "18px" }} />
    </IconButton>
  </Box>
);

export default ShortlistModalHeader;
