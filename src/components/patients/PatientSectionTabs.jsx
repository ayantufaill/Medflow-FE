import { useNavigate } from 'react-router-dom';
import { Box, Typography } from '@mui/material';
import { COLORS } from '../../constants/colors';
import { fontSize, fontWeight } from '../../constants/styles';

export const PATIENT_SECTION_TABS = [
  { id: 'details', label: 'Patient Details' },
  // { id: 'vitals', label: 'Vitals' },
  { id: 'medical', label: 'Medical History' },
  { id: 'dental', label: 'Dental History' },
  { id: 'insurance', label: 'Insurance' },
  { id: 'additional_docs', label: 'Additional Docs' },
  { id: 'signed_docs', label: 'Signed Docs' },
];

/**
 * Shared tab bar for patient section. Always visible on /patients, /patients/details/:id, /patients/:id/signed-documents, etc.
 * One click navigates to that section. Pass activeTab and optional patientId (when viewing a specific patient).
 *
 * Independent from the page header/body below it — a plain nav bar with its
 * own underlined-active-tab styling, not a filled pill.
 */
const PatientSectionTabs = ({ activeTab, patientId = '' }) => {
  const navigate = useNavigate();

  const handleTabClick = (tabId) => {
    if (tabId === 'details') {
      if (patientId) navigate(`/patients/details/${patientId}`);
      else navigate('/patients');
      return;
    }
    if (tabId === 'vitals') {
      if (patientId) navigate(`/vital-signs/patient/${patientId}`);
      else navigate('/vital-signs');
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
      if (patientId) navigate(`/patients/${patientId}/additional-documents`);
      else navigate('/patients?tab=additional_docs', { replace: true });
      return;
    }
    navigate('/patients', { replace: true });
  };

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, px: 2.5, borderBottom: `1px solid ${COLORS.BORDER}`, overflowX: 'auto' }}>
      {PATIENT_SECTION_TABS.map((tab) => {
        const active = activeTab === tab.id;
        return (
          <Box
            key={tab.id}
            onClick={() => handleTabClick(tab.id)}
            sx={{
              py: 1.5,
              cursor: 'pointer',
              borderBottom: '2px solid',
              borderColor: active ? COLORS.ACCENT : 'transparent',
              flexShrink: 0,
            }}
          >
            <Typography
              sx={{
                fontFamily: 'Inter',
                fontSize: fontSize.md,
                fontWeight: active ? fontWeight.semibold : fontWeight.medium,
                color: active ? COLORS.ACCENT : COLORS.TEXT_SECONDARY,
                whiteSpace: 'nowrap',
                '&:hover': { color: COLORS.ACCENT },
              }}
            >
              {tab.label}
            </Typography>
          </Box>
        );
      })}
    </Box>
  );
};

export default PatientSectionTabs;
