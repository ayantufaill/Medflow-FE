import { useNavigate, useLocation } from 'react-router-dom';
import { Box, Tabs, Tab } from '@mui/material';

const DiagnosticNavbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Extract subsection from pathname
  const getSubsectionFromPathname = () => {
    const pathname = location.pathname;
    if (pathname.includes('/diagnostic-opinion/')) {
      const subsection = pathname.split('/diagnostic-opinion/')[1];
      return subsection || 'biomechanical';
    }
    return 'biomechanical';
  };
  
  const activeSubsection = getSubsectionFromPathname();

  // Navigation subsections for Diagnostic Opinion
  const diagnosticSubsections = [
    { id: 'biomechanical', label: 'Biomechanical', path: '/clinical/diagnostic-opinion/biomechanical' },
    { id: 'functional', label: 'Functional', path: '/clinical/diagnostic-opinion/functional' },
    { id: 'dentofacial', label: 'Dentofacial', path: '/clinical/diagnostic-opinion/dentofacial' },
    { id: 'periodontal', label: 'Periodontal', path: '/clinical/diagnostic-opinion/periodontal' },
  ];

  // Find index of active subsection
  const tabIndex = diagnosticSubsections.findIndex(sub => sub.id === activeSubsection);

  return (
    <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2, px: 4 }}>
      <Tabs 
        value={tabIndex >= 0 ? tabIndex : 0} 
        onChange={(e, newValue) => navigate(diagnosticSubsections[newValue].path)}
        variant="scrollable"
        scrollButtons="auto"
      >
        {diagnosticSubsections.map((subsection) => {
          const isPeriodontal = subsection.id === 'periodontal';
          return (
            <Tab 
              key={subsection.id}
              label={subsection.label}
              sx={{ 
                textTransform: 'none',
                fontWeight: 500,
                fontSize: '0.875rem',
                minHeight: '48px',
                color: isPeriodontal ? '#9e9e9e' : undefined,
                '&.Mui-selected': {
                  color: isPeriodontal ? '#616161' : undefined
                }
              }} 
            />
          );
        })}
      </Tabs>
    </Box>
  );
};

export default DiagnosticNavbar;
