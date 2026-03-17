import { useNavigate, useLocation } from 'react-router-dom';
import { Box, Button } from '@mui/material';

const DiagnosticNavbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Extract subsection from pathname
  const getSubsectionFromPathname = () => {
    const pathname = location.pathname;
    if (pathname.includes('/diagnostic-opinion/')) {
      const subsection = pathname.split('/diagnostic-opinion/')[1];
      return subsection || 'periodontal';
    }
    return 'periodontal';
  };
  
  const activeSubsection = getSubsectionFromPathname();

  // Navigation subsections for Diagnostic Opinion
  const diagnosticSubsections = [
    { id: 'periodontal', label: 'Periodontal', path: '/clinical/diagnostic-opinion/periodontal' },
    { id: 'biomechanical', label: 'Biomechanical', path: '/clinical/diagnostic-opinion/biomechanical' },
    { id: 'functional', label: 'Functional', path: '/clinical/diagnostic-opinion/functional' },
    { id: 'dentofacial', label: 'Dentofacial', path: '/clinical/diagnostic-opinion/dentofacial' },
  ];

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 1, mb: 3 }}>
      {diagnosticSubsections.map((subsection) => (
        <Button
          key={subsection.id}
          variant="text"
          size="small"
          onClick={() => navigate(subsection.path)}
          sx={{
            textTransform: 'none',
            fontWeight: 600,
            fontSize: '0.75rem',
            letterSpacing: '0.02em',
            py: 1,
            px: 1.5,
            borderRadius: 1,
            bgcolor: activeSubsection === subsection.id ? 'primary.main' : 'grey.100',
            color: activeSubsection === subsection.id ? 'primary.contrastText' : 'text.primary',
            minWidth: 'auto',
            '&:hover': {
              bgcolor: activeSubsection === subsection.id ? 'primary.dark' : 'grey.200',
            },
          }}
        >
          {subsection.label}
        </Button>
      ))}
    </Box>
  );
};

export default DiagnosticNavbar;
