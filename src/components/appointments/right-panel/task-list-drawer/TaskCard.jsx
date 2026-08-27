import { Box, Typography, IconButton } from "@mui/material";
import { RadioButtonUnchecked, CheckCircle, CalendarTodayOutlined, PeopleOutline, DeleteOutline, AddLinkOutlined } from "@mui/icons-material";
import DeleteIconImg from "../../../../assets/operatory icons/delete.png";
import dayjs from "dayjs";
import { useDeleteTask } from "../../../../hooks/queries/useTasks";

const TaskCard = ({ task, onToggleComplete }) => {
  const isCompleted = task.TaskStatus === 1;
  const descriptLines = (task.Descript || "").split("\n");
  const title = descriptLines[0] || "No description";
  const sub = descriptLines.slice(1).join("\n") || "";
  const dateStr = task.DateTask || task.DateTimeEntry;

  const deleteTaskMutation = useDeleteTask();

  const handleDelete = () => {
    deleteTaskMutation.mutate(task.TaskNum);
  };
  return (
    <Box sx={{
      backgroundColor: isCompleted ? "#f9fafb" : "rgba(34, 98, 239, 0.10)",
      borderRadius: "10px",
      px: "14px", py: "12px",
      display: "flex",
      gap: "12px",
      alignItems: "flex-start",
    }}>
      {/* Circle checkbox */}
      {isCompleted ? (
        <CheckCircle onClick={() => onToggleComplete?.(task.TaskNum, task.TaskStatus)} sx={{ fontSize: "22px", color: "#9ca3af", flexShrink: 0, mt: "2px", cursor: "pointer" }} />
      ) : (
        <RadioButtonUnchecked onClick={() => onToggleComplete?.(task.TaskNum, task.TaskStatus)} sx={{ fontSize: "22px", color: "#2262ef", flexShrink: 0, mt: "2px", cursor: "pointer" }} />
      )}

      {/* Content */}
      <Box sx={{ flex: 1, minWidth: 0 }}>
        {/* Title */}
        <Typography sx={{ fontFamily: "Inter", fontSize: "12px", fontWeight: 700, color: isCompleted ? "#9ca3af" : "#09121f", textDecoration: isCompleted ? "line-through" : "none", mb: "2px" }}>
          {title}
        </Typography>

        {/* Subtitle */}
        <Typography sx={{ fontFamily: "Inter", fontSize: "12px", color: isCompleted ? "#9ca3af" : "#09121f", mb: "10px", whiteSpace: "pre-wrap" }}>
          {sub}
        </Typography>

        {/* Info row: date + location */}
        <Box sx={{ display: "flex", alignItems: "center", gap: "10px" }}>
          {/* Date */}
          <Box sx={{ display: "flex", alignItems: "center", gap: "4px" }}>
            <CalendarTodayOutlined sx={{ fontSize: "13px", color: "#9aa3ae" }} />
            <Typography sx={{ fontFamily: "Inter", fontSize: "12px", color: "#9aa3ae" }}>{dateStr ? dayjs(dateStr).format('MM/DD/YYYY') : '-'}</Typography>
          </Box>

          {/* Location / Assignee */}
          <Box sx={{ display: "flex", alignItems: "center", gap: "4px" }}>
            <PeopleOutline sx={{ fontSize: "13px", color: "#9aa3ae" }} />
            <Typography sx={{ fontFamily: "Inter", fontSize: "12px", color: "#9aa3ae" }}>
              {task.assignedUser?.firstName ? `${task.assignedUser.firstName} ${task.assignedUser.lastName || ''}`.trim() : task.assignedUser?.UserName || 'Unassigned'}
            </Typography>
          </Box>
        </Box>

        {/* Bottom row: Actions & Created by */}
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mt: "8px" }}>
          {/* Go to Treatment link — left */}
          <Box sx={{ display: "flex", alignItems: "center", gap: "4px", cursor: "pointer", flexShrink: 0 }}>
            <AddLinkOutlined sx={{ fontSize: "15px", color: "#2262ef" }} />
            <Typography sx={{ fontFamily: "Inter", fontSize: "12px", color: "#2262ef", "&:hover": { textDecoration: "underline" } }}>
              Go to Treatment
            </Typography>
          </Box>

          {/* Created by — right */}
          <Typography sx={{ fontFamily: "Inter", fontSize: "11px", color: "#9aa3ae" }}>
            Created by {task.creator?.firstName ? `${task.creator.firstName} ${task.creator.lastName || ''}`.trim() : task.creator?.UserName || "Unknown"}
          </Typography>
        </Box>
      </Box>

      {/* Delete icon */}
      <IconButton onClick={handleDelete} size="small" sx={{ p: "2px", flexShrink: 0, mt: "1px", "&:hover": { backgroundColor: "rgba(239,68,68,0.08)" } }}>
        <Box component="img" src={DeleteIconImg} sx={{ width: "16px", height: "16px", objectFit: "contain" }} />
      </IconButton>
    </Box>
  );
};

export default TaskCard;
