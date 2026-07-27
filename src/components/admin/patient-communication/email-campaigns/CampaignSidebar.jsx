import React from 'react';
import { Box, Typography } from '@mui/material';

const CampaignSidebar = ({ activeTab, setActiveTab }) => {
  const tabs = ['Home', 'Templates'];

  return (
    <Box sx={{ width: 220, minWidth: 220, borderRight: '1px solid #E5E9F2', pt: 3, bgcolor: '#FFFFFF' }}>
      <Typography sx={{ px: 3, mb: 2, fontSize: '0.75rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Menu</Typography>
      {tabs.map((item) => {
        const id = item.toLowerCase();
        const isActive = activeTab === id;
        return (
          <Box
            key={id}
            onClick={() => setActiveTab(id)}
            sx={{
              py: 1.2,
              px: 2,
              mx: 2,
              mb: 0.5,
              borderRadius: '6px',
              cursor: 'pointer',
              backgroundColor: isActive ? '#F0F5FF' : 'transparent',
              borderLeft: isActive ? '4px solid #3B82F6' : '4px solid transparent',
              transition: 'all 0.15s',
              '&:hover': { 
                backgroundColor: isActive ? '#F0F5FF' : '#F8FAFC',
              },
            }}
          >
            <Typography sx={{ 
              fontSize: '0.8rem', 
              fontWeight: isActive ? 600 : 500, 
              color: isActive ? '#3B82F6' : '#64748b',
            }}>
              {item}
            </Typography>
          </Box>
        );
      })}
    </Box>
  );
};

export default CampaignSidebar;
