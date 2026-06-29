import { useState } from "react";
import { Drawer, Box } from "@mui/material";
import { TASKS } from "./task-list-drawer/mockData";
import TaskDrawerHeader from "./task-list-drawer/TaskDrawerHeader";
import TaskControls from "./task-list-drawer/TaskControls";
import TaskCard from "./task-list-drawer/TaskCard";
import AddTaskForm from "./task-list-drawer/AddTaskForm";

const TaskListDrawer = ({ open, onClose, initialView = "list" }) => {
  const [view, setView] = useState(initialView);

  const handleClose = () => {
    setView("list");
    onClose();
  };

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
          <TaskControls onAddTask={() => setView("add")} />

          {/* Scrollable task list */}
          <Box sx={{ flex: 1, overflowY: "auto", px: "20px", py: "16px", display: "flex", flexDirection: "column", gap: "10px" }}>
            {TASKS.map((task) => (
              <TaskCard key={task.id} task={task} />
            ))}
          </Box>
        </>
      )}
    </Drawer>
  );
};

export default TaskListDrawer;
