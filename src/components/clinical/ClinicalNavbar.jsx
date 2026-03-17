import { useNavigate, useLocation } from 'react-router-dom';
import { Box, Button } from '@mui/material';

const ClinicalNavbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Extract section from pathname
  const getPathnameSection = () => {
    const pathname = location.pathname;
    if (pathname.startsWith('/clinical/')) {
      const section = pathname.replace('/clinical/', '');
      // Map section names to IDs
      const sectionMap = {
        'exam': 'exam',
        'diagnostic-opinion': 'diagnostic',
        'diagnostic-opinion/periodontal': 'diagnostic',
        'diagnostic-opinion/biomechanical': 'diagnostic',
        'diagnostic-opinion/functional': 'diagnostic',
        'diagnostic-opinion/dentofacial': 'diagnostic',
        'treatment-plan': 'treatment',
        'adjunctive-therapy': 'adjunctive',
        'rx': 'rx',
        'referral': 'referral',
        'progress-notes': 'progress',
        'lab-case': 'lab',
        'ai-conversation': 'ai',
      };
      return sectionMap[section] || 'exam';
    }
    return 'exam';
  };
  
  const activeSection = getPathnameSection();

  // Navigation sections for the clinical page
  const clinicalSections = [
    { id: 'exam', label: 'Exam', path: '/clinical/exam' },
    { id: 'diagnostic', label: 'Diagnostic Opinion', path: '/clinical/diagnostic-opinion' },
    { id: 'treatment', label: 'Treatment Plan', path: '/clinical/treatment-plan' },
    { id: 'adjunctive', label: 'Adjunctive Therapy', path: '/clinical/adjunctive-therapy' },
    { id: 'rx', label: 'RX', path: '/clinical/rx' },
    { id: 'referral', label: 'Referral', path: '/clinical/referral' },
    { id: 'progress', label: 'Progress Notes', path: '/clinical/progress-notes' },
    { id: 'lab', label: 'Lab Case', path: '/clinical/lab-case' },
    { id: 'ai', label: 'AI Conversation', path: '/clinical/ai-conversation' },
  ];

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 1, mb: 3 }}>
      {clinicalSections.map((section) => (
        <Button
          key={section.id}
          variant="text"
          size="small"
          onClick={() => navigate(section.path)}
          sx={{
            textTransform: 'none',
            fontWeight: 600,
            fontSize: '0.75rem',
            letterSpacing: '0.02em',
            py: 1,
            px: 1.5,
            borderRadius: 1,
            bgcolor: activeSection === section.id ? 'primary.main' : 'grey.100',
            color: activeSection === section.id ? 'primary.contrastText' : 'text.primary',
            minWidth: 'auto',
            '&:hover': {
              bgcolor: activeSection === section.id ? 'primary.dark' : 'grey.200',
            },
          }}
        >
          {section.label}
        </Button>
      ))}
    </Box>
  );
};

export default ClinicalNavbar;
