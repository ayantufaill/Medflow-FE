import { useState } from "react";
import { Box, Typography, Checkbox } from "@mui/material";
import { KeyboardArrowDown } from "@mui/icons-material";

const TaskControls = ({ onAddTask }) => {
  const [todayOnly, setTodayOnly] = useState(false);

  return (
    <Box sx={{ px: "20px", py: "14px", borderBottom: "1px solid #f0f2f5", flexShrink: 0 }}>
      {/* Top row: dropdown + button */}
      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: "12px" }}>
        {/* My tasks dropdown */}
        <Box sx={{
          display: "flex", alignItems: "center", gap: "6px",
          border: "1px solid #d1d5db", borderRadius: "8px",
          px: "12px", height: "36px",
          cursor: "pointer",
          "&:hover": { backgroundColor: "#f5f7fa" },
        }}>
          <Typography sx={{ fontFamily: "Inter", fontSize: "13px", color: "#374151" }}>My tasks</Typography>
          <KeyboardArrowDown sx={{ fontSize: "16px", color: "#9aa3ae" }} />
        </Box>

        {/* Add a task button */}
        <Box
          onClick={onAddTask}
          sx={{
            backgroundColor: "#2262ef", borderRadius: "8px",
            px: "16px", height: "36px",
            display: "flex", alignItems: "center",
            cursor: "pointer", "&:hover": { backgroundColor: "#1a50cc" },
          }}
        >
          <Typography sx={{ fontFamily: "Inter", fontSize: "13px", fontWeight: 600, color: "#fff" }}>
            Add a task
          </Typography>
        </Box>
      </Box>

      {/* Today only checkbox */}
      <Box sx={{ display: "flex", alignItems: "center", gap: "8px" }}>
        <Checkbox
          size="small"
          checked={todayOnly}
          onChange={(e) => setTodayOnly(e.target.checked)}
          sx={{ p: 0, color: "#d1d5db", "&.Mui-checked": { color: "#2262ef" } }}
        />
        <Typography sx={{ fontFamily: "Inter", fontSize: "13px", color: "#374151" }}>
          Show today's tasks only
        </Typography>
      </Box>
    </Box>
  );
};

export default TaskControls;
