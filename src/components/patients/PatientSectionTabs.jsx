import { useNavigate } from 'react-router-dom';
import { Box, Button } from '@mui/material';

export const PATIENT_SECTION_TABS = [
  { id: 'details', label: 'PATIENT DETAILS' },
  { id: 'medical', label: 'MEDICAL HISTORY' },
  { id: 'dental', label: 'DENTAL HISTORY' },
  { id: 'insurance', label: 'INSURANCE' },
  { id: 'additional_docs', label: 'ADDITIONAL DOCS' },
  { id: 'signed_docs', label: 'SIGNED DOCS' },
];

/**
 * Shared tab bar for patient section. Always visible on /patients, /patients/details/:id, /patients/:id/signed-documents, etc.
 * One click navigates to that section. Pass activeTab and optional patientId (when viewing a specific patient).
 */
const PatientSectionTabs = ({ activeTab, patientId = '' }) => {
  const navigate = useNavigate();

  const handleTabClick = (tabId) => {
    if (tabId === 'details') {
      if (patientId) navigate(`/patients/details/${patientId}`);
      else navigate('/patients');
      return;
    }
    if (tabId === 'signed_docs') {
      if (patientId) navigate(`/patients/${patientId}/signed-documents`);
      else navigate('/patients');
      return;
    }
    if (tabId === 'medical') {
      if (patientId) navigate(`/patients/${patientId}/medical-history`);
      else navigate('/patients?tab=medical', { replace: true });
      return;
    }
    if (tabId === 'insurance') {
      if (patientId) navigate(`/patients/details/${patientId}?tab=insurance`, { replace: true });
      else navigate('/patients?tab=insurance', { replace: true });
      return;
    }
    if (tabId === 'dental') {
      if (patientId) navigate(`/patients/${patientId}/dental-history`);
      else navigate('/patients?tab=dental', { replace: true });
      return;
    }
    if (tabId === 'additional_docs') {
      if (patientId) navigate('/patients');
      else navigate(`/patients?tab=${tabId}`, { replace: true });
      return;
    }
    navigate('/patients', { replace: true });
  };

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 1, mb: 2 }}>
      {PATIENT_SECTION_TABS.map((tab) => (
        <Button
          key={tab.id}
          variant="text"
          size="small"
          onClick={() => handleTabClick(tab.id)}
          sx={{
            textTransform: 'none',
            fontWeight: 600,
            fontSize: '0.75rem',
            letterSpacing: '0.02em',
            py: 1,
            px: 1.5,
            borderRadius: 1,
            bgcolor: activeTab === tab.id ? 'primary.main' : 'grey.100',
            color: activeTab === tab.id ? 'primary.contrastText' : 'text.primary',
            minWidth: 'auto',
            '&:hover': {
              bgcolor: activeTab === tab.id ? 'primary.dark' : 'grey.200',
            },
          }}
        >
          {tab.label}
        </Button>
      ))}
    </Box>
  );
};

export default PatientSectionTabs;
