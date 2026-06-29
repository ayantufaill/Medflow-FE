import { useState, useCallback, useEffect, useMemo } from 'react';
import { Box } from '@mui/material';
import dayjs from 'dayjs';
import ScheduleGridHeader from '../../components/appointments/schedule/ScheduleGridHeader';
import ScheduleCalendar from '../../components/appointments/schedule/ScheduleCalendar';
import LeftPanel from '../../components/appointments/left-panel/LeftPanel';
import RightPanel from '../../components/appointments/right-panel/RightPanel';
import AddNewPatientAppointmentForm from '../../components/appointments/AddNewPatientAppointmentForm';
import { useDropdownData } from '../../hooks/redux/useDropdownData';
import { usePatients } from '../../hooks/redux/usePatient';
import { useAppointments } from '../../hooks/redux/useAppointments';
import { useSnackbar } from '../../contexts/SnackbarContext';
import { COLORS } from '../../constants/colors';
import { radius } from '../../constants/styles';

const OperatorySchedulePage = () => {
  const { showSnackbar } = useSnackbar();

  // ── Dropdown data (providers, rooms, appointment types) ──────────
  const { providers, rooms, appointmentTypes } = useDropdownData({
    providers: true,
    rooms: true,
    appointmentTypes: true,
  });

  // ── Patients for the form autocomplete ───────────────────────────
  const { patients, fetch: fetchPatients } = usePatients();
  const [loadingFormPatients, setLoadingFormPatients] = useState(false);

  const searchFormPatients = useCallback(async (search = '') => {
    try {
      setLoadingFormPatients(true);
      await fetchPatients({ page: 1, limit: 20, search, status: '' });
    } catch (err) {
      console.error('Error searching patients:', err);
    } finally {
      setLoadingFormPatients(false);
    }
  }, [fetchPatients]);

  // ── Modal state ───────────────────────────────────────────────────
  const [formOpen,   setFormOpen]   = useState(false);
  const [formSaving, setFormSaving] = useState(false);

  useEffect(() => {
    if (formOpen) searchFormPatients('');
  }, [formOpen, searchFormPatients]);

  const initialFormDateTime = useMemo(() => dayjs().hour(9).minute(0), []);

  // ── Appointments (for conflict detection inside the form) ─────────
  const { appointments, createAppointment } = useAppointments();

  // ── Submit handler ────────────────────────────────────────────────
  const handleSubmit = async (formData) => {
    if (!formData.patientId) {
      showSnackbar('Please select a patient.', 'warning');
      return;
    }
    const start = formData.appointmentDate && formData.startTime
      ? dayjs(`${formData.appointmentDate}T${formData.startTime}`)
      : dayjs();
    const duration = formData.durationMinutes || 30;
    const end = start.add(duration, 'minute');

    try {
      setFormSaving(true);
      await createAppointment({
        patientId:         formData.patientId,
        providerId:        formData.providerId,
        appointmentDate:   start.format('YYYY-MM-DD'),
        startTime:         start.format('HH:mm'),
        endTime:           end.format('HH:mm'),
        durationMinutes:   duration,
        chiefComplaint:    formData.chiefComplaint || '',
        notes:             formData.notes || '',
        status:            formData.status || 'scheduled',
        ...(formData.appointmentTypeId && { appointmentTypeId: formData.appointmentTypeId }),
        ...(formData.roomId            && { roomId:            formData.roomId }),
      });
      showSnackbar('Appointment created successfully', 'success');
      setFormOpen(false);
    } catch (err) {
      const msg = err.response?.data?.error?.message
        || err.response?.data?.message
        || 'Failed to create appointment.';
      showSnackbar(msg, 'error');
    } finally {
      setFormSaving(false);
    }
  };

  return (
    <Box sx={{ display: 'flex', width: '100%', height: 'calc(100vh - 65px)', gap: '8px', p: '8px', backgroundColor: COLORS.SURFACE_PAGE, boxSizing: 'border-box', overflow: 'hidden' }}>

      {/* LEFT PANEL — 1/5 */}
      <Box sx={{ flex: 1, minWidth: 0, height: '100%', backgroundColor: COLORS.SURFACE_CARD, borderRadius: radius.lg, border: `1px solid ${COLORS.BORDER}`, overflow: 'hidden' }}>
        <LeftPanel />
      </Box>

      {/* CENTER PANEL — 3/5 */}
      <Box sx={{ flex: 3, minWidth: 0, height: '100%', backgroundColor: COLORS.SURFACE_CARD, borderRadius: radius.lg, border: `1px solid ${COLORS.BORDER}`, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
        <ScheduleGridHeader onNewAppointment={() => setFormOpen(true)} />
        <ScheduleCalendar />
      </Box>

      {/* RIGHT PANEL — 1/5 */}
      <Box sx={{ flex: 1, minWidth: 0, height: '100%', overflowY: 'auto' }}>
        <RightPanel />
      </Box>

      {/* Add New Appointment Modal */}
      <AddNewPatientAppointmentForm
        open={formOpen}
        onCancel={() => setFormOpen(false)}
        onSubmit={handleSubmit}
        loading={formSaving}
        patients={patients || []}
        loadingPatients={loadingFormPatients}
        onPatientSearch={searchFormPatients}
        providers={providers || []}
        rooms={rooms || []}
        appointmentTypes={appointmentTypes || []}
        appointments={appointments || []}
        initialDateTime={initialFormDateTime}
      />
    </Box>
  );
};

export default OperatorySchedulePage;
