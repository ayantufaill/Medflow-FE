import { Box, Typography, IconButton, CircularProgress } from '@mui/material';
import { Refresh, AssignmentOutlined } from '@mui/icons-material';
import { useState } from 'react';
import { COLORS } from '../../../constants/colors';
import { radius } from '../../../constants/styles';
import TaskItemRow from './TaskItemRow';

const TaskCategoryCard = ({ category }) => {
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
    }, 600);
  };

  return (
    <Box sx={{ 
      border: `1px solid ${COLORS.BORDER}`, 
      borderRadius: radius.lg,
      bgcolor: COLORS.SURFACE_CARD,
      overflow: 'hidden',
      display: 'flex',
      flexDirection: 'column',
      opacity: isRefreshing ? 0.6 : 1,
      transition: 'opacity 0.2s',
      pointerEvents: isRefreshing ? 'none' : 'auto'
    }}>
      {/* Card Header (Styled to match Medflow standard dialog headers) */}
      <Box sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between',
        px: 2,
        py: 1.5,
        bgcolor: COLORS.SURFACE_TINT,
        borderBottom: `1px solid ${COLORS.BORDER}`
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <AssignmentOutlined sx={{ color: COLORS.ACCENT, fontSize: '18px' }} />
          <Typography sx={{ fontSize: '14px', fontWeight: 600, color: COLORS.TEXT_PRIMARY }}>
            {category.count} {category.title} <span style={{ color: COLORS.TEXT_SECONDARY, fontWeight: 400 }}>{category.count}/{category.total}</span>
          </Typography>
        </Box>
        <IconButton size="small" sx={{ color: COLORS.TEXT_SECONDARY }} onClick={handleRefresh}>
          {isRefreshing ? <CircularProgress size={16} color="inherit" /> : <Refresh fontSize="small" />}
        </IconButton>
      </Box>

      {/* Card Body */}
      <Box sx={{ p: 1.5, flex: 1 }}>
        {category.items.map((item) => (
          <TaskItemRow key={item.id} item={item} />
        ))}
        {category.items.length === 0 && (
          <Box sx={{ py: 3, textAlign: 'center' }}>
            <Typography sx={{ fontSize: '13px', color: COLORS.TEXT_MUTED }}>
              No tasks to display
            </Typography>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default TaskCategoryCard;
