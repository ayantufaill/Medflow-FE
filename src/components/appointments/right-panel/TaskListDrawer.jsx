import { useState } from "react";
import { Drawer, Box } from "@mui/material";
import { TASKS, COMPLETED_TASKS } from "./task-list-drawer/mockData";
import TaskDrawerHeader from "./task-list-drawer/TaskDrawerHeader";
import TaskControls from "./task-list-drawer/TaskControls";
import TaskCard from "./task-list-drawer/TaskCard";
import AddTaskForm from "./task-list-drawer/AddTaskForm";
import { Typography } from "@mui/material";

const TaskListDrawer = ({ open, onClose, initialView = "list" }) => {
  const [view, setView] = useState(initialView);
  const [tasks, setTasks] = useState([...TASKS, ...COMPLETED_TASKS]);

  const [taskAssignment, setTaskAssignment] = useState("assigned_to_me");
  const [filterBy, setFilterBy] = useState("due_date");
  const [todayOnly, setTodayOnly] = useState(false);

  const handleClose = () => {
    setView("list");
    onClose();
  };

  const handleToggleComplete = (id) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  // Filter tasks
  const filteredTasks = tasks
    .filter(t => {
      // Mock assignment filtering
      if (taskAssignment === "assigned_to_me" && t.creator !== "Dr. S. Wells") return false;
      if (taskAssignment === "assigned_by_me" && t.creator === "Dr. S. Wells") return false;

      // Mock today filter
      if (todayOnly && t.date !== "06/29/2022") return false;

      return true;
    })
    .sort((a, b) => {
      // Mock sorting
      if (filterBy === "due_date") {
        return new Date(a.date) - new Date(b.date);
      } else {
        return new Date(b.date) - new Date(a.date);
      }
    });

  const activeTasks = filteredTasks.filter(t => !t.completed);
  const completedTasks = filteredTasks.filter(t => t.completed);

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
            {activeTasks.map((task) => (
              <TaskCard key={task.id} task={task} onToggleComplete={handleToggleComplete} />
            ))}
            
            {completedTasks.length > 0 && (
              <>
                <Typography sx={{ fontFamily: "Inter", fontSize: "14px", fontWeight: 600, color: "#374151", mt: "12px", mb: "4px" }}>
                  Completed
                </Typography>
                {completedTasks.map((task) => (
                  <TaskCard key={task.id} task={task} onToggleComplete={handleToggleComplete} />
                ))}
              </>
            )}
          </Box>
        </>
      )}
    </Drawer>
  );
};

export default TaskListDrawer;
