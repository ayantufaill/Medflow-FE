import { useState } from 'react';
import { useNavigate, useLocation, Navigate, Link } from 'react-router-dom';
import { Box, Tabs, Tab, useTheme, Typography } from '@mui/material';
import PatientInsuranceCoverage from './reports/patient/PatientInsuranceCoverage';
import { TABS, PATIENT_REPORT_SUB_TABS } from './ReportsConfig';
import PatientReportsSubNav from '../../components/admin/reports/PatientReportsSubNav';
import ClinicalReportsSubNav from '../../components/admin/reports/ClinicalReportsSubNav';
import OthersReportsSubNav from '../../components/admin/reports/OthersReportsSubNav';
import SavingReportsSubNav from '../../components/admin/reports/SavingReportsSubNav';

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
      <Box sx={{ borderBottom: hoveredTab !== null ? 0 : 1, borderColor: 'divider', mb: hoveredTab !== null ? 0 : 3 }}>
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

      {/* Sub-nav — visible on hover */}
      {hoveredTab === 1 && <ClinicalReportsSubNav />}
      {hoveredTab === 2 && <PatientReportsSubNav />}
      {hoveredTab === 3 && <OthersReportsSubNav />}
      {hoveredTab === 4 && <SavingReportsSubNav />}

      {/* Page content */}
      <Box sx={{ p: 3, backgroundColor: '#fff', borderRadius: 2 }}>
        {location.pathname === '/admin/reports/patient/insurance-coverage' ? (
          <PatientInsuranceCoverage />
        ) : (
          <Box sx={{ textAlign: 'center', p: 3, backgroundColor: '#f9fafb', borderRadius: 2 }}>
            <Typography variant="h5" sx={{ mb: 1, fontWeight: 600 }}>
              {PATIENT_REPORT_SUB_TABS.find(sub => sub.path === location.pathname)?.label || 
               TABS[activeTab === -1 ? 0 : activeTab]?.label}
            </Typography>
            <Typography color="text.secondary">Content for this report is coming soon.</Typography>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default ReportsDashboard;
