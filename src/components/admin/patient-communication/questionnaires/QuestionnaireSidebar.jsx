import React from 'react';
import { Box, Typography } from '@mui/material';

const QuestionnaireSidebar = ({ activeTab, setActiveTab }) => {
  return (
    <Box sx={{ width: 220, minWidth: 220, borderRight: '1px solid #e0e0e0', pt: 2, height: '100%' }}>
      {['Custom Questionnaires', 'System Questionnaires'].map((item) => {
        const id = item.split(' ')[0].toLowerCase(); // 'custom' or 'system'
        return (
          <Box
            key={id}
            onClick={() => setActiveTab(id)}
            sx={{
              py: 1.5,
              px: 3,
              cursor: 'pointer',
              borderLeft: activeTab === id ? '4px solid #1a3a6b' : '4px solid transparent',
              backgroundColor: activeTab === id ? '#f4f6f9' : 'transparent',
              transition: 'background-color 0.2s',
              '&:hover': { backgroundColor: '#f9f9f9' },
            }}
          >
            <Typography sx={{ fontSize: '0.85rem', fontWeight: activeTab === id ? 600 : 400, color: activeTab === id ? '#222' : '#555' }}>
              {item}
            </Typography>
          </Box>
        );
      })}
    </Box>
  );
};

export default QuestionnaireSidebar;
