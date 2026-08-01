import React from 'react';
import { Box, Typography, Button } from '@mui/material';

const ReminderSidebar = ({ activeTab, setActiveTab, onSave }) => {
  const sidebarItems = [
    { id: 'reminder-config', label: 'Reminder Config' },
    { id: 'email-defaults', label: 'Welcome/Update Email Defaults' },
    { id: 'template-settings', label: 'Email Template Settings' },
    { id: 'notifications', label: 'Email Notifications' },
  ];

  return (
    <Box sx={{ width: 230, minWidth: 230, py: 2.5, pt: 0 }}>
      {sidebarItems.map((item) => (
        <Box
          key={item.id}
          onClick={() => setActiveTab(item.id)}
          sx={{
            mx: 3,
            px: 2,
            py: 1.2,
            mb: 0.5,
            borderRadius: '6px',
            cursor: 'pointer',
            bgcolor: activeTab === item.id ? '#F0F5FF' : 'transparent',
            borderLeft: activeTab === item.id ? '4px solid #3B82F6' : '4px solid transparent',
            '&:hover': { bgcolor: activeTab === item.id ? '#F0F5FF' : '#F8FAFC' },
            transition: 'all 0.15s',
          }}
        >
          <Typography sx={{
            fontSize: '0.8rem',
            fontWeight: activeTab === item.id ? 600 : 400,
            color: activeTab === item.id ? '#3B82F6' : '#64748b',
            lineHeight: 1.4,
          }}>
            {item.label}
          </Typography>
        </Box>
      ))}
    </Box>
  );
};

export default ReminderSidebar;
