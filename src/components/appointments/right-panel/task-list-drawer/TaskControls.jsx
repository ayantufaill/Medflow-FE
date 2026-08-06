import { useState } from "react";
import { Box, Typography, Checkbox, Select, MenuItem, InputBase } from "@mui/material";
import { KeyboardArrowDown, Sort } from "@mui/icons-material";

const CustomSelectInput = ({ ...props }) => (
  <InputBase
    {...props}
    sx={{
      "& .MuiInputBase-input": {
        border: "1px solid #d1d5db",
        borderRadius: "8px",
        px: "12px",
        py: "6px",
        height: "22px",
        fontFamily: "Inter",
        fontSize: "13px",
        color: "#374151",
        backgroundColor: "#fff",
        display: "flex",
        alignItems: "center",
        "&:focus": {
          borderRadius: "8px",
          borderColor: "#2262ef",
          backgroundColor: "#fff",
        },
        "&:hover": { backgroundColor: "#f5f7fa" },
      },
    }}
  />
);

const TaskControls = ({ 
  onAddTask,
  taskAssignment,
  setTaskAssignment,
  filterBy,
  setFilterBy,
  todayOnly,
  setTodayOnly
}) => {

  return (
    <Box sx={{ px: "20px", py: "14px", borderBottom: "1px solid #f0f2f5", flexShrink: 0 }}>
      {/* Top row: dropdown + button */}
      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: "12px" }}>
        <Select
          value={taskAssignment}
          onChange={(e) => setTaskAssignment(e.target.value)}
          input={<CustomSelectInput />}
          IconComponent={KeyboardArrowDown}
          sx={{ minWidth: 160, "& .MuiSvgIcon-root": { fontSize: "16px", color: "#9aa3ae", right: "8px", position: "absolute", pointerEvents: "none" }, pr: "24px" }}
          MenuProps={{ sx: { zIndex: 2000 }, PaperProps: { sx: { borderRadius: "8px", boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)" } } }}
        >
          <MenuItem value="assigned_to_me" sx={{ fontFamily: "Inter", fontSize: "13px" }}>Tasks assigned to me</MenuItem>
          <MenuItem value="assigned_by_me" sx={{ fontFamily: "Inter", fontSize: "13px" }}>Tasks assigned by me</MenuItem>
        </Select>

        {/* Add a task button */}
        <Box
          onClick={onAddTask}
          sx={{
            backgroundColor: "#2262ef", borderRadius: "8px",
            px: "16px", height: "36px",
            display: "flex", alignItems: "center",
            cursor: "pointer", "&:hover": { backgroundColor: "#1a50cc" },
            flexShrink: 0
          }}
        >
          <Typography sx={{ fontFamily: "Inter", fontSize: "13px", fontWeight: 600, color: "#fff" }}>
            Add a task
          </Typography>
        </Box>
      </Box>

      {/* Second row: filter dropdown + checkbox */}
      <Box sx={{ display: "flex", alignItems: "center", gap: "16px", flexWrap: "wrap" }}>
        <Select
          value={filterBy}
          onChange={(e) => setFilterBy(e.target.value)}
          input={<CustomSelectInput />}
          IconComponent={KeyboardArrowDown}
          sx={{ minWidth: 120, "& .MuiSvgIcon-root": { fontSize: "16px", color: "#9aa3ae", right: "8px", position: "absolute", pointerEvents: "none" }, pr: "24px" }}
          MenuProps={{ sx: { zIndex: 2000 }, PaperProps: { sx: { borderRadius: "8px", boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)" } } }}
        >
          <MenuItem value="due_date" sx={{ fontFamily: "Inter", fontSize: "13px" }}>Due Date</MenuItem>
          <MenuItem value="created_date" sx={{ fontFamily: "Inter", fontSize: "13px" }}>Created Date</MenuItem>
        </Select>

        <Box sx={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <Checkbox
            size="small"
            checked={todayOnly}
            onChange={(e) => setTodayOnly(e.target.checked)}
            sx={{ p: 0, color: "#d1d5db", "&.Mui-checked": { color: "#2262ef" } }}
          />
          <Typography sx={{ fontFamily: "Inter", fontSize: "13px", color: "#374151" }}>
            Today's tasks only
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default TaskControls;
