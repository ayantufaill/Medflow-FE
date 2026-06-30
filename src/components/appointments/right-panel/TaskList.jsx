import { useState } from 'react';
import { Box, Typography } from '@mui/material';
import { RadioButtonUnchecked, Checklist } from '@mui/icons-material';
import RightPanelCard from './RightPanelCard';
import TaskListDrawer from './TaskListDrawer';
import { COLORS } from '../../../constants/colors';
import { fontSize, fontWeight, radius } from '../../../constants/styles';

const TASKS = [
  { title: 'Procedure Followup Required', sub: '06/29/2022 · Front', dot: true },
  { title: 'Procedure Followup Required', sub: '06/29/2022 · Front', dot: false },
  { title: 'Procedure Followup Required', sub: '06/29/2022 · Front', dot: false },
];

const TaskList = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [drawerView, setDrawerView] = useState("list");

  const openList = () => { setDrawerView("list"); setDrawerOpen(true); };
  const openAdd  = () => { setDrawerView("add");  setDrawerOpen(true); };

  return (
    <>
      <RightPanelCard
        icon={<Checklist sx={{ fontSize: '20px', color: '#10b981' }} />}
        title="Task List"
        count={5}
        headerAction="addButton"
        onAdd={openAdd}
        footerLabel="Open task list →"
        onFooterClick={openList}
      >
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          {TASKS.map(({ title, sub, dot }, i) => (
            <Box
              key={i}
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
              <RadioButtonUnchecked sx={{ fontSize: '20px', color: '#3b82f6', flexShrink: 0 }} />

              <Box sx={{ flex: 1 }}>
                <Typography sx={{ fontSize: fontSize.base, fontWeight: fontWeight.semibold, color: COLORS.TEXT_PRIMARY }}>
                  {title}
                </Typography>
                <Typography sx={{ fontSize: fontSize.base, color: '#6b7280' }}>
                  {sub}
                </Typography>
              </Box>

              {dot && (
                <Box sx={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: COLORS.STATUS_ERROR, flexShrink: 0 }} />
              )}
            </Box>
          ))}
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
