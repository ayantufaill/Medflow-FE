import { Box, Typography, IconButton } from "@mui/material";
import { RadioButtonUnchecked, CalendarMonth, PeopleOutline, Delete, Link } from "@mui/icons-material";

const TaskCard = ({ task }) => (
  <Box sx={{
    backgroundColor: "rgba(34, 98, 239, 0.10)",
    borderRadius: "10px",
    px: "14px", py: "12px",
    display: "flex",
    gap: "12px",
    alignItems: "flex-start",
  }}>
    {/* Circle checkbox */}
    <RadioButtonUnchecked sx={{ fontSize: "22px", color: "#2262ef", flexShrink: 0, mt: "2px", cursor: "pointer" }} />

    {/* Content */}
    <Box sx={{ flex: 1, minWidth: 0 }}>
      {/* Title */}
      <Typography sx={{ fontFamily: "Inter", fontSize: "12px", fontWeight: 700, color: "#09121f", mb: "2px" }}>
        {task.title}
      </Typography>

      {/* Subtitle */}
      <Typography sx={{ fontFamily: "Inter", fontSize: "12px", color: "#09121f", mb: "10px" }}>
        {task.sub}
      </Typography>

      {/* Info row: date + location (left) | Go to Treatment Plan (right) */}
      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "8px" }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: "10px" }}>
          {/* Date */}
          <Box sx={{ display: "flex", alignItems: "center", gap: "4px" }}>
            <CalendarMonth sx={{ fontSize: "13px", color: "#9aa3ae" }} />
            <Typography sx={{ fontFamily: "Inter", fontSize: "12px", color: "#9aa3ae" }}>{task.date}</Typography>
          </Box>

          {/* Location */}
          <Box sx={{ display: "flex", alignItems: "center", gap: "4px" }}>
            <PeopleOutline sx={{ fontSize: "13px", color: "#9aa3ae" }} />
            <Typography sx={{ fontFamily: "Inter", fontSize: "12px", color: "#9aa3ae" }}>{task.location}</Typography>
          </Box>
        </Box>

        {/* Go to Treatment Plan link — right */}
        <Box sx={{ display: "flex", alignItems: "center", gap: "4px", cursor: "pointer", flexShrink: 0 }}>
          <Link sx={{ fontSize: "13px", color: "#2262ef" }} />
          <Typography sx={{ fontFamily: "Inter", fontSize: "12px", color: "#2262ef", "&:hover": { textDecoration: "underline" } }}>
            Go to Treatment Plan
          </Typography>
        </Box>
      </Box>

      {/* Created by — separate line, right-aligned */}
      <Box sx={{ display: "flex", justifyContent: "flex-end", mt: "4px" }}>
        <Typography sx={{ fontFamily: "Inter", fontSize: "11px", color: "#9aa3ae" }}>
          Created by {task.creator}
        </Typography>
      </Box>
    </Box>

    {/* Delete icon */}
    <IconButton size="small" sx={{ p: "2px", color: "#ef4444", flexShrink: 0, mt: "1px", "&:hover": { backgroundColor: "rgba(239,68,68,0.08)" } }}>
      <Delete sx={{ fontSize: "16px" }} />
    </IconButton>
  </Box>
);

export default TaskCard;
