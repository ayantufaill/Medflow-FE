import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import EmptyStateIllustration from './EmptyStateIllustration';

const CustomQuestionnairesTab = ({ onOpenCreateModal }) => {
  return (
    <Box sx={{ flex: 1 }}>
      {/* Custom Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 8 }}>
        <Typography sx={{ fontWeight: 700, fontSize: '1.2rem', color: '#1E293B' }}>
          Custom Questionnaires
        </Typography>
        <Button 
          variant="contained" 
          onClick={onOpenCreateModal}
          sx={{ bgcolor: '#3B82F6', textTransform: 'none', fontWeight: 600, fontSize: '0.85rem', borderRadius: 1.5, px: 3, py: 1, boxShadow: 'none', transition: 'all 0.15s', '&:hover': { bgcolor: '#2563EB', boxShadow: 'none' } }}
        >
          Create Questionnaire
        </Button>
      </Box>

      {/* Empty State */}
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mt: 4 }}>
        <EmptyStateIllustration />
        <Typography sx={{ fontSize: '1.1rem', fontWeight: 700, color: '#1E293B', mt: 4, mb: 3 }}>
          No Questionnaires Yet
        </Typography>
        <Button 
          variant="contained" 
          onClick={onOpenCreateModal}
          sx={{ bgcolor: '#3B82F6', textTransform: 'none', fontWeight: 600, fontSize: '0.85rem', borderRadius: 1.5, px: 4, py: 1, boxShadow: 'none', transition: 'all 0.15s', '&:hover': { bgcolor: '#2563EB', boxShadow: 'none' } }}
        >
          Get Started
        </Button>
      </Box>
    </Box>
  );
};

export default CustomQuestionnairesTab;
