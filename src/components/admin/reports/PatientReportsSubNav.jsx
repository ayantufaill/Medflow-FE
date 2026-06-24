import React from 'react';
import { Box, Typography, useTheme } from '@mui/material';
import { Link, useLocation } from 'react-router-dom';
import { PATIENT_REPORT_SUB_TABS } from '../../../pages/admin/ReportsConfig';

const PatientReportsSubNav = ({ left = 0 }) => {
  const theme = useTheme();
  const location = useLocation();

  return (
    <Box
      sx={{
        position: 'absolute',
        top: '48px',
        left: left,
        zIndex: 1100,
        backgroundColor: '#ffffff',
        border: '1px solid',
        borderColor: 'divider',
        boxShadow: '0px 8px 24px rgba(0,0,0,0.12)',
        borderRadius: '8px',
        display: 'flex',
        flexDirection: 'column',
        py: 1,
        minWidth: 260,
        maxWidth: 320,
        maxHeight: 400,
        overflowY: 'auto',
      }}
    >
      {PATIENT_REPORT_SUB_TABS.map((sub) => {
        const isActive = location.pathname === sub.path;
        return (
          <Typography
            key={sub.label}
            component={Link}
            to={sub.path}
            sx={{
              px: 2,
              py: 1.2,
              fontSize: '0.8rem',
              fontWeight: 500,
              color: isActive ? theme.palette.primary.main : 'text.secondary',
              textDecoration: 'none',
              display: 'block',
              transition: 'background-color 0.15s, color 0.15s',
              '&:hover': {
                color: theme.palette.primary.main,
                backgroundColor: 'rgba(25, 118, 210, 0.08)',
              },
            }}
          >
            {sub.label}
          </Typography>
        );
      })}
    </Box>
  );
};

export default PatientReportsSubNav;
