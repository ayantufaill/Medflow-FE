import { useState } from 'react';
import { Box, Typography } from '@mui/material';
import { RadioButtonUnchecked, Checklist } from '@mui/icons-material';
import RightPanelCard from './RightPanelCard';
import TaskListDrawer from './TaskListDrawer';
import { COLORS } from '../../../constants/colors';
import { fontSize, fontWeight, radius } from '../../../constants/styles';
import { useTasks, useUpdateTaskStatus } from '../../../hooks/queries/useTasks';
import dayjs from 'dayjs';

const TaskList = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [drawerView, setDrawerView] = useState("list");

  const { data: tasksData } = useTasks({ limit: 100 });
  const tasks = tasksData?.tasks || [];
  const activeTasks = tasks.filter(t => t.TaskStatus !== 1 && t.TaskStatus !== 3).slice(0, 3);
  const totalActive = tasks.filter(t => t.TaskStatus !== 1 && t.TaskStatus !== 3).length;

  const updateTaskStatusMutation = useUpdateTaskStatus();
  
  const handleToggleComplete = (taskId, e) => {
    e.stopPropagation();
    updateTaskStatusMutation.mutate({ taskId, status: 1 });
  };

  const openList = () => { setDrawerView("list"); setDrawerOpen(true); };
  const openAdd  = () => { setDrawerView("add");  setDrawerOpen(true); };

  return (
    <>
      <RightPanelCard
        icon={<Checklist sx={{ fontSize: '20px', color: '#10b981' }} />}
        title="Task List"
        count={totalActive}
        headerAction="addButton"
        onAdd={openAdd}
        footerLabel="Open task list →"
        onFooterClick={openList}
      >
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          {activeTasks.map((task) => {
            const descriptLines = (task.Descript || "").split("\n");
            const title = descriptLines[0] || "No description";
            const dateStr = task.DateTask || task.DateTimeEntry;
            const sub = dateStr ? `${dayjs(dateStr).format('MM/DD/YYYY')} · ${task.assignedUser?.UserName || 'Unassigned'}` : 'No date';
            
            return (
              <Box
                key={task.TaskNum}
                onClick={openList}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  backgroundColor: COLORS.SURFACE_TINT,
                  borderRadius: radius.md,
                  px: '12px',
                  py: '10px',
                  cursor: 'pointer',
                  position: 'relative',
                }}
              >
                <RadioButtonUnchecked 
                  onClick={(e) => handleToggleComplete(task.TaskNum, e)}
                  sx={{ fontSize: '20px', color: '#3b82f6', flexShrink: 0, '&:hover': { color: '#2563eb' } }} 
                />

                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <Typography noWrap sx={{ fontSize: fontSize.base, fontWeight: fontWeight.semibold, color: COLORS.TEXT_PRIMARY }}>
                    {title}
                  </Typography>
                  <Typography noWrap sx={{ fontSize: fontSize.base, color: '#6b7280' }}>
                    {sub}
                  </Typography>
                </Box>
              </Box>
            );
          })}
        </Box>
      </RightPanelCard>

      <TaskListDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        initialView={drawerView}
      />
    </>
  );
};

export default TaskList;
