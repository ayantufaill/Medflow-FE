import { Box, Button, IconButton, Typography } from "@mui/material";
import { CalendarMonthOutlined, AutoAwesome, Close } from "@mui/icons-material";

const AppointmentModalHeader = ({ onCancel }) => (
  <Box sx={{
    display: "flex", alignItems: "center", gap: "12px",
    px: "10px", py: "10px",
    borderBottom: "1px solid #e0e5eb", flexShrink: 0,
    backgroundColor: "#f3f8fd",
  }}>
    <Box sx={{
      width: "36px", height: "36px", borderRadius: "8px",
      backgroundColor: "#eff6ff",
      display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
    }}>
      <CalendarMonthOutlined sx={{ fontSize: "20px", color: "#2262ef" }} />
    </Box>

    <Box>
      <Typography sx={{
        display: "flex", flexDirection: "column", justifyContent: "flex-start",
        alignItems: "flex-start", width: "320px", height: "24px", padding: "0px",
        fontFamily: "Inter", fontSize: "15px", fontWeight: 700, color: "#09121f",
      }}>
        Add new patient appointment
      </Typography>
      <Typography sx={{
        fontWeight: 400, lineHeight: "16.25px", letterSpacing: "0px",
        textAlign: "left", color: "#5c646f", fontFamily: "Inter", fontSize: "11px",
      }}>
        Schedule treatment or recare with smart conflict detection.
      </Typography>
    </Box>

    <Box sx={{ flex: 1 }} />

    <Button
      variant="outlined"
      startIcon={<AutoAwesome sx={{ fontSize: "14px" }} />}
      sx={{
        display: "flex", alignItems: "center", justifyContent: "center",
        flexDirection: "row", padding: "0px 11.8px", borderWidth: "1px",
        fontFamily: "Inter", fontSize: "12px", fontWeight: 500,
        textTransform: "none", borderRadius: "20px",
        borderColor: "#e0e5eb", color: "#09121f", gap: "12px",
        px: "14px", py: "6px", bgcolor: "#fbfdfe",
        "&:hover": { borderColor: "#9ca3af", backgroundColor: "#f9fafb" },
      }}
    >
      Convert to shortlist
    </Button>

    <IconButton onClick={onCancel} size="small" sx={{ color: "#6b7280" }}>
      <Close sx={{ fontSize: "18px" }} />
    </IconButton>
  </Box>
);

export default AppointmentModalHeader;
