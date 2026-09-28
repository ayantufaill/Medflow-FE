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
  fetchPatientHistory,
  selectFamilyAppointmentsList,
  selectFamilyAppointmentsMembers,
  selectFamilyAppointmentsRecareDueDates,
  selectFamilyAppointmentsSchedulingDate,
  selectFamilyAppointmentsSchedulingTime,
  selectFamilyAppointmentsSchedulingRoomId,
  createAppointmentThunk,
} from "../../../../store/slices/appointmentSlice";
import { fetchCurrentPracticeInfo } from "../../../../store/slices/practiceInfoSlice";
import { COLORS } from "../../../../constants/colors";
import { fontWeight } from "../../../../constants/styles";
import { usePatient, useScheduleState, useAppointmentDetail } from "../../../../hooks/redux";

import FamilyAppointmentsScheduledTab from './FamilyAppointmentsScheduledTab';
import FamilyAppointmentsDueTab from './FamilyAppointmentsDueTab';
import medflowLogo from '../../../../assets/medflow-logo.png';

const FamilyAppointmentsDialog = () => {
  const [tabValue, setTabValue] = useState(0);
  const [selectedProcedures, setSelectedProcedures] = useState({});

  const dispatch = useDispatch();
  const allAppointments = useSelector(selectFamilyAppointmentsList);
  const familyMembers = useSelector(selectFamilyAppointmentsMembers);
  const recareDueDates = useSelector(selectFamilyAppointmentsRecareDueDates);

  const { currentPatient: patient } = usePatient();
  const { currentAppointment } = useAppointmentDetail();

  const { familyAppointmentsDialogOpen: open, setFamilyAppointmentsDialogOpen } = useScheduleState();
  const schedulingDate = useSelector(selectFamilyAppointmentsSchedulingDate);
  const schedulingTime = useSelector(selectFamilyAppointmentsSchedulingTime);
  const schedulingRoomId = useSelector(selectFamilyAppointmentsSchedulingRoomId);

  // Reset selectedProcedures whenever the dialog opens so stale selections don't persist
  useEffect(() => {
    if (open) {
      setSelectedProcedures({});
    }
  }, [open]);

  const isAnyProcedureSelected = Object.values(selectedProcedures).some(
    (procs) => procs && procs.length > 0
  );
  const isScheduling = !!schedulingDate && open;
  const onClose = () => { setFamilyAppointmentsDialogOpen(false); };

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

  const handleScheduleSubmit = () => {
    let slotOffset = 0;
    const dispatchPromises = [];
    const dateStr = schedulingDate || dayjs().format("YYYY-MM-DD");
    
    const sourceApptIdFallback = currentAppointment?.id || currentAppointment?._id || currentAppointment?.appointmentId || currentAppointment?.AptNum;

    Object.entries(selectedProcedures).forEach(([mid, procs]) => {
      if (!procs || procs.length === 0) return;
      const duration = 30 + (procs.length - 1) * 15;
      
      const startHour = schedulingTime ? schedulingTime.hour : 9;
      const startMins = schedulingTime ? schedulingTime.mins : 0;
      
      const slotStart = dayjs(dateStr).hour(startHour).minute(startMins).add(slotOffset, 'minute');

      const allMembers = [patient, ...(familyMembers || [])].filter(Boolean);
      const memberObj = allMembers.find(m => (m.id || m._id) === mid);

      // Determine providerId based on procedures or patient's preferred provider
      let chosenProviderId = null;
      let procSourceApptId = null;
      for (const proc of procs) {
        if (!chosenProviderId && (proc.providerId || proc.provider || proc.ProvNum)) {
          chosenProviderId = proc.providerId || proc.provider || proc.ProvNum;
        }
        if (!procSourceApptId && proc.sourceAppointmentId) {
          procSourceApptId = proc.sourceAppointmentId;
        }
      }
      if (!chosenProviderId && memberObj) {
        chosenProviderId = 
          memberObj.preferredDentistId || 
          memberObj.preferredDentist || 
          memberObj.preferredProviderId || 
          memberObj.providerId || 
          memberObj.primaryProviderId ||
          memberObj.customFields?.preferredDentist ||
          memberObj.customFields?.preferredDentistId;
      }
      
      // If chosenProviderId is an object, extract its ID
      if (chosenProviderId && typeof chosenProviderId === 'object') {
        chosenProviderId = chosenProviderId._id || chosenProviderId.id || chosenProviderId.ProvNum || null;
      }

      // Fallback to patient's preferred provider or current appointment's provider
      if (!chosenProviderId && patient) {
        chosenProviderId = patient.preferredDentistId || patient.preferredDentist || patient.preferredProviderId || patient.providerId || patient.primaryProviderId || patient.customFields?.preferredDentist || patient.customFields?.preferredDentistId;
        if (chosenProviderId && typeof chosenProviderId === 'object') {
          chosenProviderId = chosenProviderId._id || chosenProviderId.id || chosenProviderId.ProvNum || null;
        }
      }

      // Final fallback to current appointment's provider
      if (!chosenProviderId && currentAppointment) {
        const apptProvider = currentAppointment.provider;
        chosenProviderId = typeof apptProvider === 'object' ? (apptProvider._id || apptProvider.id || apptProvider.ProvNum) : apptProvider;
      }

      const mappedProcs = procs.map(proc => ({ 
        ...proc,
        code: proc.code, 
        treatment: proc.procedureName || proc.treatment || proc.code,
        provider: proc.provider || proc.providerId || proc.ProvNum || chosenProviderId,
        charge: proc.charge || proc.fee || "$0.00",
        dueDate: proc.dueDate || undefined,
      }));
      
      const memberSourceApptId = procSourceApptId || sourceApptIdFallback || undefined;

      const payload = {
        patientId: mid,
        roomId: schedulingRoomId,
        providerId: chosenProviderId || undefined,
        appointmentDate: slotStart.format("YYYY-MM-DD"),
        startTime: slotStart.format("HH:mm"),
        endTime: slotStart.add(duration, "minute").format("HH:mm"),
        durationMinutes: duration,
        visitType: "recare",
        procedures: mappedProcs,
        customFields: {
          visitType: "recare",
          procedures: mappedProcs,
          preferredDentist: memberObj?.customFields?.preferredDentist || memberObj?.preferredDentistId || undefined,
          preferredHygienist: memberObj?.customFields?.preferredHygienist || memberObj?.preferredHygienist || undefined,
          recareSourceAppointmentId: memberSourceApptId,
          sourceAppointmentId: memberSourceApptId,
        },
        status: "scheduled",
      };
      const createPromise = dispatch(createAppointmentThunk(payload));
      dispatchPromises.push({ createPromise, memberId: mid });
      slotOffset += duration;
    });
    
    // Await all creations then refresh patient history for every affected patient
    // so the ProcedureBlocks scheduled-date map is up-to-date.
    Promise.all(dispatchPromises.map(({ createPromise }) => createPromise)).then(() => {
      const affectedIds = new Set(dispatchPromises.map(({ memberId }) => memberId));
      if (patientId) affectedIds.add(String(patientId));
      affectedIds.forEach((id) => dispatch(fetchPatientHistory(id)));
    });

    setFamilyAppointmentsDialogOpen(false);
  };

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
            isScheduling={isScheduling}
            selectedProcedures={selectedProcedures}
            setSelectedProcedures={setSelectedProcedures}
            recareDueDates={recareDueDates}
            patientId={patientId}
            familyMembers={familyMembers}
            patient={patient}
            onClose={onClose}
            onSubmit={handleScheduleSubmit}
          />
        ) : (
          <FamilyAppointmentsDueTab 
            recareDueDates={recareDueDates}
            patientId={patientId}
            familyMembers={familyMembers}
            patient={patient}
          />
        )}
        </Box>
      </DialogContent>

      {/* ── FOOTER ─────────────────────────────────────────────────── */}
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
