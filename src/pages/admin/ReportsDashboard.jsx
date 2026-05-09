import { useState } from 'react';
import { useNavigate, useLocation, Navigate, Link } from 'react-router-dom';
import { Box, Tabs, Tab, useTheme, Typography } from '@mui/material';

const TABS = [
  { label: 'Financial Report', path: '/admin/reports/financial' },
  { label: 'Clinical Report', path: '/admin/reports/clinical' },
  { label: 'Patient Report', path: '/admin/reports/patient' },
  { label: 'Others', path: '/admin/reports/others' },
  { label: 'Saving Report', path: '/admin/reports/saving' },
];

const PATIENT_REPORT_SUB_TABS = [
  { label: 'Patient by Membership Plan', path: '/admin/reports/patient/membership-plan' },
  { label: 'Referral By Patient Report', path: '/admin/reports/patient/referral-by-patient' },
  { label: 'Online Scheduling Referral Report', path: '/admin/reports/patient/online-scheduling-referral' },
  { label: 'Patients By Flag Report', path: '/admin/reports/patient/by-flag' },
  { label: 'Cancelled Appointments Report', path: '/admin/reports/patient/cancelled-appointments' },
  { label: 'No Show Appointments Report', path: '/admin/reports/patient/no-show-appointments' },
  { label: 'Appointments Report', path: '/admin/reports/patient/appointments' },
  { label: 'Duplicate Patients Report', path: '/admin/reports/patient/duplicate-patients' },
  { label: 'Patient By Contact Preferences', path: '/admin/reports/patient/contact-preferences' },
  { label: 'Patient By Last Appointment', path: '/admin/reports/patient/last-appointment' },
  { label: 'Patient By Next Appointment', path: '/admin/reports/patient/next-appointment' },
  { label: 'Referral Document Report', path: '/admin/reports/patient/referral-document' },
  { label: 'Lab Case Report', path: '/admin/reports/patient/lab-case' },
  { label: 'Patient By Discount or Edited Fee', path: '/admin/reports/patient/discount-edited-fee' },
  { label: 'Review Report', path: '/admin/reports/patient/review' },
  { label: 'Notifications Report', path: '/admin/reports/patient/notifications' },
  { label: 'Procedures Report', path: '/admin/reports/patient/procedures' },
  { label: 'Patient Trackers', path: '/admin/reports/patient/trackers' },
];

const ReportsDashboard = () => {
  const theme = useTheme();
  const location = useLocation();
  const [hoveredTab, setHoveredTab] = useState(null);

  const activeTab = TABS.findIndex((tab) => location.pathname.startsWith(tab.path));

  // If we're at /admin/reports, redirect to the first tab
  if (location.pathname === '/admin/reports') {
    return <Navigate to="/admin/reports/financial" replace />;
  }

  return (
    <Box onMouseLeave={() => setHoveredTab(null)}>
      <Box sx={{ borderBottom: hoveredTab === 2 ? 0 : 1, borderColor: 'divider', mb: hoveredTab === 2 ? 0 : 3 }}>
        <Tabs
          value={activeTab === -1 ? 0 : activeTab}
          variant="scrollable"
          scrollButtons="auto"
          sx={{
            '& .MuiTab-root': {
              fontWeight: 600,
              textTransform: 'none',
              fontSize: '0.875rem',
              minWidth: 140,
              color: 'text.secondary',
              borderBottom: '3px solid transparent',
              '&.Mui-selected': {
                color: theme.palette.primary.main,
              },
            },
            '& .MuiTabs-indicator': {
              height: 3,
              backgroundColor: theme.palette.primary.main,
            },
          }}
        >
          {TABS.map((tab, index) => (
            <Tab
              key={tab.label}
              label={tab.label}
              component={Link}
              to={tab.path}
              disableRipple
              onMouseEnter={() => setHoveredTab(index)}
            />
          ))}
        </Tabs>
      </Box>

      {/* Sub-nav — visible on hover of Patient Report (index 2) */}
      {hoveredTab === 2 && (
        <Box
          sx={{
            borderBottom: 1,
            borderColor: 'divider',
            borderTop: 1,
            mx: -3,
            px: 3,
            mb: 3,
            backgroundColor: '#f0f4fa',
            display: 'flex',
            gap: 0,
            overflowX: 'auto',
            scrollbarWidth: 'none',
            '&::-webkit-scrollbar': { display: 'none' },
          }}
        >
          {PATIENT_REPORT_SUB_TABS.map((sub) => (
            <Typography
              key={sub.label}
              component={Link}
              to={sub.path}
              sx={{
                px: 2,
                py: 1.5,
                fontSize: '0.8rem',
                fontWeight: 500,
                color: 'text.secondary',
                textDecoration: 'none',
                whiteSpace: 'nowrap',
                borderBottom: '2px solid transparent',
                '&:hover': {
                  color: theme.palette.primary.main,
                  borderBottomColor: theme.palette.primary.main,
                },
              }}
            >
              {sub.label}
            </Typography>
          ))}
        </Box>
      )}

      {/* Page content */}
      <Box sx={{ p: 3, textAlign: 'center', backgroundColor: '#f9fafb', borderRadius: 2 }}>
        <Typography variant="h5" sx={{ mb: 1, fontWeight: 600 }}>
          {PATIENT_REPORT_SUB_TABS.find(sub => sub.path === location.pathname)?.label || 
           TABS[activeTab === -1 ? 0 : activeTab]?.label}
        </Typography>
        <Typography color="text.secondary">Content for this report is coming soon.</Typography>
      </Box>
    </Box>
  );
};

export default ReportsDashboard;
