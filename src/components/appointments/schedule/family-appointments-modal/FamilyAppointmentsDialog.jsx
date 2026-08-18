import { useState, useEffect, useCallback, useMemo } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  IconButton,
  Tabs,
  Tab,
} from "@mui/material";
import {
  Close as CloseIcon,
  Print as PrintIcon,
  PeopleAlt as PeopleAltIcon,
  CalendarToday as CalendarTodayIcon,
  EventBusy as EventBusyIcon,
} from "@mui/icons-material";
import dayjs from "dayjs";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchFamilyAppointments,
  selectFamilyAppointmentsList,
  selectFamilyAppointmentsMembers,
} from "../../../../store/slices/appointmentSlice";
import { fetchCurrentPracticeInfo } from "../../../../store/slices/practiceInfoSlice";
import { COLORS } from "../../../../constants/colors";
import { fontWeight } from "../../../../constants/styles";
import { usePatient, useScheduleState } from "../../../../hooks/redux";

import FamilyAppointmentsScheduledTab from './FamilyAppointmentsScheduledTab';
import FamilyAppointmentsDueTab from './FamilyAppointmentsDueTab';
import medflowLogo from '../../../../assets/medflow-logo.png';

const FamilyAppointmentsDialog = () => {
  const [tabValue, setTabValue] = useState(0);

  const dispatch = useDispatch();
  const allAppointments = useSelector(selectFamilyAppointmentsList);
  const familyMembers = useSelector(selectFamilyAppointmentsMembers);

  const { currentPatient: patient } = usePatient();

  const { familyAppointmentsDialogOpen: open, setFamilyAppointmentsDialogOpen } = useScheduleState();
  const onClose = () => setFamilyAppointmentsDialogOpen(false);

  // Stabilise the IDs so the callback reference doesn't change on every render
  const patientId = patient?.id || patient?._id;

  const fetchFamilyAppointmentsData = useCallback(() => {
    if (!patientId) return;
    dispatch(fetchFamilyAppointments(patientId));
  }, [patientId, dispatch]);

  useEffect(() => {
    if (open) {
      fetchFamilyAppointmentsData();
      dispatch(fetchCurrentPracticeInfo(true));
    }
  }, [open, fetchFamilyAppointmentsData, dispatch]);

  const handleTabChange = (_, newValue) => setTabValue(newValue);

  // Helper: extract a plain patient-id string from whatever shape the API returns
  const getApptPatientId = (appt) => {
    if (!appt.patientId) return null;
    if (typeof appt.patientId === 'string') return appt.patientId;
    return appt.patientId._id || appt.patientId.id || null;
  };

  // Group scheduled appointments by family member
  const groupedAppointments = patient
    ? [patient, ...familyMembers].filter(Boolean).map((member) => {
        const memberId = member.id || member._id;
        return {
          name: `${member.firstName} ${member.lastName}`,
          appointments: allAppointments.filter(
            (appt) =>
              getApptPatientId(appt) === memberId &&
              dayjs(appt.appointmentDate).isAfter(dayjs().subtract(1, "day"), "day")
          ),
        };
      })
    : [];

  const dueAppointments = allAppointments
    .filter((appt) => dayjs(appt.appointmentDate).isBefore(dayjs(), "day"))
    .sort((a, b) => dayjs(b.appointmentDate).diff(dayjs(a.appointmentDate)));

  const getPatientName = (appt) => {
    if (appt.patientId?.firstName) return `${appt.patientId.firstName} ${appt.patientId.lastName}`;
    const allMembers = [patient, ...familyMembers].filter(Boolean);
    const apptPid = getApptPatientId(appt);
    const found = allMembers.find((m) => (m.id || m._id) === apptPid);
    return found ? `${found.firstName} ${found.lastName}` : "Unknown Patient";
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth={false}
      sx={{ zIndex: 1500 }}
      PaperProps={{
        sx: {
          width: '940px',
          height: '740px',
          maxWidth: 'none',
          borderRadius: '12px',
          border: '1px solid #e0e5eb',
          boxShadow: '0px 8px 24px rgba(0, 0, 0, 0.1)',
          m: 2,
          display: 'flex',
          flexDirection: 'column',
        },
      }}
    >
      {/* ── HEADER ─────────────────────────────────────────────────────────── */}
      <DialogTitle
        sx={{
          display: "flex", alignItems: "center", gap: "12px",
          px: "10px", py: "10px",
          borderBottom: "1px solid #e0e5eb", flexShrink: 0,
          backgroundColor: "#f3f8fd",
          m: 0,
        }}
      >
        <Box sx={{
          width: "36px", height: "36px", borderRadius: "8px",
          backgroundColor: "#eff6ff",
          display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
        }}>
          <PeopleAltIcon sx={{ fontSize: "20px", color: "#2262ef" }} />
        </Box>

        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', flex: 1 }}>
          <Typography sx={{
            display: "flex", flexDirection: "column", justifyContent: "flex-start",
            alignItems: "flex-start", height: "24px", padding: "0px",
            fontFamily: "Inter", fontSize: "15px", fontWeight: 700, color: "#09121f",
            whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'
          }}>
            Family Appointments
          </Typography>
          
          <Typography sx={{
            fontWeight: 400, lineHeight: "16.25px", letterSpacing: "0px",
            textAlign: "left", color: "#5c646f", fontFamily: "Inter", fontSize: "11px",
          }}>
            {patient ? `${patient.firstName} ${patient.lastName}` : "No patient selected"}
          </Typography>
        </Box>

        <IconButton onClick={onClose} size="small" sx={{ color: "#6b7280", ml: 1 }}>
          <CloseIcon sx={{ fontSize: "18px" }} />
        </IconButton>
      </DialogTitle>

      {/* ── TABS & PRINT BAR ────────────────────────────────────────────────── */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          borderBottom: `1px solid ${COLORS.BORDER_LIGHT}`,
          px: "24px",
          backgroundColor: COLORS.WHITE,
          flexShrink: 0,
        }}
      >
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          sx={{
            minHeight: "unset",
            "& .MuiTabs-indicator": { backgroundColor: COLORS.ACCENT },
          }}
        >
          <Tab
            icon={<CalendarTodayIcon sx={{ fontSize: 14 }} />}
            iconPosition="start"
            label="Scheduled"
            sx={{
              textTransform: "none",
              py: 1.5,
              minHeight: "unset",
              fontWeight: fontWeight.semibold,
              fontSize: "13px",
              color: COLORS.TEXT_MUTED,
              gap: '4px',
              "&.Mui-selected": { color: COLORS.ACCENT },
            }}
          />
          <Tab
            icon={<EventBusyIcon sx={{ fontSize: 14 }} />}
            iconPosition="start"
            label="Due"
            sx={{
              textTransform: "none",
              py: 1.5,
              minHeight: "unset",
              fontWeight: fontWeight.semibold,
              fontSize: "13px",
              color: COLORS.TEXT_MUTED,
              gap: '4px',
              "&.Mui-selected": { color: COLORS.ACCENT },
            }}
          />
        </Tabs>

        <Button
          variant="outlined"
          size="small"
          onClick={() => window.print()}
          startIcon={<PrintIcon sx={{ fontSize: '14px' }} />}
          sx={{
            textTransform: "none",
            borderRadius: "8px",
            px: 2,
            height: 30,
            fontSize: "12px",
            fontWeight: 600,
            borderColor: "#2362EF",
            color: "#2362EF",
            "&:hover": { borderColor: "#1a50cc", backgroundColor: "rgba(35, 98, 239, 0.04)" }
          }}
        >
          Print
        </Button>
      </Box>

      {/* ── CONTENT ─────────────────────────────────────────────────────────── */}
      <DialogContent
        sx={{
          p: 0,
          flex: 1,
          display: "flex",
          overflow: "hidden",
          backgroundColor: "#fff",
          "@media print": { p: 0, '& .no-print': { display: 'none !important' } },
        }}
      >
        <style>
          {`
            @media print {
              body * { visibility: hidden; }
              .printable-family-content, .printable-family-content * { visibility: visible; }
              .printable-family-content { position: absolute; left: 0; top: 0; width: 100%; overflow: visible !important; }
              .MuiDialog-root, .MuiDialog-container, .MuiDialog-paper,
              .MuiDialogContent-root { overflow: visible !important; position: static !important; height: auto !important; max-height: none !important; }
            }
          `}
        </style>
        <Box className="printable-family-content" sx={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column' }}>
          {/* Print-only Medflow Logo at Top Center */}
          <Box sx={{ display: 'none', '@media print': { display: 'flex', justifyContent: 'center', width: '100%', mb: 3, pt: 2 } }}>
            <img src={medflowLogo} alt="Medflow Logo" style={{ height: 45, objectFit: 'contain' }} />
          </Box>
          {tabValue === 0 ? (
          <FamilyAppointmentsScheduledTab 
            allAppointments={allAppointments}
            groupedAppointments={groupedAppointments}
            getPatientName={getPatientName}
          />
        ) : (
          <FamilyAppointmentsDueTab 
            dueAppointments={dueAppointments}
            getPatientName={getPatientName}
          />
        )}
        </Box>
      </DialogContent>

      {/* ── FOOTER ─────────────────────────────────────────────────────────── */}
      <DialogActions
        sx={{
          p: "12px 24px",
          borderTop: '1px solid #e0e5eb',
          backgroundColor: '#fff',
          flexShrink: 0,
        }}
      >
        <Button
          onClick={onClose}
          variant="outlined"
          size="small"
          sx={{
            fontFamily: "Inter", fontSize: "13px", fontWeight: 500,
            textTransform: "none", borderRadius: "8px",
            border: "1px solid #d0d5dd", color: "#374151",
            px: "16px", py: "7px",
            "&:hover": { borderColor: "#9aa3ae", backgroundColor: "#f9fafb" },
          }}
        >
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default FamilyAppointmentsDialog;
