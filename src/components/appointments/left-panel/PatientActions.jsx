import { Box, Typography, Divider } from '@mui/material';
import { KeyboardArrowUp } from '@mui/icons-material';
import { useDispatch } from 'react-redux';
import { PatientDetails, FamilyDetails } from './PatientDetails';
import { usePatient } from '../../../hooks/redux';
import { useAppointmentDetail } from '../../../hooks/redux';
import {
  fetchPatientHistory,
  fetchFamilyAppointments,
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

const PatientActions = () => {
  const dispatch = useDispatch();
  const { selectedPatientId }  = usePatient();
  const { currentAppointment } = useAppointmentDetail();

  // Extract the first procedure from the current appointment for the procedure row.
  // Falls back to appointment type name if no explicit procedure list is present.
  const firstProcedure = currentAppointment?.procedures?.[0];
  const procedureLabel = firstProcedure
    ? `${firstProcedure.code || ''} ${firstProcedure.name || ''}`.trim()
    : currentAppointment?.appointmentTypeName || '';

  // Duration from the current appointment in minutes.
  const durationLabel = currentAppointment?.duration ? `${currentAppointment.duration} min` : '__ min';

  // ── Button handlers ──────────────────────────────────────────────────────────

  const handleAppointmentHistory = () => {
    if (!selectedPatientId) return;
    // fetchPatientHistory expects a bare patientId string, not an object.
    // Result lands in state.appointment.patientHistoryList — wire to a
    // right-panel or modal in the parent page when that is implemented.
    dispatch(fetchPatientHistory(selectedPatientId));
  };

  const handleFamilyAppointments = () => {
    if (!selectedPatientId) return;
    // fetchFamilyAppointments expects an array of IDs so it can batch-fetch
    // appointments for all family members simultaneously.
    dispatch(fetchFamilyAppointments([selectedPatientId]));
  };

  // Route Slip and Purchase Products require a separate modal/drawer — they are
  // wired as stubs here; the page component will add the dialog trigger later.
  const handleRouteSlip = () => {
    // TODO: dispatch openRouteSlipDialog() or navigate to route slip page
  };

  const ACTION_BUTTONS = [
    { label: 'Route Slip',           onClick: handleRouteSlip,             showDots: true  },
    { label: 'Family Appointments',  onClick: handleFamilyAppointments,    showDots: true  },
    { label: 'Appointment History',  onClick: handleAppointmentHistory,    showDots: false },
  ];

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: '8px', mt: '2px' }}>

      <Divider sx={{ borderColor: COLORS.BORDER, my: '6px' }} />

      {/* ── Procedure row ────────────────────────────────────────────────────── */}
      {/* Shows the primary procedure for the currently selected appointment.
          Greyed out when no appointment is active. */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          backgroundColor: COLORS.SURFACE_CARD,
          border: `1px solid ${COLORS.BORDER}`,
          borderRadius: radius.md,
          px: '12px',
          py: '10px',
        }}
      >
        <Typography sx={{ ...headingSecondarySx, color: procedureLabel ? COLORS.TEXT_PRIMARY : COLORS.TEXT_MUTED }}>
          {procedureLabel || 'No procedure scheduled'}
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Typography sx={{ fontSize: fontSize.base, color: COLORS.TEXT_MUTED }}>
            {durationLabel}
          </Typography>
          <KeyboardArrowUp sx={{ fontSize: '18px', color: COLORS.TEXT_SECONDARY }} />
        </Box>
      </Box>

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

      {/* ── Purchase Products — disabled until an appointment is confirmed ───── */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#c5cad3',
          borderRadius: radius.md,
          px: '16px',
          py: '12px',
          cursor: 'not-allowed',
        }}
      >
        <Typography sx={{ fontSize: fontSize.md, fontWeight: fontWeight.semibold, color: COLORS.WHITE }}>
          Purchase Products
        </Typography>
      </Box>

      {/* ── Accordions ──────────────────────────────────────────────────────── */}
      <PatientDetails />
      <FamilyDetails />
    </Box>
  );
};

export default PatientActions;
