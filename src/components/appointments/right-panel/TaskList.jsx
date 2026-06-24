import { Box, Typography } from '@mui/material';
import { RadioButtonUnchecked, AssignmentTurnedIn } from '@mui/icons-material';
import RightPanelCard from './RightPanelCard';

const TASKS = [
  { title: 'Procedure Followup Required', sub: '06/29/2022 · Front', dot: true },
  { title: 'Procedure Followup Required', sub: '06/29/2022 · Front', dot: false },
  { title: 'Procedure Followup Required', sub: '06/29/2022 · Front', dot: false },
];

const TaskList = () => (
  <RightPanelCard
    icon={<AssignmentTurnedIn sx={{ fontSize: '20px', color: '#06b6d4' }} />}
    title="Task List"
    count={5}
    headerAction="addButton"
    footerLabel="Open task list →"
  >
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
      {TASKS.map(({ title, sub, dot }, i) => (
        <Box
          key={i}
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            backgroundColor: '#f3f8fd',
            borderRadius: '8px',
            px: '12px',
            py: '10px',
            cursor: 'pointer',
            position: 'relative',
          }}
        >
          <RadioButtonUnchecked sx={{ fontSize: '20px', color: '#2262ef', flexShrink: 0 }} />

          <Box sx={{ flex: 1 }}>
            <Typography sx={{ fontFamily: 'Inter', fontSize: '12px', fontWeight: 600, color: '#09121f' }}>
              {title}
            </Typography>
            <Typography sx={{ fontFamily: 'Inter', fontSize: '12px', color: '#09121f' }}>
              {sub}
            </Typography>
          </Box>

          {dot && (
            <Box
              sx={{
                width: '8px', height: '8px',
                borderRadius: '50%',
                backgroundColor: '#ef4444',
                flexShrink: 0,
              }}
            />
          )}
        </Box>
      ))}
    </Box>
  </RightPanelCard>
);

export default TaskList;
