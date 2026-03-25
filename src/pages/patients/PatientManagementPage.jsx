import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Box, Typography } from '@mui/material';
import PatientsListPage from './PatientsListPage';
import PatientSectionTabs from '../../components/patients/PatientSectionTabs';

const defaultTab = 'view_all';

/**
 * List-only page at /patients. Tabs navigate to dedicated routes (details, signed-documents, etc.).
 * Keeps this page light so the app stays fast.
 */
const PatientManagementPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const urlPatientId = searchParams.get('patientId') ?? '';
  const urlTab = searchParams.get('tab') ?? defaultTab;
  const [activeTab, setActiveTab] = useState(urlTab);

  useEffect(() => {
    setActiveTab(urlTab);
  }, [urlTab]);

  // When insurance tab is selected with patientId, redirect to patient details (insurance tab)
  useEffect(() => {
    if (activeTab === 'insurance' && urlPatientId) {
      navigate(`/patients/details/${urlPatientId}?tab=insurance`, { replace: true });
    }
  }, [activeTab, urlPatientId, navigate]);

  const handlePatientSelect = (patientId, patientFromList) => {
    setActiveTab('details');
    navigate(`/patients/details/${patientId}`, { state: patientFromList ? { patient: patientFromList } : {} });
  };

  const renderTabContent = () => {
    if (activeTab === 'view_all') {
      return <PatientsListPage embedded onPatientSelect={handlePatientSelect} />;
    }
    const messages = {
      details: 'Select a patient from the list above to view details, or open a patient from the list.',
      medical: 'Medical history is available on the patient detail page.',
      dental: 'Dental history is available on the patient detail page.',
      insurance: 'Select a patient from the list above to view insurance, or open a patient and click the Insurance tab.',
      additional_docs: 'Additional documents — coming soon.',
      signed_docs: 'Select a patient from the list, then open Signed Docs.',
    };
    return (
      <Box sx={{ p: 3, textAlign: 'center', color: 'text.secondary', minHeight: 200 }}>
        <Typography variant="body1">{messages[activeTab] || 'Select a tab above.'}</Typography>
      </Box>
    );
  };

  return (
    <Box sx={{ minHeight: 200, backgroundColor: 'background.paper' }}>
      {activeTab !== 'view_all' && (
        <PatientSectionTabs activeTab={activeTab} patientId={urlPatientId} />
      )}
      <Box>{renderTabContent()}</Box>
    </Box>
  );
};

export default PatientManagementPage;
