import React, { useState } from 'react';
import { Box, Typography, Grid, IconButton, Menu, MenuItem, ListItemIcon, ListItemText } from '@mui/material';
import { MoreVert as MoreVertIcon, AssignmentOutlined as AssignmentIcon, EditOutlined as EditIcon, DeleteOutline as DeleteIcon } from '@mui/icons-material';

import { communicationService } from '../../../../services/communication.service';

const SystemQuestionnairesTab = ({ questionnaires, onOpenSystem, refreshList }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [activeCard, setActiveCard] = useState(null);

  const handleOpenMenu = (event, card, idx) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
    setActiveCard({ ...card, index: idx });
  };

  const handleCloseMenu = (event) => {
    if (event) event.stopPropagation();
    setAnchorEl(null);
    setActiveCard(null);
  };

  const handleEdit = (event) => {
    event.stopPropagation();
    if (activeCard) {
      onOpenSystem(activeCard.description, activeCard._id);
    }
    handleCloseMenu();
  };

  const handleDelete = async (event) => {
    event.stopPropagation();
    if (activeCard !== null) {
      try {
        await communicationService.deleteQuestionnaire(activeCard._id);
        if (refreshList) refreshList();
      } catch (error) {
        console.error('Failed to delete questionnaire:', error);
      }
    }
    handleCloseMenu();
  };

  return (
    <Box sx={{ flex: 1 }}>
      {/* System Header */}
      <Box sx={{ mb: 4 }}>
        <Typography sx={{ fontWeight: 700, fontSize: '1.2rem', color: '#1E293B', mb: 0.5 }}>
          System Questionnaires
        </Typography>
        <Typography sx={{ fontSize: '0.85rem', color: '#64748b' }}>
          Pre-built questionnaires provided by Medflow.
        </Typography>
      </Box>

      <Grid container spacing={3}>
        {questionnaires?.map((card, idx) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={card._id || idx}>
            <Box 
              onClick={() => onOpenSystem(card.description, card._id)}
              sx={{ 
                bgcolor: '#fff',
                p: 2.5,
                display: 'flex', flexDirection: 'column', 
                cursor: 'pointer', borderRadius: '12px',
                boxShadow: '0 1px 3px rgba(0,0,0,0.02)',
                border: '1px solid #E5E9F2',
                transition: 'all 0.2s ease-in-out', 
                '&:hover': { transform: 'translateY(-2px)', boxShadow: '0 4px 12px rgba(0,0,0,0.08)', borderColor: '#cbd5e1' },
                position: 'relative',
                height: '100%'
              }}
            >
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3 }}>
                <Box sx={{ bgcolor: '#F0F5FF', p: 1, borderRadius: 2, display: 'flex' }}>
                   <AssignmentIcon sx={{ color: '#3B82F6', fontSize: '1.2rem' }} />
                </Box>
                <IconButton 
                  size="small" 
                  sx={{ color: '#94a3b8', p: 0.5, '&:hover': { color: '#1E293B', bgcolor: '#F8FAFC' } }} 
                  onClick={(e) => handleOpenMenu(e, card, idx)}
                >
                  <MoreVertIcon sx={{ fontSize: '1.2rem' }}/>
                </IconButton>
              </Box>
              <Box sx={{ mt: 'auto' }}>
                <Typography sx={{ fontSize: '0.95rem', color: '#1E293B', fontWeight: 600, mb: 0.5 }}>{card.description}</Typography>
                <Typography sx={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 500 }}>{card.questionsCount} Questions</Typography>
              </Box>
            </Box>
          </Grid>
        ))}
      </Grid>

      {/* Card Dropdown Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleCloseMenu}
        PaperProps={{
          sx: {
            mt: 0.5,
            minWidth: 150,
            boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
            borderRadius: 2,
            border: '1px solid #E5E9F2',
          }
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <MenuItem onClick={handleEdit} sx={{ py: 1.5, px: 2 }}>
          <ListItemIcon sx={{ minWidth: 32 }}>
            <EditIcon sx={{ fontSize: '1.1rem', color: '#64748b' }} />
          </ListItemIcon>
          <ListItemText primary="Edit" primaryTypographyProps={{ fontSize: '0.85rem', fontWeight: 500, color: '#1E293B' }} />
        </MenuItem>
        <MenuItem onClick={handleDelete} sx={{ py: 1.5, px: 2, '&:hover': { bgcolor: '#fef2f2' } }}>
          <ListItemIcon sx={{ minWidth: 32 }}>
            <DeleteIcon sx={{ fontSize: '1.1rem', color: '#ef4444' }} />
          </ListItemIcon>
          <ListItemText primary="Delete" primaryTypographyProps={{ fontSize: '0.85rem', fontWeight: 500, color: '#ef4444' }} />
        </MenuItem>
      </Menu>
    </Box>
  );
};

export default SystemQuestionnairesTab;
