import { useState, useEffect, useCallback } from "react";
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
} from "../../../../store/slices/appointmentSlice";
import { fetchCurrentPracticeInfo } from "../../../../store/slices/practiceInfoSlice";
import { COLORS } from "../../../../constants/colors";
import { fontWeight } from "../../../../constants/styles";
import { usePatient, useScheduleState } from "../../../../hooks/redux";

import FamilyAppointmentsScheduledTab from './FamilyAppointmentsScheduledTab';
import FamilyAppointmentsDueTab from './FamilyAppointmentsDueTab';

const FamilyAppointmentsDialog = () => {
  const [tabValue, setTabValue] = useState(0);

  const dispatch = useDispatch();
  let allAppointments = useSelector(selectFamilyAppointmentsList);

  const { currentPatient: patient, patientDetails } = usePatient();
  const familyMembers = patientDetails?.familyMembers || [];

  const { familyAppointmentsDialogOpen: open, setFamilyAppointmentsDialogOpen } = useScheduleState();
  const onClose = () => setFamilyAppointmentsDialogOpen(false);

  // Inject dummy data when no real data is loaded
  if (allAppointments.length === 0 && patient) {
    const members = [patient, ...familyMembers].filter(Boolean);
    allAppointments = members.flatMap((member) => {
      const memberId = member.id || member._id;
      return [
        {
          _id: `dummy-1-${memberId}`,
          patientId: member,
          appointmentDate: dayjs().add(2, "day").toISOString(),
          startTime: dayjs().add(2, "day").hour(10).minute(0).toISOString(),
          time: dayjs().add(2, "day").hour(10).minute(0).format("hh:mm A"),
          visitType: "Maintenance",
          procedures: "Maintenance, fl",
          provider: "Dr. Smith",
          headerColor: "#6d5fc7",
          status: "confirmed",
          providerId: { firstName: "Dr.", lastName: "Smith" },
        },
        {
          _id: `dummy-2-${memberId}`,
          patientId: member,
          appointmentDate: dayjs().add(1, "month").toISOString(),
          startTime: dayjs().add(1, "month").hour(14).minute(30).toISOString(),
          time: dayjs().add(1, "month").hour(14).minute(30).format("hh:mm A"),
          visitType: "Exam",
          procedures: "Comprehensive Exam",
          provider: "Dr. Smith",
          headerColor: "#2563eb",
          status: "unconfirmed",
          providerId: { firstName: "Dr.", lastName: "Smith" },
        },
        {
          _id: `dummy-due-${memberId}`,
          patientId: member,
          appointmentDate: dayjs().subtract(2, "month").toISOString(),
          startTime: dayjs().subtract(2, "month").hour(9).minute(0).toISOString(),
          time: dayjs().subtract(2, "month").hour(9).minute(0).format("hh:mm A"),
          visitType: "Follow Up",
          procedures: "Follow up visit",
          provider: "Dr. Smith",
          headerColor: "#dc2626",
          status: "no_show",
          providerId: { firstName: "Dr.", lastName: "Smith" },
        },
      ];
    });
  }

  const fetchFamilyAppointmentsData = useCallback(() => {
    if (!patient) return;
    const patientId = patient.id || patient._id;
    const familyIds = familyMembers
      .map((m) => m.id || m._id)
      .filter((id) => id && id !== patientId);
    dispatch(fetchFamilyAppointments([patientId, ...familyIds]));
  }, [patient, familyMembers, dispatch]);

  useEffect(() => {
    if (open) {
      fetchFamilyAppointmentsData();
      dispatch(fetchCurrentPracticeInfo(true));
    }
  }, [open, fetchFamilyAppointmentsData, dispatch]);

  const handleTabChange = (_, newValue) => setTabValue(newValue);

  // Group scheduled appointments by family member
  const groupedAppointments = patient
    ? [patient, ...familyMembers].filter(Boolean).map((member) => {
        const memberId = member.id || member._id;
        return {
          name: `${member.firstName} ${member.lastName}`,
          appointments: allAppointments.filter(
            (appt) =>
              (appt.patientId?._id || appt.patientId) === memberId &&
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
    const found = allMembers.find((m) => (m.id || m._id) === (appt.patientId?._id || appt.patientId));
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
          borderRadius: '14px',
          border: `1px solid ${COLORS.BORDER}`,
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
          boxSizing: "border-box",
          px: "25px",
          py: "16px",
          display: "flex",
          alignItems: "center",
          gap: "8px",
          borderBottom: `1px solid ${COLORS.BORDER}`,
          backgroundColor: COLORS.SURFACE_TINT,
          m: 0,
          flexShrink: 0,
        }}
      >
        <PeopleAltIcon sx={{ fontSize: "20px", color: COLORS.ACCENT }} />
        <Typography sx={{ fontSize: "15px", fontWeight: 600, color: COLORS.TEXT_PRIMARY, flex: 1 }}>
          Family Appointments{patient ? ` — ${patient.firstName} ${patient.lastName}` : ""}
        </Typography>
        <IconButton onClick={onClose} size="small" sx={{ color: COLORS.TEXT_SECONDARY }}>
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
          backgroundColor: "#f8fafc",
        }}
      >
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
      </DialogContent>

      {/* ── FOOTER ─────────────────────────────────────────────────────────── */}
      <DialogActions
        sx={{
          p: "12px 24px",
          borderTop: `1px solid ${COLORS.BORDER_LIGHT}`,
          backgroundColor: COLORS.WHITE,
          flexShrink: 0,
        }}
      >
        <Button
          onClick={onClose}
          variant="outlined"
          size="small"
          sx={{
            borderColor: COLORS.BORDER,
            color: COLORS.TEXT_SECONDARY,
            "&:hover": { borderColor: COLORS.TEXT_SECONDARY, backgroundColor: "transparent" },
            textTransform: "none",
            borderRadius: "6px",
            px: "20px",
            height: 32,
            fontSize: "13px",
            fontWeight: fontWeight.medium,
          }}
        >
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default FamilyAppointmentsDialog;
