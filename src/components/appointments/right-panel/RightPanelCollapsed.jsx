import React, { useState, useEffect } from 'react';
import { Box, Badge, IconButton } from '@mui/material';
import {
  KeyboardDoubleArrowLeft as KeyboardDoubleArrowLeftIcon,
  CalendarToday as CalendarTodayIcon,
  Checklist as ChecklistIcon,
  PeopleAlt as PeopleAltIcon,
  ChatBubbleOutline as ChatBubbleOutlineIcon
} from '@mui/icons-material';
import { COLORS } from '../../../constants/colors';
import { radius } from '../../../constants/styles';
import { shortlistService } from '../../../services/shortlist.service';
import { TASKS } from './TaskList';
import { MESSAGE_ROWS } from './Messages';

const RightPanelCollapsed = ({ onExpand, hideAppointmentShortlist = false }) => {
  const [shortlistCount, setShortlistCount] = useState(0);

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const data = await shortlistService.getShortlistItems();
        const items = data?.data || data || [];
        setShortlistCount(items.length);
      } catch (err) {
        console.error("Failed to fetch shortlist for collapsed sidebar", err);
      }
    };

    fetchItems();
    const handleShortlistUpdate = () => fetchItems();
    window.addEventListener('shortlist-updated', handleShortlistUpdate);
    return () => window.removeEventListener('shortlist-updated', handleShortlistUpdate);
  }, []);

  return (
    <Box
      sx={{
        width: '64px',
        height: '100%',
        backgroundColor: COLORS.WHITE,
        display: 'flex',
        borderRadius: radius.lg,
        flexDirection: 'column',
        alignItems: 'center',
        py: '16px',
        gap: '24px',
        boxSizing: 'border-box'
      }}
    >
      <IconButton 
        onClick={onExpand} 
        sx={{ color: COLORS.TEXT_SECONDARY, p: 0, '&:hover': { color: COLORS.ACCENT } }}
      >
        <KeyboardDoubleArrowLeftIcon fontSize="small" />
      </IconButton>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: '24px', alignItems: 'center' }}>
        {/* Calendar */}
        {!hideAppointmentShortlist && (
          <Badge 
            badgeContent={shortlistCount} 
            color="error"
            sx={{ '& .MuiBadge-badge': { fontWeight: 600, fontSize: '10px', minWidth: '16px', height: '16px', px: '4px' } }}
          >
            <Box
              onClick={onExpand}
              sx={{
                width: '40px',
                height: '40px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                color: COLORS.TEXT_SECONDARY,
                '&:hover': { color: COLORS.ACCENT, backgroundColor: COLORS.SURFACE_TINT, borderRadius: '12px' }
              }}
            >
              <CalendarTodayIcon sx={{ fontSize: '22px' }} />
            </Box>
          </Badge>
        )}

        {/* Checklist */}
        <Badge 
          badgeContent={TASKS.length} 
          color="error"
          sx={{ '& .MuiBadge-badge': { fontWeight: 600, fontSize: '10px', minWidth: '16px', height: '16px', px: '4px' } }}
        >
          <Box
            onClick={onExpand}
            sx={{
              width: '40px',
              height: '40px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              color: COLORS.TEXT_SECONDARY,
              '&:hover': { color: COLORS.ACCENT, backgroundColor: COLORS.SURFACE_TINT, borderRadius: '12px' }
            }}
          >
            <ChecklistIcon sx={{ fontSize: '22px' }} />
          </Box>
        </Badge>

        {/* Chat */}
        <Badge 
          badgeContent={MESSAGE_ROWS.length} 
          color="error"
          sx={{ '& .MuiBadge-badge': { fontWeight: 600, fontSize: '10px', minWidth: '16px', height: '16px', px: '4px' } }}
        >
          <Box
            onClick={onExpand}
            sx={{
              width: '40px',
              height: '40px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              color: COLORS.TEXT_SECONDARY,
              '&:hover': { color: COLORS.ACCENT, backgroundColor: COLORS.SURFACE_TINT, borderRadius: '12px' }
            }}
          >
            <ChatBubbleOutlineIcon sx={{ fontSize: '22px' }} />
          </Box>
        </Badge>
      </Box>
    </Box>
  );
};

export default RightPanelCollapsed;
