import { Box, Typography, IconButton } from "@mui/material";
import { Close, Checklist } from "@mui/icons-material";

const TaskDrawerHeader = ({ onClose }) => (
  <Box sx={{
    display: "flex", alignItems: "center", gap: "10px",
    px: "20px", py: "16px",
    borderBottom: "1px solid #f0f2f5",
    flexShrink: 0,
  }}>
    <Checklist sx={{ fontSize: "20px", color: "#10b981" }} />
    <Typography sx={{ fontFamily: "Inter", fontSize: "16px", fontWeight: 700, color: "#09121f", flex: 1 }}>
      Task List
    </Typography>
    <IconButton onClick={onClose} size="small" sx={{ color: "#9aa3ae", "&:hover": { backgroundColor: "#f5f7fa" } }}>
      <Close sx={{ fontSize: "18px" }} />
    </IconButton>
  </Box>
);

export default TaskDrawerHeader;
