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
import { useDispatch, useSelector } from 'react-redux';
import { COLORS } from '../../../constants/colors';
import {
  fetchPatientHistory,
  selectPatientHistoryList,
  selectPatientHistoryLoading,
} from '../../../store/slices/appointmentSlice';

// LeftPanel orchestrates the left-rail of the schedule page.
// - PatientSearch is always visible — it lets the user search and select a patient.
// - PatientCard and PatientActions only mount after a patient is selected so
//   they never render in an empty/null state.

const LeftPanel = ({ selectedAppointment: externalSelectedAppointment, onSelectAppointment }) => {
  const dispatch = useDispatch();
  const [activeTab, setActiveTab] = useState('Patient');
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [showAllHistory, setShowAllHistory] = useState(false);
  // Keep a ref so the event handler always sees the latest value without stale closure
  const selectedApptRef = useRef(null);
  // Read currentPatient from Redux to conditionally show patient sub-components.
  const { currentPatient, fetchById, setPatientId, loading } = usePatient();

  // Sync with external selection (from parent)
  useEffect(() => {
    if (externalSelectedAppointment && externalSelectedAppointment !== selectedAppointment) {
      // eslint-disable-next-line react-hooks/exhaustive-deps
      setSelectedAppointment(externalSelectedAppointment);
      selectedApptRef.current = externalSelectedAppointment;
      const pId = externalSelectedAppointment.patientId && typeof externalSelectedAppointment.patientId === 'object'
        ? externalSelectedAppointment.patientId._id || externalSelectedAppointment.patientId.id || externalSelectedAppointment.patientId.PatNum
        : externalSelectedAppointment.patientId;
      if (pId) {
        setPatientId(pId);
        fetchById(pId);
      }
    }
  }, [externalSelectedAppointment, fetchById, setPatientId]);

  // Listen for appointment-clicked custom events fired by AppointmentCard.
  // Using a ref to avoid re-subscribing on every render.
  useEffect(() => {
    const handleApptClick = (e) => {
      const appt = e.detail || null;
      selectedApptRef.current = appt;
      setSelectedAppointment(appt);
      if (onSelectAppointment) onSelectAppointment(appt);
      
      if (appt && appt.patientId) {
        const pId = typeof appt.patientId === 'object' 
          ? appt.patientId._id || appt.patientId.id || appt.patientId.PatNum 
          : appt.patientId;
        if (pId) {
          setPatientId(pId);
          fetchById(pId);
        }
      }
    };
    window.addEventListener('appointment-card-clicked', handleApptClick);
    return () => window.removeEventListener('appointment-card-clicked', handleApptClick);
  }, [fetchById, onSelectAppointment, setPatientId]);

  // Clear selected appointment if the user manually selects a different patient
  useEffect(() => {
    if (selectedAppointment && currentPatient && !loading) {
      const apptPatientId = selectedAppointment.patientId && typeof selectedAppointment.patientId === 'object'
        ? selectedAppointment.patientId._id || selectedAppointment.patientId.id || selectedAppointment.patientId.PatNum
        : selectedAppointment.patientId;
      const currentId = currentPatient._id || currentPatient.id;
      if (apptPatientId && currentId && String(apptPatientId) !== String(currentId)) {
        selectedApptRef.current = null;
        // eslint-disable-next-line react-hooks/exhaustive-deps
        setSelectedAppointment(null);
      }
    }
  }, [currentPatient, selectedAppointment, loading]);

  // Derive live appointment data from Redux to ensure we have the latest updates (like completed procedures and tags)
  // after a save action. We fall back to the selectedAppointment snapshot (or its raw version) if not found in Redux.
  const appointmentsList = useSelector((state) => state.appointment?.list || []);
  const patientHistoryList = useSelector(selectPatientHistoryList) || [];
  const patientHistoryLoading = useSelector(selectPatientHistoryLoading);
  const selectedAppointmentId = selectedAppointment?._id || selectedAppointment?.id;
  const getAppointmentId = (appointment) => appointment?._id || appointment?.id || appointment?.appointmentId || appointment?.AptNum;
  const getRecareSourceId = (appointment) =>
    appointment?.customFields?.recareSourceAppointmentId ||
    appointment?.customFields?.sourceAppointmentId ||
    appointment?.recareSourceAppointmentId ||
    appointment?.sourceAppointmentId ||
    null;
  const liveAppt = selectedAppointment 
    ? (appointmentsList.find(a => String(a._id || a.id) === String(selectedAppointmentId)) 
       || selectedAppointment.rawAppointment 
       || selectedAppointment)
    : null;
  const sourceAppointmentId =
    selectedAppointment?.sourceProcedureBlockAppointment?._id ||
    selectedAppointment?.sourceProcedureBlockAppointment?.id ||
    getRecareSourceId(selectedAppointment) ||
    liveAppt?.sourceProcedureBlockAppointment?._id ||
    liveAppt?.sourceProcedureBlockAppointment?.id ||
    getRecareSourceId(liveAppt);
  const sourceHistoryAppointment = sourceAppointmentId
    ? patientHistoryList.find(a => String(getAppointmentId(a)) === String(sourceAppointmentId))
    : null;
  const sourceProcedureAppointment =
    selectedAppointment?.sourceProcedureBlockAppointment ||
    liveAppt?.sourceProcedureBlockAppointment ||
    sourceHistoryAppointment ||
    liveAppt ||
    null;
  const currentChainRootId =
    sourceAppointmentId ||
    getAppointmentId(sourceProcedureAppointment) ||
    getAppointmentId(liveAppt);
  const sourceProcedureAppointmentId = getAppointmentId(sourceProcedureAppointment) || currentChainRootId;
  const recareAppointmentsForSource = sourceProcedureAppointmentId
    ? patientHistoryList.filter(a => String(getRecareSourceId(a) || '') === String(sourceProcedureAppointmentId))
    : [];
  const getProcedureKey = (procedure) =>
    typeof procedure === 'string'
      ? `|${procedure}`.trim().toLowerCase()
      : `${procedure?.code || procedure?.procedureCode || procedure?.ProcCode || ''}|${procedure?.treatment || procedure?.description || procedure?.name || ''}`.trim().toLowerCase();
  const recareProcedureDateMap = recareAppointmentsForSource.reduce((acc, appointment) => {
    const procedures = Array.isArray(appointment.customFields?.procedures)
      ? appointment.customFields.procedures
      : Array.isArray(appointment.procedures)
        ? appointment.procedures
        : [];
    procedures.forEach((procedure) => {
      const key = getProcedureKey(procedure);
      if (!key || !appointment.appointmentDate) return;
      if (!acc[key]) acc[key] = [];
      acc[key].push(appointment.appointmentDate);
    });
    return acc;
  }, {});
  const latestRecareAppointment = recareAppointmentsForSource[0] || null;
  const procedureBlockAppointment = sourceProcedureAppointment
    ? {
        ...sourceProcedureAppointment,
        appointmentDate: latestRecareAppointment?.appointmentDate || sourceProcedureAppointment.appointmentDate,
        startTime: latestRecareAppointment?.startTime || sourceProcedureAppointment.startTime,
        endTime: latestRecareAppointment?.endTime || sourceProcedureAppointment.endTime,
        durationMinutes: latestRecareAppointment?.durationMinutes || sourceProcedureAppointment.durationMinutes,
        recareProcedureDateMap,
      }
    : liveAppt;

  const currentPatientId = currentPatient?._id || currentPatient?.id || currentPatient?.PatNum;

  useEffect(() => {
    if (currentPatientId) {
      dispatch(fetchPatientHistory(currentPatientId));
      setShowAllHistory(false);
    }
  }, [currentPatientId, dispatch]);

  const getAppointmentPatientId = (appointment) =>
    currentPatient?._id ||
    currentPatient?.id ||
    currentPatient?.PatNum ||
    (appointment?.patientId && typeof appointment.patientId === 'object' ? (appointment.patientId._id || appointment.patientId.id || appointment.patientId.PatNum) : appointment?.patientId) ||
    (appointment?.patient && typeof appointment.patient === 'object' ? (appointment.patient._id || appointment.patient.id || appointment.patient.PatNum) : appointment?.patient);
  const shouldShowAllChecklistSections = (appointment) => {
    const status = String(appointment?.status || '').toLowerCase();
    return status !== 'scheduled' && status !== 'unconfirmed';
  };
  const historyAppointments = currentChainRootId
    ? patientHistoryList.filter((appointment) => {
        const appointmentId = getAppointmentId(appointment);
        return (
          String(appointmentId) === String(currentChainRootId) ||
          String(getRecareSourceId(appointment) || '') === String(currentChainRootId)
        );
      })
    : (liveAppt ? [liveAppt] : []);
  const effectiveHistoryAppointments = historyAppointments.length > 0 ? historyAppointments : (liveAppt ? [liveAppt] : []);
  const visibleHistoryAppointments = showAllHistory ? effectiveHistoryAppointments : effectiveHistoryAppointments.slice(0, 5);

  const handleHistoryAppointmentClick = (appointment) => {
    const next = {
      ...appointment,
      id: appointment.id || appointment._id,
    };
    selectedApptRef.current = next;
    setSelectedAppointment(next);
    if (onSelectAppointment) onSelectAppointment(next);
  };

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
                <Box
                  sx={{
                    maxHeight: showAllHistory ? 620 : 'none',
                    overflowY: showAllHistory ? 'auto' : 'visible',
                    pr: showAllHistory ? '4px' : 0,
                  }}
                >
                  {visibleHistoryAppointments.map((historyAppt, index) => {
                    const historyId = getAppointmentId(historyAppt);
                    const isSelected = historyId && selectedAppointmentId && String(historyId) === String(selectedAppointmentId);
                    return (
                      <Box
                        key={historyId || index}
                        sx={{
                          border: isSelected ? `2px solid ${COLORS.ACCENT}` : '1px solid transparent',
                          borderRadius: '12px',
                          p: isSelected ? '4px' : 0,
                          mb: '8px',
                          boxShadow: isSelected ? '0 0 0 1px rgba(35, 98, 239, 0.2)' : 'none',
                        }}
                      >
                        <AppointmentSummaryCard
                          appointment={historyAppt}
                          selected={false}
                          onClick={() => handleHistoryAppointmentClick(historyAppt)}
                        />
                        <Box onClick={(e) => e.stopPropagation()}>
                          <AppointmentChecklist
                            patientId={getAppointmentPatientId(historyAppt)}
                            appointment={historyAppt}
                            showAllSections={shouldShowAllChecklistSections(historyAppt)}
                          />
                        </Box>
                      </Box>
                    );
                  })}
                </Box>
                {effectiveHistoryAppointments.length > 5 && !showAllHistory && (
                  <Box
                    onClick={() => setShowAllHistory(true)}
                    sx={{
                      mt: '8px',
                      py: '8px',
                      textAlign: 'center',
                      border: `1px solid ${COLORS.BORDER}`,
                      borderRadius: '8px',
                      color: COLORS.ACCENT,
                      fontSize: '13px',
                      fontWeight: 600,
                      cursor: 'pointer',
                      '&:hover': { backgroundColor: COLORS.SURFACE_HOVER },
                    }}
                  >
                    See all
                  </Box>
                )}
              </>
            )}

            {currentPatient && patientHistoryLoading && !selectedAppointment && (
              <Box sx={{ fontSize: '12px', color: COLORS.TEXT_MUTED, mt: '8px' }}>
                Loading appointment history...
              </Box>
            )}

            {/* Actions require a patient */}
            {currentPatient && (
              <PatientActions key={`actions-${currentPatient._id || currentPatient.id}`} appointment={procedureBlockAppointment} />
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
