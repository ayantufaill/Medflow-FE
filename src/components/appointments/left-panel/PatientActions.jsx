import { useState } from 'react';
import { Box, Typography, Divider } from '@mui/material';
import { KeyboardArrowUp } from '@mui/icons-material';
import { useDispatch } from 'react-redux';
import { PatientDetails, FamilyDetails } from './PatientDetailsCard';
import AppointmentHistoryDialog from '../schedule/appointment-history-modal/AppointmentHistoryDialog';
import PurchaseProductDialog from './PurchaseProductDialog';
import ProcedureBlocks from './ProcedureBlocks';
import { usePatient, useScheduleState } from '../../../hooks/redux';
import { useAppointmentDetail } from '../../../hooks/redux';
import {
  fetchPatientHistory,
} from '../../../store/slices/appointmentSlice';
import { COLORS } from '../../../constants/colors';
import { fontSize, fontWeight, radius, headingSecondarySx } from '../../../constants/styles';

// Six-dot decorative drag handle shown on action buttons.
const DotGrid = ({ color = 'rgba(255,255,255,0.6)' }) => (
  <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, 3px)', gap: '3px' }}>
    {Array.from({ length: 6 }).map((_, i) => (
      <Box key={i} sx={{ width: '3px', height: '3px', borderRadius: '50%', backgroundColor: color }} />
    ))}
  </Box>
);

// PatientActions is shown beneath PatientCard when a patient is selected.
// It reads the current appointment's procedure from Redux and dispatches
// history/family-appointments fetch thunks when the user clicks those buttons.

const PatientActions = ({ appointment }) => {
  const dispatch = useDispatch();
  const { selectedPatientId, currentPatient }  = usePatient();
  const { currentAppointment } = useAppointmentDetail();
  const { setRouteSlipDialogOpen, setFamilyAppointmentsDialogOpen } = useScheduleState();

  // Use the passed appointment from the left panel if available, otherwise fallback to Redux
  const activeAppt = appointment || currentAppointment;

  // Determine procedure text. The calendar appointment passes procedures as a string,
  // but Redux might store it as an array or object. We handle both.
  let procedureLabel = '';
  if (typeof activeAppt?.procedures === 'string') {
    procedureLabel = activeAppt.procedures;
  } else if (Array.isArray(activeAppt?.procedures)) {
    const firstProcedure = activeAppt.procedures[0];
    procedureLabel = firstProcedure ? `${firstProcedure.code || ''} ${firstProcedure.name || ''}`.trim() : '';
  }
  
  if (!procedureLabel) {
    procedureLabel = activeAppt?.appointmentTypeName || activeAppt?.visitType || activeAppt?.appointmentType || '';
  }

  // Duration from the current appointment in minutes. Calendar appointments use durationMinutes.
  const apptDuration = activeAppt?.durationMinutes || activeAppt?.duration;
  const durationLabel = apptDuration ? `${apptDuration} min` : '__ min';

  const [appointmentHistoryOpen, setAppointmentHistoryOpen] = useState(false);

  const [purchaseProductOpen, setPurchaseProductOpen] = useState(false);

  // ── Button handlers ──────────────────────────────────────────────────────────

  const handleAppointmentHistory = () => {
    if (!selectedPatientId) return;
    dispatch(fetchPatientHistory(selectedPatientId));
    setAppointmentHistoryOpen(true);
  };

  const handleFamilyAppointments = () => {
    if (!selectedPatientId) return;
    setFamilyAppointmentsDialogOpen(true);
  };

  // Route Slip and Purchase Products require a separate modal/drawer — they are
  // wired as stubs here; the page component will add the dialog trigger later.
  const handleRouteSlip = () => {
    setRouteSlipDialogOpen(true);
  };

  const ACTION_BUTTONS = [
    { label: 'Route Slip',           onClick: handleRouteSlip,             showDots: true  },
    { label: 'Family Appointments',  onClick: handleFamilyAppointments,    showDots: true  },
    { label: 'Appointment History',  onClick: handleAppointmentHistory,    showDots: false },
  ];

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: '8px', mt: '2px' }}>

      <Divider sx={{ borderColor: COLORS.BORDER, my: '6px' }} />

      {/* ── Procedure Blocks ────────────────────────────────────────────────────── */}
      <ProcedureBlocks appointment={activeAppt} />

      {/* ── Blue action buttons ──────────────────────────────────────────────── */}
      {ACTION_BUTTONS.map(({ label, onClick, showDots }) => (
        <Box
          key={label}
          onClick={onClick}
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            backgroundColor: COLORS.ACCENT,
            borderRadius: radius.md,
            px: '16px',
            py: '12px',
            cursor: 'pointer',
            '&:hover': { backgroundColor: COLORS.ACCENT_HOVER },
          }}
        >
          <Typography sx={{ fontSize: fontSize.md, fontWeight: fontWeight.semibold, color: COLORS.WHITE }}>
            {label}
          </Typography>
          {showDots && <DotGrid />}
        </Box>
      ))}

      {/* ── Purchase Products ───── */}
      <Box
        onClick={() => setPurchaseProductOpen(true)}
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: COLORS.ACCENT, // changed from #c5cad3 to active blue
          borderRadius: radius.md,
          px: '16px',
          py: '12px',
          cursor: 'pointer', // changed from not-allowed
          '&:hover': { backgroundColor: COLORS.ACCENT_HOVER },
        }}
      >
        <Typography sx={{ fontSize: fontSize.md, fontWeight: fontWeight.semibold, color: COLORS.WHITE }}>
          Purchase Products
        </Typography>
      </Box>

      {/* ── Accordions ──────────────────────────────────────────────────────── */}
      <PatientDetails />
      <FamilyDetails />

      <AppointmentHistoryDialog 
        open={appointmentHistoryOpen} 
        onClose={() => setAppointmentHistoryOpen(false)} 
        patient={currentPatient} 
      />

      <PurchaseProductDialog 
        open={purchaseProductOpen} 
        onClose={() => setPurchaseProductOpen(false)} 
      />
    </Box>
  );
};

export default PatientActions;
