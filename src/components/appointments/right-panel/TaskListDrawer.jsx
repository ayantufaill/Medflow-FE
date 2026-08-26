import { useState } from "react";
import { Drawer, Box } from "@mui/material";
import { useAuth } from "../../../contexts/AuthContext";
import { useTasks, useUpdateTaskStatus } from "../../../hooks/queries/useTasks";
import dayjs from "dayjs";
import TaskDrawerHeader from "./task-list-drawer/TaskDrawerHeader";
import TaskControls from "./task-list-drawer/TaskControls";
import TaskCard from "./task-list-drawer/TaskCard";
import AddTaskForm from "./task-list-drawer/AddTaskForm";
import { Typography } from "@mui/material";

const TaskListDrawer = ({ open, onClose, initialView = "list" }) => {
  const [view, setView] = useState(initialView);

  const [taskAssignment, setTaskAssignment] = useState("all_tasks");
  const [filterBy, setFilterBy] = useState("due_date");
  const [todayOnly, setTodayOnly] = useState(false);

  const { user } = useAuth();
  const { data: tasksData, isLoading } = useTasks({ limit: 100 });
  const tasks = tasksData?.tasks || [];

  const updateTaskStatusMutation = useUpdateTaskStatus();

  const handleClose = () => {
    setView("list");
    onClose();
  };

  const handleToggleComplete = (id, currentStatus) => {
    const newStatus = currentStatus === 1 ? 0 : 1;
    updateTaskStatusMutation.mutate({ taskId: id, status: newStatus });
  };

  // Filter tasks
  const filteredTasks = tasks
    .filter(t => {
      // Assignment filtering
      if (taskAssignment === "assigned_to_me" && String(t.UserNum) !== String(user?.id || user?.UserNum)) return false;
      // Note: assigned_by_me is not fully supported by backend schema as it lacks a creator field.
      // We will skip filtering out for assigned_by_me to let users see tasks if they choose it.

      // Today filter
      if (todayOnly) {
        const taskDate = t.DateTask || t.DateTimeEntry;
        if (taskDate && !dayjs(taskDate).isSame(dayjs(), 'day')) return false;
      }

      return true;
    })
    .sort((a, b) => {
      // Sorting
      const dateA = a.DateTask || a.DateTimeEntry;
      const dateB = b.DateTask || b.DateTimeEntry;
      if (filterBy === "due_date") {
        return new Date(dateA) - new Date(dateB);
      } else {
        return new Date(dateB) - new Date(dateA);
      }
    });

  const activeTasks = filteredTasks.filter(t => t.TaskStatus !== 1 && t.TaskStatus !== 3);
  const completedTasks = filteredTasks.filter(t => t.TaskStatus === 1);

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={handleClose}
      sx={{
        zIndex: 1700,
        "& .MuiDrawer-paper": {
          width: 440,
          borderRadius: "16px 0 0 16px",
          boxShadow: "-6px 0 32px rgba(0,0,0,0.14)",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
        },
      }}
    >
      {view === "add" ? (
        <AddTaskForm onBack={() => setView("list")} onClose={handleClose} />
      ) : (
        <>
          <TaskDrawerHeader onClose={handleClose} />
          <TaskControls 
            onAddTask={() => setView("add")} 
            taskAssignment={taskAssignment}
            setTaskAssignment={setTaskAssignment}
            filterBy={filterBy}
            setFilterBy={setFilterBy}
            todayOnly={todayOnly}
            setTodayOnly={setTodayOnly}
          />

          {/* Scrollable task list */}
          <Box sx={{ flex: 1, overflowY: "auto", px: "20px", py: "16px", display: "flex", flexDirection: "column", gap: "10px" }}>
            {isLoading ? (
              <Typography sx={{ p: 2, textAlign: 'center', color: '#6b7280' }}>Loading tasks...</Typography>
            ) : (
              <>
                {activeTasks.map((task) => (
                  <TaskCard key={task.TaskNum} task={task} onToggleComplete={handleToggleComplete} />
                ))}
                
                {completedTasks.length > 0 && (
                  <>
                    <Typography sx={{ fontFamily: "Inter", fontSize: "14px", fontWeight: 600, color: "#374151", mt: "12px", mb: "4px" }}>
                      Completed
                    </Typography>
                    {completedTasks.map((task) => (
                      <TaskCard key={task.TaskNum} task={task} onToggleComplete={handleToggleComplete} />
                    ))}
                  </>
                )}
              </>
            )}
          </Box>
        </>
      )}
    </Drawer>
  );
};

export default TaskListDrawer;
