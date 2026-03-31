import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Box, Tabs, Tab } from '@mui/material';

const ExamNavbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Navigation subsections for Exam - defined outside to avoid recreation
  const examSubsections = [
    { id: 'radiographic', label: 'Radiographic', path: '/clinical/exam/radiographic' },
    { id: 'tmj', label: 'TMJ', path: '/clinical/exam/tmj' },
    { id: 'head-neck', label: 'Head & Neck', path: '/clinical/exam/head-neck' },
    { id: 'tooth-structure', label: 'Tooth Structure', path: '/clinical/exam/tooth-structure' },
    { id: 'morphological', label: 'Morphological', path: '/clinical/exam/morphological' },
    { id: 'periodontal', label: 'Periodontal', path: '/clinical/exam/periodontal' },
    { id: 'dentofacial', label: 'Dentofacial', path: '/clinical/exam/dentofacial' },
    { id: 'airway', label: 'Airway', path: '/clinical/exam/airway' },
  ];

  // Calculate active tab index based on current location
  const getActiveTabIndex = () => {
    const pathname = location.pathname;
    
    // Handle various exam path patterns
    if (pathname === '/clinical/exam' || pathname === '/exam') {
      return 0; // radiographic
    }
    
    if (pathname.includes('/exam/')) {
      const parts = pathname.split('/exam/');
      if (parts.length > 1 && parts[1]) {
        const subsection = parts[1];
        const tabIndex = examSubsections.findIndex(sub => sub.id === subsection);
        return tabIndex >= 0 ? tabIndex : 0;
      }
    }
    
    // Default fallback
    return 0;
  };

  const activeTabIndex = getActiveTabIndex();

  console.log('ExamNavbar - Rendering with activeTabIndex:', activeTabIndex, 'pathname:', location.pathname);

  return (
    <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2, px: 4 }}>
      <Tabs 
        value={activeTabIndex}
        onChange={(e, newValue) => navigate(examSubsections[newValue].path)}
        variant="scrollable"
        scrollButtons="auto"
      >
        {examSubsections.map((subsection) => (
          <Tab 
            key={subsection.id}
            label={subsection.label}
            sx={{ 
              textTransform: 'none',
              fontWeight: 500,
              fontSize: '0.875rem',
              minHeight: '48px'
            }} 
          />
        ))}
      </Tabs>
    </Box>
  );
};

export default ExamNavbar;
