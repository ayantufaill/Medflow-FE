import { useState, useEffect, useRef } from 'react';
import { Box } from '@mui/material';
import LeftPanelTabs from './LeftPanelTabs';
import PatientSearch from './PatientSearch';
import PatientCard from './PatientCard';
import AppointmentSummaryCard from './AppointmentSummaryCard';
import AppointmentChecklist from './AppointmentChecklist';
import PatientActions from './PatientActions';
import PendingReschedules from './PendingReschedules';
import EmptySlotsSearch from './EmptySlotsSearch';
import ProductivityPanel from './ProductivityPanel';
import { usePatient } from '../../../hooks/redux';
import { COLORS } from '../../../constants/colors';

// LeftPanel orchestrates the left-rail of the schedule page.
// - PatientSearch is always visible — it lets the user search and select a patient.
// - PatientCard and PatientActions only mount after a patient is selected so
//   they never render in an empty/null state.

const LeftPanel = () => {
  const [activeTab, setActiveTab] = useState('Patient');
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  // Keep a ref so the event handler always sees the latest value without stale closure
  const selectedApptRef = useRef(null);

  // Read currentPatient from Redux to conditionally show patient sub-components.
  const { currentPatient, fetchById } = usePatient();

  // Listen for appointment-clicked custom events fired by AppointmentCard.
  // Using a ref to avoid re-subscribing on every render.
  useEffect(() => {
    const handleApptClick = (e) => {
      const appt = e.detail || null;
      selectedApptRef.current = appt;
      setSelectedAppointment(appt);
      
      if (appt && appt.patientId) {
        const pId = typeof appt.patientId === 'object' 
          ? appt.patientId._id || appt.patientId.id || appt.patientId.PatNum 
          : appt.patientId;
        if (pId) fetchById(pId);
      }
    };
    window.addEventListener('appointment-card-clicked', handleApptClick);
    return () => window.removeEventListener('appointment-card-clicked', handleApptClick);
  }, [fetchById]);

  // Clear selected appointment if the user manually selects a different patient
  useEffect(() => {
    if (selectedAppointment && currentPatient) {
      const apptPatientId = selectedAppointment.patientId;
      const currentId = currentPatient._id || currentPatient.id;
      if (apptPatientId && currentId && String(apptPatientId) !== String(currentId)) {
        selectedApptRef.current = null;
        setSelectedAppointment(null);
      }
    }
  }, [currentPatient, selectedAppointment]);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', width: '100%', height: '100%', overflow: 'hidden' }}>

      {/* Sticky tab strip */}
      <Box sx={{ position: 'sticky', top: 0, zIndex: 2, backgroundColor: COLORS.SURFACE_CARD, flexShrink: 0 }}>
        <LeftPanelTabs activeTab={activeTab} onChange={setActiveTab} />
      </Box>

      {/* Scrollable panel body */}
      <Box sx={{ flex: 1, overflowY: 'auto', p: '12px', backgroundColor: COLORS.SURFACE_CARD }}>
        {activeTab === 'Patient' && (
          <>
            {/* Search is always shown */}
            <PatientSearch />

            {/* PatientCard renders once a patient is selected */}
            {currentPatient && (
              <PatientCard key={currentPatient._id || currentPatient.id} />
            )}

            {/* Appointment summary & checklist — shown as soon as an appointment card is clicked.
                Deliberately NOT gated on currentPatient to avoid timing races. */}
            {selectedAppointment && (
              <>
                <AppointmentSummaryCard appointment={selectedAppointment} />
                <AppointmentChecklist />
              </>
            )}

            {/* Actions require a patient */}
            {currentPatient && (
              <PatientActions key={`actions-${currentPatient._id || currentPatient.id}`} appointment={selectedAppointment} />
            )}
          </>
        )}

        {activeTab === 'Pending' && (
          <PendingReschedules />
        )}

        {activeTab === 'Search' && (
          <EmptySlotsSearch />
        )}

        {activeTab === 'Productivity' && (
          <ProductivityPanel />
        )}
      </Box>

    </Box>
  );
};

export default LeftPanel;
